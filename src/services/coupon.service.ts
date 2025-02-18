import { MostWantedItems } from "../models/MostWantedItems";
import { Item, ItemPriceResponse } from "../types/item";
import { CustomError } from "../ErrorHandler";

import * as dotenv from "dotenv";
import { refreshToken } from "../utils/refreshToken";
import sequelize from "../config/connectionDb";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import { CouponResult } from "../types/coupon";
import { getCache, setCache } from "../utils/redisUtils";
dotenv.config();

const cache = new Map<string, Item[]>();
let { MERCADO_LIBRE_API_TOKEN,MERCADO_LIBRE_API_URL } = process.env;
/**
 * Retrieves item prices for a list of item IDs.
 *
 * @param itemIds List of item IDs
 * @returns List of item prices
 */
export const getItemPrices = async (itemIds: string[]): Promise<Item[]> => {
  const attributes = "id,price";
  const chunkSize = 50;
  const cacheKey = `itemPrices:${itemIds.join(",")}`;

  // Check if result is already cached
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  // Define a function to fetch prices for a chunk of item IDs
  const fetchPricesForChunk = async (chunk: string[]) => {
    const getItemsUrl = `${MERCADO_LIBRE_API_URL}/items?ids=${chunk.join(
      ","
    )}&attributes=${attributes}`;

    try {
      // Fetch prices with retry
      let { response } = await fetchWithRetry(getItemsUrl, 3, 500, MERCADO_LIBRE_API_TOKEN);
      if (response?.status === 401) {
        console.warn("Token expired, refreshing...");
        let token = await refreshToken();
        // Set the new token
        MERCADO_LIBRE_API_TOKEN = token;
        const retryResult = await fetchWithRetry(getItemsUrl, 3, 500, token);
        if (retryResult.error) {
          console.error("Error after token refresh:", retryResult.error);
          throw new CustomError(
            "Error fetching item prices after token refresh",
            500
          );
        }
        response = retryResult.response;
      }

      const data = (await response?.json()) as ItemPriceResponse[];
      const [{ code }] = data;
      if (code === 404) {
        throw new CustomError("Item not found", code);
      }
      return data
        .filter((item) => item.code !== 404 && item.body?.price !== undefined)
        .map(({ body: { id, price } }) => ({ id, price }));
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        console.error("Error fetching item prices:", error);
        throw new CustomError("Error fetching item prices", 500);
      }
    }
  };

  // Split item IDs into chunks
  const chunks = [];
  for (let i = 0; i < itemIds.length; i += chunkSize) {
    chunks.push(itemIds.slice(i, i + chunkSize));
  }

  // Fetch prices for all chunks in parallel
  const prices = await Promise.all(chunks.map(fetchPricesForChunk));

  const result = prices.flat();

  cache.set(cacheKey, result);

  return result;
};
/**
 * Calculates the items to be purchased with a given amount.
 *
 * @param amount Amount to spend
 * @param itemIds List of item IDs
 * @returns Coupon result
 */
export const calculateCouponItems = async (
  amount: string,
  itemIds: string[]
): Promise<CouponResult> => {
  const cacheKey = `coupon:${amount}:${itemIds.join(",")}`;
  const cachedResult = await getCache(cacheKey);

  let selectedItems: Item[];
  let totalSpent: number;

  // Check if result is already cached
  if (cachedResult) {
    selectedItems = cachedResult.item_ids.map((id: string) => ({
      id,
      price: 0,
    }));
    totalSpent = cachedResult.total;
  } else {
    // Calculate items to purchase
    let remainingAmount = parseFloat(amount);
    const uniqueItemIds = [...new Set(itemIds)];
    const itemPrices = await getItemPrices(uniqueItemIds);

    // Sort items by price
    const sortedItems = itemPrices.sort((a, b) => a.price - b.price);
    if (!sortedItems.length || remainingAmount < sortedItems[0].price) {
      throw new CustomError("Insufficient amount to buy any item", 400);
    }

    selectedItems = [];
    totalSpent = 0;

    for (const item of sortedItems) {
      if (item.price <= remainingAmount) {
        selectedItems.push(item);
        remainingAmount -= item.price;
        totalSpent += item.price;
      } else {
        break;
      }
    }
  }

  // Update database
  const transaction = await sequelize.transaction();

  try {
    for (const selectedItem of selectedItems) {
      const existingItem = await MostWantedItems.findOne({
        where: { itemId: selectedItem.id },
        transaction,
        lock: transaction.LOCK.UPDATE, // Lock row to avoid concurrency issues
      });

      if (existingItem) {
        // Increment count
        await MostWantedItems.increment("count", {
          by: 1,
          where: { itemId: selectedItem.id },
          transaction,
        });
      } else {
        // Create new item
        await MostWantedItems.create(
          {
            itemId: selectedItem.id,
            count: 1,
          },
          { transaction }
        );
      }
    }

    // Commit transaction
    await transaction.commit();

    await setCache(cacheKey, {
      item_ids: selectedItems.map((item) => item.id),
      total: totalSpent,
    });
  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    throw error;
  }

  return {
    item_ids: selectedItems.map((item) => item.id),
    total: totalSpent,
  };
};

import { MostWantedItems } from "../entities/MostWantedItems";
import { AppDataSource } from "../dataSource";
import { Item } from "../types/item";
import { CustomError } from "../errorHandler";

import * as dotenv from 'dotenv';
import { refreshToken } from "../utils/refreshToken";
dotenv.config();
interface CouponResult {
  item_ids: string[];
  total: number;
}
interface ItemPriceResponse {
  code: number
  body: {
    id: string;
    price: number;
  };
}

export const getItemPrices = async (itemIds: string[]): Promise<Item[]> => {
  const attributes = "id,price";
  const getItemsUrl = `${process.env.MERCADO_LIBRE_API_URL}/items?ids=${itemIds.join(",")}&attributes=${attributes}`;

  let token = process.env.MERCADO_LIBRE_API_TOKEN;

  try {
    let response = await fetch(getItemsUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 401) {
      console.warn("Token expired, refreshing...");
      token = await refreshToken(); 
      process.env.MERCADO_LIBRE_API_TOKEN = token;

      response = await fetch(getItemsUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    if (!response.ok) {
      throw new CustomError(`API Error: ${response.statusText}`, response.status);
    }

    const data = (await response.json()) as ItemPriceResponse[];
    const validItems = data.filter((item) => item.code !== 404 && item.body?.price !== undefined);

    if (!validItems.length) {
      throw new CustomError("No valid items found", 404);
    }

    return validItems.map(({ body: { id, price } }) => ({ id, price }));
  } catch (error) {
    console.error("Error fetching item prices:", error);

    if (error instanceof CustomError) {
      throw error;
    }

    throw new CustomError("Error fetching item prices", 500);
  }
};

export const calculateCouponItems = async (amount: string, itemIds: string[]): Promise<CouponResult> => {
  const mostWantedItemsRepository = AppDataSource.getRepository(MostWantedItems);
  let remainingAmount = parseFloat(amount);

  const uniqueItemIds = [...new Set(itemIds)];
  const itemPrices = await getItemPrices(uniqueItemIds);

  const sortedItems = itemPrices.sort((a, b) => a.price - b.price);
  if (!sortedItems.length || remainingAmount < sortedItems[0].price) {
    throw new CustomError("Insufficient amount to buy any item", 400);
  }
  const selectedItems: Item[] = [];
  let totalSpent = 0;
  for (const item of sortedItems) {
    const itemPrice = item.price;

    if (itemPrice <= remainingAmount) {
      selectedItems.push(item);
      remainingAmount -= itemPrice;
      totalSpent += itemPrice;
    } else {
      break;
    }
  }

  // Hacer un upsert para cada ítem seleccionado
  for (const selectedItem of selectedItems) {
    const existingItem = await mostWantedItemsRepository.findOne({ where: { itemId: selectedItem.id } });

    if (existingItem) {
      existingItem.count += 1;
      await mostWantedItemsRepository.save(existingItem);
    } else {
      const newItem = mostWantedItemsRepository.create({
        itemId: selectedItem.id,
        count: 1,
      });
      await mostWantedItemsRepository.save(newItem);
    }
  }

  return {
    item_ids: selectedItems.map(item => item.id),
    total: totalSpent
  };
};

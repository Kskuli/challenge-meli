"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCouponItems = exports.getItemPrices = void 0;
const MostWantedItems_1 = require("../entities/MostWantedItems");
const dataSource_1 = require("../dataSource");
const errorHandler_1 = require("../errorHandler");
const dotenv = __importStar(require("dotenv"));
const refreshToken_1 = require("../utils/refreshToken");
dotenv.config();
const getItemPrices = (itemIds) => __awaiter(void 0, void 0, void 0, function* () {
    const attributes = "id,price";
    const getItemsUrl = `${process.env.MERCADO_LIBRE_API_URL}/items?ids=${itemIds.join(",")}&attributes=${attributes}`;
    let token = process.env.MERCADO_LIBRE_API_TOKEN;
    try {
        let response = yield fetch(getItemsUrl, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 401) {
            console.warn("Token expired, refreshing...");
            token = yield (0, refreshToken_1.refreshToken)();
            process.env.MERCADO_LIBRE_API_TOKEN = token;
            response = yield fetch(getItemsUrl, {
                headers: { Authorization: `Bearer ${token}` },
            });
        }
        if (!response.ok) {
            throw new errorHandler_1.CustomError(`API Error: ${response.statusText}`, response.status);
        }
        const data = (yield response.json());
        const validItems = data.filter((item) => { var _a; return item.code !== 404 && ((_a = item.body) === null || _a === void 0 ? void 0 : _a.price) !== undefined; });
        if (!validItems.length) {
            throw new errorHandler_1.CustomError("No valid items found", 404);
        }
        return validItems.map(({ body: { id, price } }) => ({ id, price }));
    }
    catch (error) {
        console.error("Error fetching item prices:", error);
        if (error instanceof errorHandler_1.CustomError) {
            throw error;
        }
        throw new errorHandler_1.CustomError("Error fetching item prices", 500);
    }
});
exports.getItemPrices = getItemPrices;
const calculateCouponItems = (amount, itemIds) => __awaiter(void 0, void 0, void 0, function* () {
    const mostWantedItemsRepository = dataSource_1.AppDataSource.getRepository(MostWantedItems_1.MostWantedItems);
    let remainingAmount = parseFloat(amount);
    const uniqueItemIds = [...new Set(itemIds)];
    const itemPrices = yield (0, exports.getItemPrices)(uniqueItemIds);
    const sortedItems = itemPrices.sort((a, b) => a.price - b.price);
    if (!sortedItems.length || remainingAmount < sortedItems[0].price) {
        throw new errorHandler_1.CustomError("Insufficient amount to buy any item", 400);
    }
    const selectedItems = [];
    let totalSpent = 0;
    for (const item of sortedItems) {
        const itemPrice = item.price;
        if (itemPrice <= remainingAmount) {
            selectedItems.push(item);
            remainingAmount -= itemPrice;
            totalSpent += itemPrice;
        }
        else {
            break;
        }
    }
    // Hacer un upsert para cada ítem seleccionado
    for (const selectedItem of selectedItems) {
        const existingItem = yield mostWantedItemsRepository.findOne({ where: { itemId: selectedItem.id } });
        if (existingItem) {
            existingItem.count += 1;
            yield mostWantedItemsRepository.save(existingItem);
        }
        else {
            const newItem = mostWantedItemsRepository.create({
                itemId: selectedItem.id,
                count: 1,
            });
            yield mostWantedItemsRepository.save(newItem);
        }
    }
    return {
        item_ids: selectedItems.map(item => item.id),
        total: totalSpent
    };
});
exports.calculateCouponItems = calculateCouponItems;
//# sourceMappingURL=coupon.service.js.map
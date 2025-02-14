import { Item } from "../types/item";
interface CouponResult {
    item_ids: string[];
    total: number;
}
export declare const getItemPrices: (itemIds: string[]) => Promise<Item[]>;
export declare const calculateCouponItems: (amount: string, itemIds: string[]) => Promise<CouponResult>;
export {};

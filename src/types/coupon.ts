export interface CouponRequestBody {
  amount: string;
  item_ids: string[];
}
export interface CouponResult {
  item_ids: string[];
  total: number;
}
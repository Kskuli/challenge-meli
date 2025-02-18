import { Request, Response } from "express";
import { calculateCouponItems } from "../services/coupon.service";
import { CustomError } from "../ErrorHandler";
import { CouponRequestBody } from "../types/coupon";


export const getCoupons = async (
  req: Request<{}, {}, CouponRequestBody>,
  res: Response
): Promise<any> => {
  const { amount, item_ids } = req.body;

  if (!amount || !item_ids) {
    return res
      .status(400)
      .json({ message: "The coupon amount and itemsIds are required." });
  }

  try {
    const result = await calculateCouponItems(amount, item_ids);

    return res.json({
      item_ids: result.item_ids,
      total: result.total.toFixed(2),
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

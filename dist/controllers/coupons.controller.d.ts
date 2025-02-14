import { Request, Response } from "express";
import { CouponRequestBody } from "../types/coupon";
export declare const getCoupons: (req: Request<{}, {}, CouponRequestBody>, res: Response) => Promise<any>;

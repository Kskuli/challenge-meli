import { Router } from "express";
import { getCoupons } from "../controllers/coupons.controller";

const router = Router();

router.post("/", getCoupons);

export default router;

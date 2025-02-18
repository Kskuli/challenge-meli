import { Router } from "express";
import { getTopMostWantedItemsController } from "../controllers/mostWantedItems.controller";

const router = Router();

router.get("/top-five", getTopMostWantedItemsController);

export default router;

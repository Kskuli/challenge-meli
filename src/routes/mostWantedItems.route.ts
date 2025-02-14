import { Router } from "express";
import { getTopMostWantedItemsController } from "../controllers/mostWantedItems.controller";

const router = Router();

// Ruta para obtener los 5 ítems más canjeados
router.get("/top-five", getTopMostWantedItemsController);

export default router;

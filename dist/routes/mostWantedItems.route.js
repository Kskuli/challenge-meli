"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mostWantedItems_controller_1 = require("../controllers/mostWantedItems.controller");
const router = (0, express_1.Router)();
// Ruta para obtener los 5 ítems más canjeados
router.get("/top-five", mostWantedItems_controller_1.getTopMostWantedItemsController);
exports.default = router;
//# sourceMappingURL=mostWantedItems.route.js.map
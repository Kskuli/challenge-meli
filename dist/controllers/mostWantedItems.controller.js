"use strict";
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
exports.getTopMostWantedItemsController = void 0;
const mostWantedItems_service_1 = require("../services/mostWantedItems.service");
const errorHandler_1 = require("../errorHandler");
const getTopMostWantedItemsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topItems = yield (0, mostWantedItems_service_1.getTopFiveMostWantedItems)();
        return res.json(topItems);
    }
    catch (error) {
        console.error("Error fetching the most wanted items:", error);
        if (error instanceof errorHandler_1.CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getTopMostWantedItemsController = getTopMostWantedItemsController;
//# sourceMappingURL=mostWantedItems.controller.js.map
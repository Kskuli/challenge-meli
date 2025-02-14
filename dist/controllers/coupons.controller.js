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
exports.getCoupons = void 0;
const coupon_service_1 = require("../services/coupon.service");
const errorHandler_1 = require("../errorHandler");
const getCoupons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, item_ids } = req.body;
    if (!amount || !item_ids) {
        return res
            .status(400)
            .json({ message: "The coupon amount and itemsIds are required." });
    }
    try {
        const result = yield (0, coupon_service_1.calculateCouponItems)(amount, item_ids);
        return res.json({
            item_ids: result.item_ids,
            total: result.total.toFixed(2),
        });
    }
    catch (error) {
        if (error instanceof errorHandler_1.CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getCoupons = getCoupons;
//# sourceMappingURL=coupons.controller.js.map
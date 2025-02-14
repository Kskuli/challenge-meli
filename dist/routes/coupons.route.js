"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coupons_controller_1 = require("../controllers/coupons.controller");
const router = (0, express_1.Router)();
router.post("/", coupons_controller_1.getCoupons);
exports.default = router;
//# sourceMappingURL=coupons.route.js.map
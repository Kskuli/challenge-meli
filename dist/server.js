"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dataSource_1 = require("./dataSource");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const coupons_route_1 = __importDefault(require("./routes/coupons.route"));
const mostWantedItems_route_1 = __importDefault(require("./routes/mostWantedItems.route"));
require("reflect-metadata");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
// Connect to the database
dataSource_1.AppDataSource.initialize()
    .then(() => {
    console.log("Database connected successfully!");
})
    .catch((error) => console.log("Error connecting to the database: ", error));
// Routes
app.use("/api/v1/coupon", coupons_route_1.default);
app.use("/api/v1/most-wanted-items", mostWantedItems_route_1.default);
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map
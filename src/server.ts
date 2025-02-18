import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import couponsRoutes from "./routes/coupons.route";
import mostWantedItemsRoutes from "./routes/mostWantedItems.route";
import sequelize from "./config/connectionDb";
import basicAuthMiddleware from "./middleware/basicAuth";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Connect to db
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully!");
    return sequelize.sync();
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

// Basic Auth Middleware
app.use(basicAuthMiddleware);

// Routes
app.use("/api/v1/coupon", couponsRoutes);
app.use("/api/v1/most-wanted-items", mostWantedItemsRoutes);

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Init server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

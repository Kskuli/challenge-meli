import express from "express";
import { AppDataSource } from "./dataSource"; 
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import couponsRoutes from "./routes/coupons.route";
import mostWantedItemsRoutes from "./routes/mostWantedItems.route";
import "reflect-metadata";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Connect to the database
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => console.log("Error connecting to the database: ", error));

// Routes
app.use("/api/v1/coupon", couponsRoutes);
app.use("/api/v1/most-wanted-items", mostWantedItemsRoutes);
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

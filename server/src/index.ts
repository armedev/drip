import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { seedDB } from "./seed";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const DEPLOYED_HOST = process.env.CLIENT_HOST || "";

app.use(cors({ origin: ["http://localhost:3000", DEPLOYED_HOST] }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

app.use(errorMiddleware);

connectDB().then(async () => {
  await seedDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

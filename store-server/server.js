// store-server/server.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import db from "./db.js";
import productRoutes from "./routes/products.js";
import ordersRoutes from "./routes/orders.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());        
app.use(express.json());
app.use(morgan("dev"));    

app.use("/api/products", productRoutes);
app.use("/api/orders", ordersRoutes);

db.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })


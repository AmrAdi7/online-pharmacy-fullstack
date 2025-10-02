// store-server/routes/products.js
import express from "express";
import db from "../db.js";

const router = express.Router();


// GET /api/products?category=...
router.get("/", async (req, res) => {
  const { category } = req.query;
  if (!category) return res.json([]); // or res.sendStatus(400) if you prefer
  const { rows } = await db.query(
    `SELECT id, name, price, description, image_url, category
     FROM products
     WHERE category = $1
     ORDER BY id`,
    [category]
  );
  res.json(rows);
});

export default router;

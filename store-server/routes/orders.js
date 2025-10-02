// store-server/routes/orders.js
import express from "express";
import db from "../db.js";

const router = express.Router();
const ALLOWED_METHODS = ["Cash on Delivery", "Card"];

// GET /api/orders (list all orders)
router.get("/", async (_req, res) => {
  const { rows } = await db.query(
    `SELECT id, full_name, phone, address, payment_method, total_amount, created_at
     FROM orders
     ORDER BY id DESC`
  );
  res.json(rows);
});

// POST /api/orders (create order)
router.post("/", async (req, res) => {
  const { full_name, phone, address, payment_method, items } = req.body || {};
  if (!full_name || !phone || !address || !payment_method) return res.sendStatus(404);
  if (!ALLOWED_METHODS.includes(payment_method)) return res.sendStatus(404);
  if (!Array.isArray(items) || items.length === 0) return res.sendStatus(404);

  // Load product prices
  const ids = [...new Set(items.map((it) => Number(it.product_id)))];
  const { rows: prodRows } = await db.query(
    "SELECT id, price FROM products WHERE id = ANY($1)",
    [ids]
  );
  const priceMap = new Map(prodRows.map((r) => [r.id, Number(r.price)]));

  for (const it of items) {
    if (!priceMap.has(Number(it.product_id))) return res.sendStatus(404);
  }

  // Compute totals
  const normalized = items.map((it) => {
    const qty = Math.max(1, Number(it.qty || 1));
    const unit_price = priceMap.get(Number(it.product_id));
    const line_total = qty * unit_price;
    return { product_id: Number(it.product_id), qty, unit_price, line_total };
  });
  const order_total = normalized.reduce((sum, it) => sum + it.line_total, 0);

  // Insert order
  const { rows: orderRows } = await db.query(
    `INSERT INTO orders (full_name, phone, address, payment_method, total_amount)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, full_name, phone, address, payment_method, total_amount, created_at`,
    [full_name, phone, address, payment_method, order_total]
  );
  const order = orderRows[0];

  // Insert items
  for (const it of normalized) {
    await db.query(
      `INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total)
       VALUES ($1, $2, $3, $4, $5)`,
      [order.id, it.product_id, it.qty, it.unit_price, it.line_total]
    );
  }

  res
    .status(201)
    .json({ order_id: order.id, total: order.total_amount, created_at: order.created_at });
});

// PUT /api/orders/:id  
router.put("/:id", async (req, res) => {
  const { full_name, phone, address, payment_method } = req.body || {};
  if (payment_method && !ALLOWED_METHODS.includes(payment_method)) return res.sendStatus(404);

  const { rows } = await db.query(
    `UPDATE orders
     SET
       full_name = COALESCE($1, full_name),
       phone = COALESCE($2, phone),
       address = COALESCE($3, address),
       payment_method = COALESCE($4, payment_method)
     WHERE id = $5
     RETURNING id, full_name, phone, address, payment_method, total_amount, created_at`,
    [
      full_name ?? null,
      phone ?? null,
      address ?? null,
      payment_method ?? null,
      req.params.id,
    ]
  );

  if (!rows[0]) return res.sendStatus(404);
  res.json(rows[0]);
});

// DELETE /api/orders/:id  (delete order)
router.delete("/:id", async (req, res) => {
  await db.query(`DELETE FROM order_items WHERE order_id = $1`, [req.params.id]);
  const { rowCount } = await db.query(`DELETE FROM orders WHERE id = $1`, [req.params.id]);
  if (!rowCount) return res.sendStatus(404);
  res.sendStatus(204);
});

export default router;

#  Pharmacy Backend (Express + PostgreSQL)

This is the **backend** for the pharmacy storefront. It exposes two route groups:

- **Products** → `GET /api/products?category=...` (used by the UI to list products for a category)
- **Orders** → `GET/POST/PUT/DELETE /api/orders` (list, create, edit, delete orders)

> **No authentication** and **no static image serving** in this backend. Product image paths are stored in the DB and the frontend serves files from its own `/public/images` folder.

---

##  Tech Stack

- Node.js + Express
- PostgreSQL (via `pg`)
- `dotenv`, `cors`, `morgan`

---

##  Getting Started

```bash
# 1) Install dependencies
cd store-server
npm install

# 2) Create a PostgreSQL database (e.g., pharmacydb) and load your schema
#    (tables used: products, orders, order_items)

# 3) Create .env
# DATABASE_URL=postgresql://postgres:0000@localhost:5432/pharmacydb
# PORT=5000
cp .env.example .env  # or create .env manually

# 4) Run the server
node server.js
# -> http://localhost:5000
```

---

##  Structure (relevant files)

```
store-server/
├─ routes/
│  ├─ products.js     # GET /api/products?category=...
│  └─ orders.js       # GET/POST/PUT/DELETE /api/orders
├─ db.js              # pg Client using DATABASE_URL
└─ server.js          # Express app: CORS, JSON, logger, routes
```

---

##  API Reference

**Base URL:** `http://localhost:5000`  
**All endpoints return JSON (or empty body for 204).**

### Products

#### GET `/api/products?category=...`

List products **filtered by category**. If `category` is **missing**, the server returns an **empty array**.

- **Query params**
  - `category` (string, required by the UI)

- **Response 200**
```json
[
  {
    "id": 1,
    "name": "Paracetamol 500mg",
    "price": 2.5,
    "description": "Pain reliever and fever reducer",
    "image_url": "/images/med1.jpg",
    "category": "Medicinal Drugs"
  }
]
```
- Notes:
  - Sorted by `id ASC`.

> There are **no** `/api/products/:id`, `POST`, `PUT`, or `DELETE` product endpoints in this backend version.

---

### Orders

#### GET `/api/orders`

Return all orders, newest first.

- **Response 200**
```json
[
  {
    "id": 11,
    "full_name": "John Doe",
    "phone": "077-123-4567",
    "address": "Amman",
    "payment_method": "Cash on Delivery",
    "total_amount": 5.70,
    "created_at": "2025-09-21T14:04:56.000Z"
  }
]
```

#### POST `/api/orders`

Create a new order. **Any invalid input returns `404`** (per the current implementation).

- **Allowed `payment_method` values:** `"Cash on Delivery"`, `"Card"`
- Unit prices are loaded from the DB; `total_amount` is computed server‑side.
- Unknown product IDs also return `404`.

- **Request body**
```json
{
  "full_name": "John Doe",
  "phone": "0790000000",
  "address": "Amman, Jordan",
  "payment_method": "Cash on Delivery",
  "items": [
    { "product_id": 1, "qty": 2 },
    { "product_id": 3, "qty": 1 }
  ]
}
```

- **Response 201**
```json
{
  "order_id": 42,
  "total": 35.5,
  "created_at": "2025-09-21T14:04:56.000Z"
}
```

> Implementation detail: inserts use simple sequential queries (no explicit transaction block by design).

#### PUT `/api/orders/:id`

Partial update for an order. Fields you provide overwrite existing values; missing fields are left unchanged.

- If `payment_method` is provided and is not one of the allowed methods → **404**.
- If the order does not exist → **404**.

- **Request body (example)**
```json
{
  "full_name": "Jane Doe",
  "phone": "078-555-5555",
  "address": "Irbid",
  "payment_method": "Card"
}
```

- **Response 200**
```json
{
  "id": 11,
  "full_name": "Jane Doe",
  "phone": "078-555-5555",
  "address": "Irbid",
  "payment_method": "Card",
  "total_amount": 5.70,
  "created_at": "2025-09-21T14:04:56.000Z"
}
```

#### DELETE `/api/orders/:id`

Delete an order (and its `order_items`).

- If not found → **404**
- On success → **204 No Content**

---

##  Database Tables (used by the code)

- `products(id, name, price, description, image_url, category)`
- `orders(id, full_name, phone, address, payment_method, total_amount, created_at)`
- `order_items(order_id, product_id, quantity, unit_price, line_total)`

> **Images:** `products.image_url` should be a path like `/images/med1.jpg`. The **frontend** serves actual files from its `public/images` folder.

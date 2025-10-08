#  Pharmacy Frontend (React + Vite)

This is the **frontend** for the pharmacy storefront. It matches the current codebase i shared: **no auth**, local cart in `localStorage`, product browsing by **category**, a simple **checkout** form, and an **Orders** screen that can update/delete orders (no login required).

---

##  What this app does

- **Home**: three category cards with images (imported from `src/image/med1.jpg`, `med2.jpg`, `med3.jpg`).
- **Category page**: fetches products by category from the backend (`GET /api/products?category=...`) and shows name, price, description, and image.
- **Cart**: fully client-side (localStorage) with increment/decrement/remove/clear and total.
- **Checkout**: posts the order to the backend and shows a receipt on success.
- **Orders**: lists orders (from `GET /api/orders`), and lets you **edit** (PUT) or **delete** (DELETE) an order.

> There is **no login/signup** and **no product admin UI** in this frontend.

---

##  Tech

- React 18 + Vite
- React Router
- Fetch API
- LocalStorage (cart persistence)

---

##  Run locally

```bash
cd store-client
npm install
npm run dev
# Vite dev server -> http://localhost:5173
```

The backend must be running on `http://localhost:5000`.

**Optional Vite proxy (`vite.config.js`)**:
```js
export default {
  server: { proxy: { '/api': 'http://localhost:5000' } }
}
```

---

##  Project structure (as used by your app)

```
store-client/
├─ public/
│  └─ images/                 # (optional) product images served at /images/*
├─ src/
│  ├─ image/                  # Home page images (bundled): med1.jpg, med2.jpg, med3.jpg
│  ├─ components/             # Home.jsx, CategoryPage.jsx, Cart.jsx, Checkout.jsx, Orders.jsx, About.jsx
│  ├─ lib/
│  │  └─ cart.js              # localStorage cart helpers
│  ├─ App.jsx                 # routes + navbar
│  ├─ main.jsx                # mounts App
│  └─ style.css               # styles
```

> If you see import errors after moving files from `pages/` to `components/`, make sure **import paths in `App.jsx`** point to the **actual** file locations. Your current `App.jsx` imports everything from `./components/...`.

---

##  Routes

- `/` — Home (categories grid with images)
- `/category/:name` — Category products (fetches `/api/products?category=...`)
- `/cart` — Cart page (localStorage-backed)
- `/checkout` — Checkout (POST `/api/orders`)
- `/orders` — List / edit / delete orders
- `/about` — About page

---

##  Images — how they’re resolved

### 1) Home page images (hard-coded)
- Files live in `src/image` and are **imported**:
  ```js
  import med1 from "../image/med1.jpg";
  import med2 from "../image/med2.jpg";
  import med3 from "../image/med3.jpg";
  ```
- These are bundled by Vite, so you **don’t** need to put them in `public/`.

### 2) Product images in CategoryPage
The DB column `products.image_url` can be:
- A full URL (starts with `http`), e.g. `https://example.com/p.png`
- A root-relative path (starts with `/`), e.g. `/images/med1.jpg` (place the file in **`public/images/med1.jpg`**)
- A bare filename, e.g. `med1.jpg` → the code maps this to `/images/med1.jpg` (also put file in `public/images`)

The helper used:
```js
function resolveImage(u) {
  if (!u) return "";
  if (u.startsWith("http")) return u;      
  if (u.startsWith("/")) return u;         
  return `/images/${u}`;                   
}
```

So for the **Category page**:
- If you set `image_url` in the DB to `/images/panadol.jpg`, copy the file to `store-client/public/images/panadol.jpg`.
- If you set it to `panadol.jpg`, also copy the file to `public/images/panadol.jpg` (the code prepends `/images/`).
- If you set it to a full URL, nothing else to do.

---

##  Cart behavior

- LocalStorage key: `pharmacy_cart`
- Emitted event when the cart changes: `cart:change` (used to update the navbar counter).
- Helpers in `src/lib/cart.js`: `getCart`, `saveCart`, `addToCart`, `cartCount`, `cartTotal`, `removeFromCart`, `clearCart`, `onCartChange`.

---

##  Backend endpoints this UI uses

- `GET /api/products?category=Medicinal%20Drugs`
- `POST /api/orders`
- `GET /api/orders`
- `PUT /api/orders/:id`
- `DELETE /api/orders/:id`

> The frontend intentionally avoids showing error messages for failed requests in Checkout/Orders and simply doesn’t proceed if data is invalid.

---

##  Quick test flow

1. Ensure backend is running on `http://localhost:5000`.
2. Insert products into the DB with `category` values like `"Medicinal Drugs"`, `"Personal Care"`, `"Vitamins & Supplements"` and set `image_url` as described above.
3. Start the frontend: `npm run dev`.
4. Home → click a category → add products to cart.
5. Cart → adjust quantities → Checkout (submits order).
6. Orders → see the order, try **Edit/Save** or **Delete**.

---

##  Notes

- There is **no authentication** in this project.
- All state for the cart is client-side.
- Orders management is open (course/demo purposes).

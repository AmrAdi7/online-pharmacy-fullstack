// store-client/src/lib/cart.js
const KEY = "pharmacy_cart";

function emitChange() {
  window.dispatchEvent(new Event("cart:change"));
}

export function getCart() {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export function saveCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
  emitChange();
}

export function addToCart(product, qty = 1) {
  const items = getCart();
  const i = items.findIndex((x) => x.id === product.id);
  if (i >= 0) {
    items[i].qty += qty;
  } else {
    items.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image_url: product.image_url,
      qty,
    });
  }
  saveCart(items);
  return items;
}

export function cartCount() {
  return getCart().reduce((sum, x) => sum + x.qty, 0);
}

export function cartTotal() {
  return getCart().reduce((sum, x) => sum + x.qty * Number(x.price), 0);
}

export function removeFromCart(id) {
  saveCart(getCart().filter((x) => x.id !== id));
}

export function clearCart() {
  localStorage.removeItem(KEY);
  emitChange();
}

export function onCartChange(handler) {
  window.addEventListener("cart:change", handler);
  return () => window.removeEventListener("cart:change", handler);
}

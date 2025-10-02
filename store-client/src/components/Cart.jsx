// src/components/Cart.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCart, saveCart, removeFromCart, clearCart, cartTotal } from "../lib/cart.js";

export default function Cart() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const data = getCart();
    setItems(Array.isArray(data) ? data : []);
  }, []);

  function inc(id) {
    const next = items.map(it =>
      it.id === id ? { ...it, qty: it.qty + 1 } : it
    );
    saveCart(next);
    setItems(next);
  }

  function dec(id) {
    const next = items.map(it =>
      it.id === id ? { ...it, qty: Math.max(1, it.qty - 1) } : it
    );
    saveCart(next);
    setItems(next);
  }

  function remove(id) {
    removeFromCart(id);
    setItems(getCart());
  }

  function clearAll() {
    clearCart();
    setItems([]);
  }

  const total = cartTotal();

  return (
    <main>
      <Link to="/" className="back-link">← Continue shopping</Link>
      <h2 className="page-title" style={{ fontSize: 22 }}>Cart</h2>

      {items.length === 0 ? (
        <p className="text-muted">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-list">
            {items.map(it => (
              <div key={it.id} className="card cart-item">
                {it.image_url ? (
                  <img className="cart-thumb" src={it.image_url} alt={it.name} />
                ) : (
                  <div className="cart-thumb" />
                )}

                <div>
                  <div style={{ fontWeight: 600 }}>{it.name}</div>
                  <div className="text-muted">${Number(it.price).toFixed(2)}</div>
                  <div className="qty">
                    <button className="btn btn-sm" onClick={() => dec(it.id)}>-</button>
                    <span>{it.qty}</span>
                    <button className="btn btn-sm" onClick={() => inc(it.id)}>+</button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => remove(it.id)}
                      style={{ marginLeft: 8 }}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="price">${(it.qty * Number(it.price)).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="total-row">Total: ${total.toFixed(2)}</div>

          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-danger" onClick={clearAll}>Clear Cart</button>
            <Link to="/checkout">
              <button className="btn btn-primary">Checkout</button>
            </Link>
          </div>
        </>
      )}
    </main>
  );
}


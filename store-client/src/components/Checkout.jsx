// src/components/Checkout.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCart, cartTotal, clearCart } from "../lib/cart.js";

export default function Checkout() {
  const [items, setItems] = useState([]);
  const [full_name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment_method, setMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const total = cartTotal();

  async function submitOrder(e) {
    e.preventDefault();

    if (items.length === 0) return;
    if (!full_name || !phone || !address) return;

    const payload = {
      full_name,
      phone,
      address,
      payment_method,
      items: items.map(it => ({ product_id: it.id, qty: it.qty })),
    };

    setLoading(true);
    const r = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      setLoading(false);
      return;
    }

    const data = await r.json();
    clearCart();
    setReceipt(data);
    setLoading(false);
  }

  if (receipt) {
    return (
      <main>
        <Link to="/" className="back-link">← Home</Link>
        <h2 className="page-title" style={{ fontSize: 22 }}>Payment Successful </h2>
        <div className="card" style={{ maxWidth: 560 }}>
          <p><b>Order ID:</b> {receipt.order_id}</p>
          <p><b>Total Paid:</b> ${Number(receipt.total).toFixed(2)}</p>
          <p><b>Time:</b> {new Date(receipt.created_at).toLocaleString()}</p>
          <p className="text-muted">We’ve received your order. You’ll also see it in the database table.</p>
          <Link to="/" className="back-link">Continue shopping →</Link>
        </div>
      </main>
    );
  }

  const canSubmit = items.length > 0 && full_name && phone && address && !loading;

  return (
    <main>
      <Link to="/cart" className="back-link">← Back to cart</Link>
      <h2 className="page-title" style={{ fontSize: 22 }}>Checkout</h2>

      <form className="form" onSubmit={submitOrder}>
        <div className="field">
          <label className="label">Full name</label>
          <input className="input" value={full_name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="field">
          <label className="label">Phone</label>
          <input className="input" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <div className="field">
          <label className="label">Address</label>
          <textarea
            className="textarea"
            rows={3}
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
        </div>

        <div className="field">
          <span className="label">Payment method</span>
          <label style={{ marginRight: 16 }}>
            <input
              type="radio"
              name="pm"
              value="Cash on Delivery"
              checked={payment_method === "Cash on Delivery"}
              onChange={e => setMethod(e.target.value)}
            /> Cash on Delivery
          </label>
          <label>
            <input
              type="radio"
              name="pm"
              value="Card"
              checked={payment_method === "Card"}
              onChange={e => setMethod(e.target.value)}
            /> Card
          </label>
        </div>

        <div className="total-row">Total: ${total.toFixed(2)}</div>
        <button className="btn btn-success" type="submit" disabled={!canSubmit}>
          {loading ? "Processing..." : "Pay now"}
        </button>
      </form>
    </main>
  );
}


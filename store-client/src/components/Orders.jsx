// src/components/Orders.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const METHODS = ["Cash on Delivery", "Card"];
const emptyForm = { full_name: "", phone: "", address: "", payment_method: "Cash on Delivery" };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  function load() {
    setLoading(true);
    fetch("/api/orders")
      .then(r => (r.ok ? r.json() : []))
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function startEdit(o) {
    setEditingId(o.id);
    setForm({
      full_name: o.full_name || "",
      phone: o.phone || "",
      address: o.address || "",
      payment_method: o.payment_method || "Cash on Delivery",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function saveEdit(id) {
    const r = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (r.ok) {
      cancelEdit();
      load();
    }
  }

  async function del(id) {
    if (!confirm("Delete this order?")) return;
    const r = await fetch(`/api/orders/${id}`, { method: "DELETE" });
    if (r.ok) load();
  }

  return (
    <main>
      <Link to="/" className="back-link">← Home</Link>
      <h2 className="page-title" style={{ fontSize: 22 }}>Orders</h2>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-muted">No orders found.</p>
      ) : (
        <div className="card" style={{ overflowX: "auto" }}>
          <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Full name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>
                    {editingId === o.id ? (
                      <input className="input" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
                    ) : o.full_name}
                  </td>
                  <td>
                    {editingId === o.id ? (
                      <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    ) : o.phone}
                  </td>
                  <td>
                    {editingId === o.id ? (
                      <input className="input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                    ) : o.address}
                  </td>
                  <td>
                    {editingId === o.id ? (
                      <select className="input" value={form.payment_method} onChange={e => setForm({ ...form, payment_method: e.target.value })}>
                        {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    ) : o.payment_method}
                  </td>
                  <td>${Number(o.total_amount).toFixed(2)}</td>
                  <td>{new Date(o.created_at).toLocaleString()}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {editingId === o.id ? (
                      <>
                        <button className="btn btn-sm btn-success" onClick={() => saveEdit(o.id)}>Save</button>
                        <button className="btn btn-sm" style={{ marginLeft: 8 }} onClick={cancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-sm" onClick={() => startEdit(o)}>Edit</button>
                        <button className="btn btn-sm btn-danger" style={{ marginLeft: 8 }} onClick={() => del(o.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}


// src/components/CategoryPage.jsx  
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { addToCart } from "../lib/cart.js";

function resolveImage(u) {
  if (!u) return "";
  if (u.startsWith("http")) return u;      
  if (u.startsWith("/")) return u;         
  return `/images/${u}`;                   
}

export default function CategoryPage() {
  const { name } = useParams();
  const category = decodeURIComponent(name);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    let on = true;
    setLoading(true);

    fetch(`/api/products?category=${encodeURIComponent(category)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => on && setItems(Array.isArray(data) ? data : []))
      .finally(() => on && setLoading(false));

    return () => { on = false; };
  }, [category]);

  function handleAdd(p) {
    addToCart(p, 1);
    setFlash(`${p.name} added to cart`);
    setTimeout(() => setFlash(""), 1200);
  }

  return (
    <main>
      <Link to="/" className="back-link">← Back</Link>
      <h2 className="page-title" style={{ fontSize: 22 }}>{category}</h2>

      {flash && (
        <div className="card" style={{ marginBottom: 12, background: "#ecfeff", borderColor: "#a5f3fc" }}>
          {flash}
        </div>
      )}
      {loading && <p>Loading...</p>}

      {!loading && (
        <div className="section-mint" style={{ marginTop: 12 }}>
          <div className="container">
            <div className="products-grid">
              {items.map((p) => {
                const src = resolveImage(p.image_url);
                return (
                  <div key={p.id} className="card product-card">
                    {src ? (
                      <img className="product-img" src={src} alt={p.name} />
                    ) : (
                      <div className="product-img" />
                    )}
                    <div>
                      <div className="product-title">{p.name}</div>
                      <div className="text-muted">{p.description}</div>
                      <div className="price" style={{ marginTop: 6 }}>
                        ${Number(p.price).toFixed(2)}
                      </div>
                    </div>
                    <div className="product-actions">
                      <button className="btn btn-primary btn-add btn-block" onClick={() => handleAdd(p)}>
                        + Add
                      </button>
                    </div>
                  </div>
                );
              })}
              {items.length === 0 && (
                <p className="text-muted" style={{ padding: 12 }}>No products found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


// src/App.jsx
import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";
import Home from "./components/Home.jsx";
import CategoryPage from "./components/CategoryPage.jsx";
import Cart from "./components/Cart.jsx";
import Checkout from "./components/Checkout.jsx";
import About from "./components/About.jsx";
import Orders from "./components/Orders.jsx"; 
import { cartCount, onCartChange } from "./lib/cart.js";
import { useEffect, useState } from "react";

export default function App() {
  const [count, setCount] = useState(cartCount());

  useEffect(() => {
    setCount(cartCount());
    const unsub = onCartChange(() => setCount(cartCount()));
    return unsub;
  }, []);

  return (
    <BrowserRouter>
      <div className="topbar">
        <div className="container topbar-inner">
          <nav className="nav">
            <NavLink to="/" end className={({isActive}) => isActive ? "active" : ""}>
              Home
            </NavLink>
            <NavLink to={"/category/" + encodeURIComponent("Medicinal Drugs")} className={({isActive}) => isActive ? "active" : ""}>
              products
            </NavLink>
            <NavLink to="/orders" className={({isActive}) => isActive ? "active" : ""}>
              Orders
            </NavLink>
            <NavLink to="/about" className={({isActive}) => isActive ? "active" : ""}>
              About us
            </NavLink>
          </nav>

          <Link to="/cart" className="cart-link" title="Cart">
            🛒 <span>{count > 0 ? `(${count})` : ""}</span>
          </Link>
        </div>
      </div>

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/orders" element={<Orders />} /> 
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}


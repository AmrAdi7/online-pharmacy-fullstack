// src/components/Home.jsx
import { Link } from "react-router-dom";
import med1 from "../image/med1.jpg";
import med2 from "../image/med2.jpg";
import med3 from "../image/med3.jpg";

export default function Home() {
  return (
    <>
      <h1 className="page-title">Welcome to Amr's Pharmacy</h1>
      <p className="lead">
        Your trusted place for medicines, personal care, and wellness products. Shop easily, stay healthy, and get your essentials delivered to your door.
      </p>

      <section className="section-mint">
        <div className="container">
          <div className="categories">
            <div className="category-card">
              <img
                className="category-thumb"
                src={med1}
                alt="Medicinal drugs"
                style={{ width: "100%", height: "80%", objectFit: "cover" }}
              />
              <div className="category-title">Medicinal drugs</div>
              <div className="text-muted">Prescription &amp; over-the-counter medicines</div>
              <div style={{ marginTop: 10 }}>
                <Link className="btn btn-primary" to={"/category/" + encodeURIComponent("Medicinal Drugs")}>Explore</Link>
              </div>
            </div>

            <div className="category-card">
              <img
                className="category-thumb"
                src={med2}
                alt="Personal care"
                style={{ width: "100%", height: "80%", objectFit: "cover" }}
              />
              <div className="category-title">Personal Care</div>
              <div className="text-muted">Skincare, haircare, makeup products</div>
              <div style={{ marginTop: 10 }}>
                <Link className="btn btn-primary" to={"/category/" + encodeURIComponent("Personal Care")}>Explore</Link>
              </div>
            </div>

            <div className="category-card">
              <img
                className="category-thumb"
                src={med3}
                alt="Vitamins & Supplements"
                style={{ width: "100%", height: "80%", objectFit: "cover" }}
              />
              <div className="category-title">Vitamins &amp; Supplements</div>
              <div className="text-muted">Nutritional supplements, minerals, boosters</div>
              <div style={{ marginTop: 10 }}>
                <Link className="btn btn-primary" to={"/category/" + encodeURIComponent("Vitamins & Supplements")}>Explore</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


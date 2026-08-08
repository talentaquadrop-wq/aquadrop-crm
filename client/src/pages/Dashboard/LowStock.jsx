import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/dashboardService";

export default function LowStock() {

  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {

      const res = await getDashboardStats();

      console.log("Dashboard Response:", res);

      if (res.success) {
        setProducts(res.data?.lowStockProducts || []);
      } else {
        setProducts([]);
      }

    } catch (error) {
      console.log(error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="dashboard-box">

      <div className="box-header">
        <h3>Low Stock</h3>
        <span>{products?.length || 0}</span>
      </div>

      {products.length === 0 ? (

        <div
          style={{
            padding: 30,
            textAlign: "center",
            color: "#888",
          }}
        >
          No Low Stock Products
        </div>

      ) : (

        products.map((item) => (

          <div
            className="activity-card"
            key={item._id}
          >
            <div className="activity-left">

              <div className="activity-icon">
                📦
              </div>

              <div>
                <h4>{item.productName || item.name}</h4>

                <p>
                  Qty : {item.quantity}
                </p>

              </div>

            </div>

          </div>

        ))

      )}

    </div>
  );
}
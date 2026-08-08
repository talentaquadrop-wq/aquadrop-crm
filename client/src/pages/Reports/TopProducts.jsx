import React, { useEffect, useState } from "react";
import "./TopProducts.css";
import { getReports } from "../../services/reportService";

const TopProducts = () => {

  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {

    try {

      const res = await getReports();

      if (res.success) {

        setProducts(res.data.topProducts || []);

      }

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchProducts();

  }, []);

  return (

    <div className="dashboard-box">

      <div className="box-header">

        <h3>Top Products</h3>

        <span>{products.length}</span>

      </div>

      {products.length === 0 ? (

        <div
          style={{
            padding: 30,
            textAlign: "center",
            color: "#777",
          }}
        >
          No Products Found
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

                <h4>{item.productName}</h4>

                <p>{item.category}</p>

              </div>

            </div>

            <span className="time-badge">

              Qty : {item.quantity}

            </span>

          </div>

        ))

      )}

    </div>

  );

};

export default TopProducts;
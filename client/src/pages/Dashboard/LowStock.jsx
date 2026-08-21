import React, { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "./LowStock.css";

import { getProducts } from "../../services/productService";

const LowStock = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  const fetchLowStockProducts = async () => {
    try {
      setLoading(true);

      const res = await getProducts();

      const allProducts =
        res.data?.data || res.data || [];

      const lowStockProducts = allProducts
        .filter(
          (product) =>
            product.status === "Low Stock" ||
            product.status === "Out of Stock" ||
            Number(product.quantity) <= 10
        )
        .sort(
          (a, b) =>
            Number(a.quantity) -
            Number(b.quantity)
        )
        .slice(0, 4);

      setProducts(lowStockProducts);
    } catch (error) {
      console.error(
        "Low Stock Error:",
        error
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (product) => {
    if (
      product.status === "Out of Stock" ||
      Number(product.quantity) === 0
    ) {
      return "Critical";
    }

    return "Low Stock";
  };

  return (
    <div className="low-stock">

      <div className="low-stock-header">

        <div>
          <h3>Low Stock</h3>
          <p>Products that need attention</p>
        </div>

        <div className="stock-warning">
          <FaExclamationTriangle />
        </div>

      </div>

      <div className="stock-list">

        {loading ? (

          <div className="stock-empty">
            Loading products...
          </div>

        ) : products.length === 0 ? (

          <div className="stock-empty">
            All products are sufficiently stocked
          </div>

        ) : (

          products.map((product, index) => {

            const status =
              getStatus(product);

            return (
              <div
                className="stock-row"
                key={
                  product._id ||
                  product.id ||
                  index
                }
              >

                <div className="stock-product">

                  <div className="stock-icon">
                    <FaBoxOpen />
                  </div>

                  <div className="stock-details">

                    <h4>
                      {product.productName}
                    </h4>

                    <p>
                      Available:{" "}
                      {product.quantity || 0} Units
                    </p>

                  </div>

                </div>

                <span
                  className={`stock-status ${
                    status === "Critical"
                      ? "critical"
                      : "low-stock-status"
                  }`}
                >
                  {status}
                </span>

              </div>
            );
          })

        )}

      </div>

      <button
        className="view-products-btn"
        onClick={() =>
          navigate("/inventory")
        }
      >
        View Products
      </button>

    </div>
  );
};

export default LowStock;
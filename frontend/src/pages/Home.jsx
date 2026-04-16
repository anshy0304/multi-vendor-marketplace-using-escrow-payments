import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import baseURL from "../api";

function Home() {
  console.log("URL: ", baseURL);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${baseURL}/products`);
        if (!response.ok) {
          throw new Error("Could not load Products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleBuy = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to purchase items.");
      navigate("/login");
      return;
    }
    try {
      const response = await fetch(`${baseURL}/orders/create-razorpay-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: productId,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert("Failed to initialize payment");
        return;
      }
      const options = {
        key: "rzp_test_ScFObOzhZ1Qjfe",
        amount: data.amount,
        currency: data.currency,
        name: "Ansh's Marketplace",
        description: data.productName,
        order_id: data.orderId,
        theme: {
          color: "#2563EB",
        },
        handler: async function (response) {
          const confirmRes = await fetch(`${baseURL}/orders/checkout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId: productId }),
          });
          if (confirmRes.ok) {
            alert("Payment Successfull! Funds are locked in escrow");
            navigate("/dashboard");
          } else
            alert("Payment worked,but Escrow failed.Please Contack support");
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Could not connect to the server");
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          All Products
        </h1>
        {loading && (
          <p className="text-center text-gray-500 text-lg font-medium">
            Loading items...
          </p>
        )}
        {error && (
          <p className="text-center text-red-600 font-bold text-lg bg-red-50 p-4 rounded-lg border border-red-200">
            {error}
          </p>
        )}
        {products.map((product) => (
          <div
            key={product?.id}
            className="bg-white p-7 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between mb-4 hover:shadow-xl transition duration-300 hover:-translate-y-1"
          >
            <div>
              <h2 className="text-2xl font-bold text-blue-700 mb-2">
                {product.name}
              </h2>
              <p className="text-gray-600 text-sm mb-4 font-medium">
                Sold by: {product.seller.name || "Unknown Seller"}
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-3xl font-extrabold text-green-600">
                ₹{product.price}
              </span>
              <button
                onClick={() => handleBuy(product.id)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition duration-200 font-semibold"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
        {!loading && products.length == 0 && (
          <p className="text-center text-gray-600 col-span-full text-lg font-medium py-8 bg-gray-50 rounded-lg border border-gray-200">
            No Products available right now.
          </p>
        )}
      </div>
    </>
  );
}

export default Home;

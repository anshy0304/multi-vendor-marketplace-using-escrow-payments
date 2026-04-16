import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import baseURL from "../api";
function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const navigate = useNavigate();

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const sellerId = localStorage.getItem("userId");
    if (!sellerId) {
      alert("You must be logged in to add a product");
      navigate("/login");
      return;
    }
    try {
      const response = await fetch(`${baseURL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          price: parseFloat(price),
          sellerId: parseInt(sellerId),
        }),
      });
      if (response.ok) {
        alert("Product added successfully");
        navigate("/");
      } else {
        alert("Failed to add Product");
      }
    } catch (err) {
      alert("Could not connect to the server");
    }
  };
  return (
    <>
      <div className="max-w-md mx-auto mt-10 bg-white p-10 border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-6">
          List a New Product
        </h2>

        <form onSubmit={handleAddProduct} className="flex flex-col space-y-5">
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Product Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Used Laptop"
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-green-500 focus:shadow-md transition duration-200 bg-gray-50"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Price (₹)
            </label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="500.00"
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-green-500 focus:shadow-md transition duration-200 bg-gray-50"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:from-green-700 hover:to-green-800 transition duration-200 text-lg mt-2"
          >
            Add to Shop
          </button>
        </form>
      </div>
    </>
  );
}

export default AddProduct;

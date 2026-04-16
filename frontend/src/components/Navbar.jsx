import React from "react";
import { Link, useNavigate } from "react-router-dom";
function Navbar() {
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/login");
  };
  return (
    <>
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg p-6 flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold m-0 tracking-tight">
          TrustCart
        </h2>
        <div className="space-x-8 font-medium flex items-center">
          <Link
            to="/"
            className="hover:text-blue-100 transition duration-200 text-lg"
          >
            Home
          </Link>

          {token ? (
            <>
              {userRole === "Seller" && (
                <Link
                  to="/add-product"
                  className="text-green-300 hover:text-green-100 transition"
                >
                  Add Product
                </Link>
              )}
              <Link to="/dashboard" className="hover:text-blue-200 transition">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition ml-4"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="hover:text-blue-100 transition duration-200 text-lg"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="bg-white text-blue-600 px-5 py-2 rounded-lg hover:bg-gray-50 transition duration-200 font-semibold"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;

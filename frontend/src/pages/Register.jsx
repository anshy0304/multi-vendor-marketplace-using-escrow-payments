import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import baseURL from "../api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Buyer");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseURL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          role: role,
        }),
      });
      if (response.ok) {
        alert("Registration successfull! You can now log in.");
        navigate("/login");
      } else {
        const errorData = await response.text();
        setErrorMessage(errorData);
      }
    } catch (error) {
      setErrorMessage("Could not connect to the server");
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto mt-10 bg-white p-10 border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-6">
          Create an Account
        </h2>

        {errorMessage && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-5 text-center border border-red-200 font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col space-y-5">
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:shadow-md transition duration-200 bg-gray-50"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:shadow-md transition duration-200 bg-gray-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:shadow-md transition duration-200 bg-gray-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">
              I want to be a...
            </label>
            <select
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-blue-500 focus:shadow-md transition duration-200 bg-gray-50"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Buyer">Buyer</option>
              <option value="Seller">Seller</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition duration-200 text-lg mt-2"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-semibold underline"
          >
            Log in here
          </Link>
        </p>
      </div>
    </>
  );
}

export default Register;

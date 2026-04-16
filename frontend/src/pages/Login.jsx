import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import baseURL from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseURL}/auth/login`, {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("role", data.role);
        navigate("/");
      } else {
        setErrorMessage(data);
      }
    } catch (error) {
      setErrorMessage("Could not connect to the server.Backend issue");
    }
  };
  return (
    <>
      <div className="max-w-md mx-auto mt-10 bg-white p-10 border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-6">
          Login to MarketPlace
        </h2>
        {errorMessage && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-5 text-center border border-red-200 font-medium">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleLogin} className="flex flex-col space-y-5">
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
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition duration-200 text-lg mt-2"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;

// src/pages/HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 text-white">
      <h1 className="text-5xl font-bold mb-6">Live Polling System</h1>
      <p className="text-lg mb-8 text-center w-3/4">
        Engage your students in real-time with interactive polling and live discussions!
      </p>

      <div className="flex gap-6">
        <button
          onClick={() => navigate("/teacher")}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition duration-300"
        >
          Teacher Login
        </button>

        <button
          onClick={() => navigate("/student")}
          className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-yellow-500 transition duration-300"
        >
          Student Login
        </button>
      </div>
    </div>
  );
};

export default HomePage;

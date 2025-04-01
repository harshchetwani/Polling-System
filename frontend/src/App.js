// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
//import StudentPage from "./components/StudentDashboard";
import TeacherDashBoard from "./components/TeacherDashBoard";
import StudentDashboard from "./components/StudentDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/teacher" element={<TeacherDashBoard />} />
      </Routes>
    </Router>
  );
};

export default App;

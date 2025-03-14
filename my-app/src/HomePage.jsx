import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css"; // Importing the CSS file for styling

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to the Voice Form App</h1>

      <div className="button-container">
        <button
          className="home-button"
          onClick={() => navigate("/speech")}
        >
          Fill Form
        </button>
        <button
          className="home-button"
          onClick={() => navigate("/records")}
        >
          View Records
        </button>
      </div>
    </div>
  );
};

export default HomePage;

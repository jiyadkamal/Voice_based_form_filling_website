import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import "./RecordsPage.css";

const RecordsPage = () => {
  const [records, setRecords] = useState([]);
  const navigate = useNavigate(); // ✅ Initialize useNavigate

  // Fetch records from MongoDB
  const fetchRecords = async () => {
    try {
      const response = await fetch("http://localhost:8000/get-responses");
      const data = await response.json();
      setRecords(data.responses || []);
    } catch (error) {
      console.error("❌ Error fetching records:", error);
    }
  };

  // Function to delete all records
  const deleteAllRecords = async () => {
    try {
      const response = await fetch("http://localhost:8000/delete-all-responses", {
        method: "DELETE",
      });

      if (response.ok) {
        alert("✅ All records deleted!");
        setRecords([]); // Clear the records from the state
      } else {
        alert("❌ Failed to delete records.");
      }
    } catch (error) {
      console.error("❌ Error deleting records:", error);
      alert("❌ Error deleting records.");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="records-container">
      <h1>Saved Records</h1>
      {records.length === 0 ? (
        <p>No records found</p>
      ) : (
        <ul className="records-list">
          {records.map((record, index) => (
            <li key={index} className="record-item">
              <strong>Response {index + 1}:</strong>
              <ul className="answers-list">
                {record.answers.map((answer, idx) => (
                  <li key={idx}>{answer}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate("/")} className="go-home-button">
        Go to Home
      </button>
      
      {/* Delete All Records Button */}
      <button onClick={deleteAllRecords} className="delete-button">
        Delete All Records
      </button>
    </div>
  );
};

export default RecordsPage;

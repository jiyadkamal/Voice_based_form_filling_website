import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import SpeechPage from "./SpeechPage";
import RecordsPage from "./RecordsPage"; // ✅ Import RecordsPage


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/speech" element={<SpeechPage />} />
        <Route path="/records" element={<RecordsPage />} /> {/* ✅ Add route */}
      </Routes>
    </Router>
  );
};

export default App;

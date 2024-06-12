// src/AverageCalculator.js

import React, { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:9876/numbers/";

const AverageCalculator = () => {
  const [numberId, setNumberId] = useState("e");
  const [windowPrevState, setWindowPrevState] = useState([]);
  const [windowCurrState, setWindowCurrState] = useState([]);
  const [average, setAverage] = useState(null);

  const fetchNumbers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${numberId}`);
      const data = await response.json();
      if (response.ok) {
        setWindowPrevState(data.windowPrevState);
        setWindowCurrState(data.windowCurrState);
        setAverage(data.avg);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchNumbers();
  }, [numberId]);

  return (
    <div>
      <h1>Average Calculator</h1>
      <select value={numberId} onChange={(e) => setNumberId(e.target.value)}>
        <option value="p">Prime</option>
        <option value="f">Fibonacci</option>
        <option value="e">Even</option>
        <option value="r">Random</option>
      </select>
      <button onClick={fetchNumbers}>Fetch Numbers</button>
      <div>
        <h2>Previous State</h2>
        <p>{JSON.stringify(windowPrevState)}</p>
        <h2>Current State</h2>
        <p>{JSON.stringify(windowCurrState)}</p>
        <h2>Average</h2>
        <p>{average}</p>
      </div>
    </div>
  );
};

export default AverageCalculator;

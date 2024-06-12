const express = require("express");
const axios = require("axios");
const app = express();
const port = 9876;
const WINDOW_SIZE = 10;

const apiUrls = {
  p: "http://20.244.56.144/test/primes",
  f: "http://20.244.56.144/test/fibo",
  e: "http://20.244.56.144/test/even",
  r: "http://20.244.56.144/test/rand",
};

let window = [];

const fetchNumbers = async (numberId) => {
  try {
    const response = await axios.get(apiUrls[numberId], {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE4MTc4OTk0LCJpYXQiOjE3MTgxNzg2OTQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjY3OTM2ZDQ4LThlZmMtNGIzMS04ZjAwLTQ4NjEzYWEyMWQzMSIsInN1YiI6ImZyYW5jaXNzdGVwaGFuLjA1QGdtYWlsLmNvbSJ9LCJjb21wYW55TmFtZSI6InN0ZXBoYW4iLCJjbGllbnRJRCI6IjY3OTM2ZDQ4LThlZmMtNGIzMS04ZjAwLTQ4NjEzYWEyMWQzMSIsImNsaWVudFNlY3JldCI6Inl4U21MUHFsUVFmVGNzbUciLCJvd25lck5hbWUiOiJTdGVwaGFuIiwib3duZXJFbWFpbCI6ImZyYW5jaXNzdGVwaGFuLjA1QGdtYWlsLmNvbSIsInJvbGxObyI6IjMxMjMyMTEwNTE2MyJ9.o4_GdLBTRwrKkDfPmTj8WkyPZeKrm8aRgYAmCoqxNPE", 
      timeout: 5000,
    });
    return response.data.numbers;
  } catch (error) {
    console.error("Error fetching numbers:", error.message);
    return [];
  }
};

app.get("/numbers/:numberId", async (req, res) => {
  const { numberId } = req.params;
  if (!apiUrls[numberId]) {
    return res.status(400).json({ error: "Invalid number ID" });
  }

  const numbers = await fetchNumbers(numberId);
  if (!numbers.length) {
    return res.status(500).json({ error: "Failed to fetch numbers" });
  }

  const windowPrevState = [...window];
  numbers.forEach((number) => {
    if (!window.includes(number)) {
      if (window.length >= WINDOW_SIZE) {
        window.shift();
      }
      window.push(number);
    }
  });

  const windowCurrState = [...window];
  const avg = window.reduce((acc, num) => acc + num, 0) / window.length;

  res.json({
    windowPrevState,
    windowCurrState,
    numbers,
    avg: avg.toFixed(2),
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

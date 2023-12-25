const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Mock data for a specific topic, e.g., "Machine Learning"
const mockData = {
  "Machine Learning": [
    { id: 1, content: "Machine learning is a type of artificial intelligence (AI) that allows software applications to become more accurate at predicting outcomes without being explicitly programmed to do so." },
    { id: 2, content: "Machine learning algorithms use historical data as input to predict new output values." },
    { id: 3, content: "The main types of machine learning are supervised learning, unsupervised learning, and reinforcement learning." }
  ]
};

app.post('/getKeyPoints', (req, res) => {
  const { topic } = req.body;

  if (mockData[topic]) {
    res.json({ keyPoints: mockData[topic] });
  } else {
    res.status(404).send('Topic not found');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
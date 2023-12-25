const express = require('express');
const cors = require('cors');
const openai = require('openai');

require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;

const openaiClient = new openai({ apiKey: openaiApiKey });

app.post('/getKeyPoints', async (req, res) => {
  const { topic } = req.body;

  try {
    const response = await openaiClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful education assistant designed to output structured JSON.",
        },
        { 
          role: "user", 
          content: `Provide key points about ${topic} in a structured JSON format. Use an array named 'Key Points', where each element is an object with 'Key' and 'Value' pairs. Each 'Key' should be a specific aspect of ${topic}, and 'Value' should provide information about it.`
        },
      ],
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
      max_tokens: 500, // Adjust as needed
    });
    console.log("Response initially received:", response.choices[0].message.content); // Print out the response
    // Extract the key points object
    // Assuming 'response' is the raw response you received
    const keyPointsData = response.choices[0].message.content;

    if (keyPointsData && Array.isArray(keyPointsData["Key Points"])) {
      const rawKeyPoints = keyPointsData["Key Points"];
    
      // Transform the key points into an array
      const keyPoints = rawKeyPoints.map((item, index) => ({
        id: index + 1, // Assign a unique ID
        content: `${item.Key}: ${item.Value}` // Combine Key and Value
      }));
      console.log('Transformed Key Points:', keyPoints);
      res.json({ keyPoints });
    } else {
      // Handle the case where 'Key Points' is not as expected
      res.status(500).json({ error: "Invalid key points data" });
    }
  } catch (error) {
    console.error('There was an error fetching the key points:', error);
    res.status(500).send('Error fetching key points');
  }
});

app.post('/test', async (req, res) => {

  try {
    const keyPointsData = {
      "Key Points": [
        {
          "Key": "Origin",
          "Value": "Monte Carlo methods are named after the famous casino in Monaco, due to the element of chance and randomness involved."
        },
        {
          "Key": "Probabilistic Modeling",
          "Value": "Monte Carlo methods are used to solve problems through simulation and random sampling, particularly in the field of probabilistic modeling."
        },
        {
          "Key": "Applications",
          "Value": "Monte Carlo methods are widely used in various fields such as finance, engineering, physics, and computer graphics for solving complex problems that involve randomness and uncertainty."
        },
        {
          "Key": "Integration",
          "Value": "Monte Carlo integration is a numerical technique for estimating the value of a definite integral using random sampling."
        },
        {
          "Key": "Simulation",
          "Value": "Monte Carlo simulation involves using random sampling to model and analyze the behavior of complex systems or processes, especially those with stochastic elements."
        }
      ]
    };

    if (keyPointsData && Array.isArray(keyPointsData["Key Points"])) {
      const rawKeyPoints = keyPointsData["Key Points"];
    
      // Transform the key points into an array
      const keyPoints = rawKeyPoints.map((item, index) => ({
        id: `${item.Key}`, // Assign a unique ID
        content: `${item.Value}` 
      }));
      console.log('Transformed Key Points:', keyPoints);
      res.json({ keyPoints });
    } else {
      // Handle the case where 'Key Points' is not as expected
      res.status(500).json({ error: "Invalid key points data" });
    }
  } catch (error) {
    console.error('There was an error fetching the key points:', error);
    res.status(500).send('Error fetching key points');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

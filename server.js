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
    //max_tokens: 100, // Adjust as needed
  });
  const parsedContent = JSON.parse(response.choices[0].message.content);

  // Map the "Key Points" to your desired format
  const keyPoints = parsedContent["Key Points"].map((item) => ({
    id: item.Key,
    content: item.Value
  }));
  
  console.log('Transformed Key Points:', keyPoints);
  res.json({ keyPoints });

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

app.post('/simplifyText', async (req, res) => {
  const { text } = req.body;

  try {
    const response = await openaiClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to simplify complex text.",
        },
        { 
          role: "user", 
          content: `Please simplify this text: ${text}`
        },
      ],
      model: "gpt-3.5-turbo-1106",
    });

    const simplifiedText = response.choices[0].message.content;
    res.json({ simplifiedText });
  } catch (error) {
    console.error('Error simplifying text:', error);
    res.status(500).send('Error simplifying text');
  }
});

app.post('/rewordText', async (req, res) => {
  const { text } = req.body;

  try {
    const response = await openaiClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to reword text.",
        },
        { 
          role: "user", 
          content: `I am confused. Please reword this text in a different persepctive: ${text}`
        },
      ],
      model: "gpt-3.5-turbo-1106",
    });

    const reWord = response.choices[0].message.content;
    res.json({ reWord });
  } catch (error) {
    console.error('Error rewording text:', error);
    res.status(500).send('Error rewording text');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

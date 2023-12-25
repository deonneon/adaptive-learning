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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

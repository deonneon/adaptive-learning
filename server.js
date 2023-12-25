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
          content: "You are a helpful education assistant designed to output JSON.",
        },
        { role: "user", content: `Summarize key points about ${topic}. Each key point should be its own property.` },
      ],
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
      max_tokens: 100, // Adjust as needed
    });
    console.log("Response initially received:", response.choices[0].message.content); // Print out the response
    // Transforming the response into a suitable format
    const keyPoints = response.choices.map((choice, index) => ({
      id: index, // Assign a unique ID since choice.id might not be available
      content: choice.text, // Trim to remove any extra whitespace
    }));

    console.log("Response received:", keyPoints); // Print out the response

    res.json({ keyPoints }); // Send the response in JSON format
  } catch (error) {
    console.error('There was an error fetching the key points:', error);
    res.status(500).send('Error fetching key points');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

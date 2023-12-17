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
    const response = await openaiClient.completions.create({
      model: 'gpt-3.5-turbo-instruct', // Choose the appropriate engine
      prompt: `Summarize key points about ${topic}`,
      max_tokens: 100, // Adjust as needed
    });

    const keyPoints = response.choices.map((choice) => ({
      id: choice.id,
      content: choice.text,
    }));

    res.json({ keyPoints });
  } catch (error) {
    console.error('There was an error fetching the key points:', error);
    res.status(500).send('Error fetching key points');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

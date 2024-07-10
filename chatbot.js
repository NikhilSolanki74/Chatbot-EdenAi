
const express = require('express');
const axios = require('axios');
const app = express();
let bodyParser = require('body-parser');
require('dotenv').config();

app.use(express.json());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const EDEN_AI_URL =''+ process.env.EDEN_AI_URL;
const EDEN_AI_API_KEY =''+ process.env.EDEN_AI_API_KEY;

if (!EDEN_AI_URL || !EDEN_AI_API_KEY) {
  console.error('Error: EDEN_AI_URL or EDEN_AI_API_KEY is not set in environment variables.');
  process.exit(1); // Exit the application if environment variables are not set
}

app.get('/', (req, res) => {
  res.render('chatPage.ejs');
});

app.post('/process-message', async (req, res) => {
  const userMessage = req.body.message;

  const payload = {
    providers: "openai",
    text: userMessage,
    chatbot_global_action: "Act as an assistant",
    previous_history: [],
    temperature: 0.0,
    max_tokens: 40,
  };

  try {
    const response = await axios.post(EDEN_AI_URL, payload, {
      headers: {
        Authorization: `Bearer ${EDEN_AI_API_KEY}`
      }
    });

    if (response.data && response.data.openai) {
      const generatedText = response.data.openai.generated_text;
      res.send({ response: generatedText });
    } else {
      throw new Error('Invalid response structure from API');
    }
  } catch (error) {
    console.error('Error during API request:', error.message);
    if (error.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message);
    }
    res.status(500).send({ response: "An error occurred while processing your request." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});

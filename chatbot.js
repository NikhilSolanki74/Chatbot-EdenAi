const express = require('express');
const axios = require('axios');
const app = express();
let bodyParser = require('body-parser');
require('dotenv').config()
app.use(express.json());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const EDEN_AI_URL = process.env.EDEN_AI_URL;
const EDEN_AI_API_KEY = process.env.EDEN_AI_API_KEY;

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
        Authorization: EDEN_AI_API_KEY
      }
    });

    const generatedText = response.data.openai.generated_text;
    const resp = {
      response: generatedText
    };

    res.send(resp);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ response: "An error occurred while processing your request." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Server is running on port 4000');
  }
});

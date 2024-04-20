const express = require('express');
const cors = require('cors');


const { supabase } = require('./supabaseClient');

const app = express();
app.use(express.json());
app.use(cors()); // Allows requests from your frontend

require('dotenv').config();
//console.log("API Key: ", process.env.OPENAI_API_KEY);

const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);



// universal error catcher


app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})


console.log('API Key: ', process.env.OPENAI_API_KEY);

app.post('/generate-questions', async (req, res) => {
  // TODO: this should be called when the user clicks on a button to generate questions 
  // no need to send userContent


  const videoID = req.body.videoID;
  const transcript = req.body.transcript;


  console.log('generating with the following', videoID, transcript)
  try {

    const systemMessage = 'Generate a JSON list of multiple-choice questions with four options (A, B, C, D) and an answer property with the correct choice. Using the following content:'


    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
        {
          role: 'user',
          content: transcript,
        }
      ],
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    //console.log('received response from openai api', openaiResponse)
    //res.json({ summary: openaiResponse.data.choices[0].message.content })
    const jsonString = completion.data.choices[0].message.content.replace(/```json\n|```/g, '').trim();

    let questions;
    try {
      questions = JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing JSON string:', error);
    }

    // Now `questions` is a JavaScript object that you can work with
    // For example, logging it to the console in a pretty format
    console.log('UPLOADING TO OPENAI', JSON.stringify(questions, null, 2));

    res.json({ summary: questions });

    const { newData, err } = await supabase
      .from('quiz')
      .insert([{
        video_id: videoID,
        content: questions
      }])
      .select()

  }
  catch (err) {
    console.error('Error inside /generate-questions', err)
    res.status(500).send('Error generating questions');
  }

})



app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

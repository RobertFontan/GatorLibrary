const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');


const { supabase } = require('./supabaseClient');

const app = express();
app.use(express.json());
app.use(cors()); // Allows requests from your frontend

require('dotenv').config();
//console.log("API Key: ", process.env.OPENAI_API_KEY);

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// universal error catcher
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})


app.post('/generate-questions', async (req, res) => {
  // TODO: this should be called when the user clicks on a button to generate questions 
  // no need to send userContent


  const videoID = req.body.videoID;



  console.log(videoID)
  try {

    const { data, error } = await supabase
      .from('quiz')
      .select('content')
      .eq('video_id', videoID)

    console.log('data', data, 'error', error)


    if (data) {
      console.log('data', data)
      res.json({ summary: data[0].content });
    }

    else {
      const transcript = req.body.userContent;
      const systemMessage = 'Generate a numbered list of multiple-choice questions with four options (A, B, C, D), one of which is denoted correct (using parenthesis) from the following content:'

      // A) , B) 
      const completion = await openai.chat.completions.create({
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
      console.log('received response from openai api', completion)
      res.json({ summary: completion.choices[0].message.content });


      const { newData, err } = await supabase
        .from('quiz')
        .insert([{
          video_id: videoID,
          content: completion.choices[0].message.content
        }])
        .select()
      console.log('data', newData, 'error', err)

    }

    // TODO: add to quiz table
    // find a way to make results from it 


  } catch (err) {
    if (err.status === 429) {
      console.error('Rate limit exceeded', err);
      res.status(429).send('Rate limit exceeded. Please try again later.');
    }
    else {
      console.error('Error inside /generate-questions', err)
      res.status(500).send('Error generati`ng questions');
    }
  }
})



app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

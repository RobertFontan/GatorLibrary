const express = require('express');
const cors = require('cors');
const axios = require('axios');


const { supabase } = require('./supabaseClient');

const app = express();
app.use(express.json());
app.use(cors()); // Allows requests from your frontend

require('dotenv').config();
//console.log("API Key: ", process.env.OPENAI_API_KEY);

const {OpenAI}= require ('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});



// universal error catcher


app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

const fetchTranscriptData = async (videoId) => {
  console.log('fetching transcript data')
  const options = {
    method: 'GET',
    url: 'https://youtube-captions.p.rapidapi.com/onlycaption',
    params: {
      videoId: videoId
    },
    headers: {
      'X-RapidAPI-Key': '3bbf868d53msh78af357de335f9ap1536a6jsn20da07fcbe43',
      'X-RapidAPI-Host': 'youtube-captions.p.rapidapi.com'
    }
  };
  // const options = {
  //   method: 'GET',
  //   url: 'https://youtube-captions.p.rapidapi.com/create-transcript',
  //   params: {
  //     videoUrl: 'https://www.youtube.com/watch?v=' + videoId
  //   },
  //   headers: {
  //     'X-RapidAPI-Key': '3bbf868d53msh78af357de335f9ap1536a6jsn20da07fcbe43',
  //     'X-RapidAPI-Host': 'youtube-captions.p.rapidapi.com'
  //   }
  // };

  const response = await axios.request(options);
  return response
}


app.post('/generate-questions', async (req, res) => {
  // TODO: this should be called when the user clicks on a button to generate questions 
  // no need to send userContent


  const videoID = req.body.videoID;



  console.log('generating with the following', videoID)
  try {

    const { data, error } = await supabase
      .from('quiz')
      .select('content')
      .eq('video_id', videoID)

    // console.log('data', data, 'error', error)


    if (data.length != 0) {
      console.log('DATA FROM SUPABASE', data)
      res.json({ summary: data[0].content });
    }

    else {

      let transcript = '';

      // get the transcript from supabase
      const {transcriptData, error} = await supabase
        .from('notes')
        .select('transcript')
        .eq('videoId', videoID)
        .single()

      if(transcriptData) {
        console.log('transctipy data', transcriptData)
        transcript = transcriptData.transcript
      }
      else {
        console.log('No transcript in table', error)

        const response = await fetchTranscriptData(videoID)
        console.log('response', response.data)
        
        transcript = response.data

      }
      console.log('transcript', transcript)
      const systemMessage = 'Generate a JSON list of multiple-choice questions with four options (A, B, C, D) and an answer property with the correct choice. Using the following content:'
      // make JSON 

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

      
      const jsonString = completion.choices[0].message.content.replace(/```json\n|```/g, '').trim();

      let questions;
      try {
        questions = JSON.parse(jsonString);
      } catch (error) {
        console.error('Error parsing JSON string:', error);
      }

      // Now `questions` is a JavaScript object that you can work with
      // For example, logging it to the console in a pretty format
      console.log('UPLOADING TO OPENAI', JSON.stringify(questions, null, 2));
      
      res.json({ summary: questions});

      const { newData, err } = await supabase
        .from('quiz')
        .insert([{
          video_id: videoID,
          content: questions
        }])
        .select()

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
      res.status(500).send('Error generating questions');
    }
  }
})



app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

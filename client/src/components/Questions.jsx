import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import axios from 'axios'

function Questions({videoID}) {
  const [text, setText] = useState('')
  const [questionRes, setQuestionRes] = useState(null)


  const fetchQuestions = async (e) => {
    e.preventDefault()


    try {
      const response = await axios.post('http://localhost:5000/generate-questions', { userContent: text, videoID: videoID})
      console.log(response.data)
      setQuestionRes(response.data.summary)
    } catch (error) {
      console.error('ai question error', error)
      setQuestionRes('Error Generating Questions, try again later :(')
    }
  }

  return (
    <div>
      <Form onSubmit={fetchQuestions}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Make Questions from the following:</Form.Label>
          {/* <Form.Control size='lg' value={numb} onChange={(e) => setNumb(e.target.value)}/> */}
          {/* <h1> Video ID: {videoID}</h1> */}
          <Form.Control as="textarea" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
          <Button variant='success' className='generate' type='submit'>Generate</Button>

        </Form.Group>
      </Form>
      <div className='question-container'>
        {questionRes && <div className='answer'>
          <h3>Generated Questions</h3>
          <p>{questionRes}</p></div>}
      </div>
    </div>
  )
}

export default Questions
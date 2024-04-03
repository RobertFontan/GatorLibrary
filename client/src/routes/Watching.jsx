import React, { useEffect, useState, useRef} from 'react'
import Youtube from 'react-youtube'

/* Components */
import Comment from '../components/Comment';
import NotesSidebar from '../components/NotesSidebar';
import Transcript from '../components/Transcript';
import DownloadComponent from '../components/DownloadComponent';
import SaveButton from '../components/SaveButton';
import AIComponent from '../components/AIComponent';
import { Modal} from 'react-bootstrap';

/* Routing */
import { useParams } from 'react-router-dom';

/* API/Database */
import axios from 'axios';

import supabase from '../config/supabaseClient';

/* Bootstrap */
import {Container, Row, Col, Accordion,  Button} from 'react-bootstrap';

/* History */

function Watching() {
  const {course ,videoID} = useParams()

  const [showQuizModal, setShowQuizModal] = useState(false);


  const [videoData, setVideoData] = useState(null)


  const [description, setDescription] = useState(null)
  const [title, setTitle] = useState(null)
  const [sidebar, setSidebar] = useState("notes")
  
  
  const [saveData, setSaveData] = useState([])
  
  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
    },
  };

  const API_KEY = "AIzaSyCIFWHUm93iCiFfytTQGPtu-MzyXoUrIAY"
  const newFetchURL = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoID}&key=${API_KEY}`
  const fetchURL = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&key=${API_KEY}`

  const fetchData = async () => {
    const {data, error} = await axios.get(newFetchURL)
    console.log('made it here')
    if(data){
      console.log('NEW', data)
      console.log('watching data', data.items[0].snippet)


      setVideoData(data.items[0].snippet)
      setSaveData([data.items[0].contentDetails.duration, data.items[0].snippet.publishedAt, course])

      setTitle(data.items[0].snippet.title)
      setDescription(data.items[0].snippet.description)
    }
    if(error){
      console.log('watching error', error)
    }
    
    // get content duration, date (easy), course title (hard)
  }

  useEffect(() => {
    fetchData()
  }, [])


  const handleClick = (component) => {
    setSidebar(component);
  };

  // send video object to database
  const handleVideoSave = async () => {
    
    // this sends video to database 
    const {data, error} = await supabase
    .from('Saved')
    .insert({ 'videoId': videoID, 'title': title, 'thumbnail': videoData.thumbnails.medium.url })
    
    if(data){
      console.log(data)
    }
    if(error){
      alert('Already saved (this will be updated :p)')
      console.log('error', error)
    }
  }

  /* TIMESTAMP */

  const playerRef = useRef()
  const onReady = (e) =>{
    playerRef.current = e.target
  }

  // maybe send to save data base
  const timeStampClick = (seconds) =>{
    if(playerRef.current){
      playerRef.current.seekTo(seconds)
    }
  }


  return (  
    <>
    <Container fluid className='watching'>
      <Row>
      <Col lg={6} className="left-screen">
        
        <div className="video-player">
          
          <Youtube videoId={videoID} opts={opts} onReady={onReady} />
          <div className="header">
            <h3>{title}</h3>
            <DownloadComponent videoId={videoID} />
            <SaveButton title={title} videoID={videoID} videoData={videoData} saveData={saveData} />
          </div>
        </div>        
        <Accordion flush alwaysOpen>
          <Accordion.Item eventKey='0'>
            <Accordion.Header>Description</Accordion.Header>
            <Accordion.Body>{description && <div id="description">{description}</div>}</Accordion.Body>
          </Accordion.Item>

            <Accordion.Item eventKey='1'>
              <Accordion.Header>Comments</Accordion.Header>
              <Accordion.Body><Comment videoId={videoID} /></Accordion.Body>
            </Accordion.Item>

          </Accordion>      
        </Col>
        <Col  className='right-screen'>
          <div className="button-container">
            <Button className={sidebar === "notes" ? "active": ""} onClick={()=> handleClick("notes")}>Notes</Button>
            <Button className={sidebar === "transcript" ? "active": ""} onClick={() => handleClick("transcript")}>Transcript</Button>
            <AIComponent onClick={() => setShowQuizModal(true)} />
            {/* //add quiz stuff over here */}
              <Modal show={showQuizModal} onHide={() => setShowQuizModal(false)} dialogClassName="fullscreen-modal">
                  <Modal.Header closeButton>
                    <Modal.Title>Quiz Time</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {/* Quiz Questions HERE */}
                    Here will be the quiz questions.
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowQuizModal(false)}>
                      Close
                    </Button>
                    <Button variant="primary">
                      Submit Answers
                    </Button>
                  </Modal.Footer>
              </Modal>

          </div>
          <div className="sidebar">
            {sidebar === "transcript" ? <Transcript videoId={videoID}/>: <NotesSidebar pRef={playerRef}title={title} videoId={videoID} />}
          </div>
        </Col>
      </Row>
    </Container>
    </>
     
  )
}

export default Watching
import React, { useEffect, useState, useRef} from 'react'
import Youtube from 'react-youtube'
import './Watching.css';

/* Components */
import NotesSidebar from '../components/NotesSidebar';
import Transcript from '../components/Transcript';
import DownloadComponent from '../components/DownloadComponent';
import SaveButton from '../components/SaveButton';
import AIComponent from '../components/AIComponent';
import { useSession } from '../components/SessionContext';

/* Routing */
import { useParams } from 'react-router-dom';

/* API/Database */
import axios from 'axios';

import supabase from '../config/supabaseClient';

/* Bootstrap */
import { Container, Row, Col, Accordion, Button, Form } from 'react-bootstrap';

/* History */

function Watching() {
  const session = useSession();
  const {course ,videoID} = useParams()
  const [comments, setComments] = useState([]);


  const [videoData, setVideoData] = useState(null)


  const [description, setDescription] = useState(null)
  const [title, setTitle] = useState(null)
  const [sidebar, setSidebar] = useState("notes")
  
  
  const [saveData, setSaveData] = useState([])



  const [commentText, setCommentText] = useState('');

  
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


  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('video_id', videoID);
      if (error) {
        throw error;
      }
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error.message);
    }
  };

  useEffect(() => {
    fetchData();
    fetchComments();
  }, [videoID]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', session.user.id)
        .single();
      if (profileError) {
        throw profileError;
      }
      const fullName = userProfile ? userProfile.full_name : 'Unknown';
      
      // Get current timestamp
      const timestamp = new Date().toLocaleString();
  
      const { data: commentData, error: commentError } = await supabase
        .from('comments')
        .insert({
          video_id: videoID,
          user_id: session.user.id,
          fullName: fullName,
          comment_text: commentText,
          timestamp: timestamp // Include timestamp in the comment data
        });
      if (commentError) {
        throw commentError;
      }
      console.log('Comment submitted:', commentData);
      setCommentText('');
      fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error.message);
    }
  };

  const handleClickTimestamp = (timestamp) => {
    if (playerRef.current) {
      const [minutes, seconds] = timestamp.split(':').map(parseFloat);
      const totalSeconds = minutes * 60 + seconds;
      playerRef.current.seekTo(totalSeconds);
    }
  };
  





  return (  
    <>
      <Container fluid className='watching'>
        <Row>
          <Col lg={6} className='left-screen'>
            <div className='video-player'>
              <Youtube videoId={videoID} opts={opts} onReady={onReady} />
              <div className='header'>
                <h2>{title}</h2>
                <DownloadComponent videoId={videoID} />
                <SaveButton title={title} videoID={videoID} videoData={videoData} saveData={saveData} />
              </div>
            </div>
            <Accordion flush alwaysOpen>
              <Accordion.Item eventKey='0'>
              <Accordion.Header className='accordion-title'>Description</Accordion.Header>
                <Accordion.Body><div id='description'>{description}</div></Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='1'>
              <Accordion.Header className='accordion-title'>Comments</Accordion.Header>
                <Accordion.Body className='comments'>
                {comments.length > 0 ? (
  comments
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) // Sort comments by timestamp
    .map((comment, index) => (
      <div key={index} className="comment-container">
        <div className="comment-text">
          <strong>{comment.fullName}</strong>:&nbsp;
          {comment.comment_text.split(/(\d+:\d+)/g).map((text, index) =>
            /\d+:\d+/.test(text) ? (
              <span
                key={index}
                style={{ color: 'blue', cursor: 'pointer' }}
                onClick={() => handleClickTimestamp(text)}
              >
                {text}
              </span>
            ) : (
              <span key={index}>{text}</span>
            )
          )}
        </div>
        <div className="comment-timestamp">{comment.timestamp}</div>
      </div>
    ))
) : (
  <p>No comments yet.</p>
)}

<Form onSubmit={handleCommentSubmit}>
  <Form.Group controlId="commentTextarea" style={{ position: 'relative' }}>
    <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Form.Control
        as="textarea"
        rows={3}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write your comment here..."
        style={{ fontSize: '15px' }}
      />
      <div style={{ marginTop: '10px', alignSelf: 'flex-end' }}>
        <Button variant="primary" type="submit" className='button'>
          Submit
        </Button>
      </div>
    </div>
  </Form.Group>
</Form>

                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
          <Col className='right-screen'>
            <div className='button-container'>
              <Button className={sidebar === 'notes' ? 'active button' : 'button'} onClick={() => handleClick('notes')}>
                Notes
              </Button>
              <Button className={sidebar === 'transcript' ? 'active button' : 'button'} onClick={() => handleClick('transcript')}>
                Transcript
              </Button>
              <AIComponent />
            </div>
            <div className='sidebar'>{sidebar === 'transcript' ? <Transcript videoId={videoID} /> : <NotesSidebar pRef={playerRef} title={title} videoId={videoID} />}</div>
          </Col>
        </Row>
      </Container>
    </>
  );
  
  
}


export default Watching
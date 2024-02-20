import React, {useState, useEffect} from 'react'
// import './Notes.css'
import {Col, Nav, Row, Tab} from 'react-bootstrap';

import Note from '../components/Note';
import { useSession } from '../components/SessionContext';

import supabase from '../config/supabaseClient'


function Notes() {

  const [notes, setNotes] = useState(null)
  const session = useSession()

  useEffect(() => {
    const fetchData = async () =>{
      
      const { data, error } = await supabase
      .from('notes')
      .select('content, title, videoId')
      .eq('profile_id', session.user.id)


      if(data){
        setNotes(data)
        console.log('NOTES', data)
      }
      if(error){
        console.log('NOTES ERROR', error)
      }
    } 
    fetchData()
  
  }, [])



  return (
    <>
    {notes && <div className = "notes">
      <h1>Notes</h1>
        <Tab.Container defaultActiveKey="first">
          <Row>
            <Col className='nav-col' sm={3}>
              <Nav>
                { notes.map((e) => (
                  <Nav.Item>
                    <Nav.Link eventKey={e.videoId}>{e.title}</Nav.Link>
                  </Nav.Item>))
                }
              </Nav>
            </Col>
            <Col>

              <Tab.Content className='note-tab-content'>
                {notes.map((e) => (
                  <Tab.Pane className='note-tab-content' eventKey={e.videoId}>
                    <Note title={e.title} videoID={e.videoId} data={e.content} />
                  </Tab.Pane>
                ))}
              </Tab.Content>
            
            </Col>
          </Row>
        </Tab.Container>
    </div>}
    </>
  )
}

export default Notes
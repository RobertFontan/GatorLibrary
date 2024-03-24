import React from 'react'
/* Components */
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import supabase from '../config/supabaseClient'
import Course from '../components/Course'
import Explore from '../components/Explore'

import { useSession } from '../components/SessionContext';


// dummy info
import explore from "../data/explore"
/* Bootstrap  */
import { Container, Row, Col, Nav } from 'react-bootstrap'
//import courses from '../data/courses'


function Home() {
  const session = useSession()

  const [courses, setCourses] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('profile_id', session.user.id)

          setCourses(data)

        console.log('HOMEHOME', data, session.user.id)
        if (error) {
          console.error('error', error)
        }
      }
    };

    fetchUserData();
  }, [session]);


  // useEffect(() => {
  //   const fetchData = async () => {

  //     if (session) {
  //       const { data, error } = await supabase
  //         .from('courses')
  //         .select('*')
  //         .eq('profile_id', profileID)

  //       console.log('HOME', data, profileID)
  //       if (error) {
  //         console.error('error', error)
  //       }

  //     }



  //   }
  //   fetchData()
  // }, [])


  //const playlistID = "PLoROMvodv4rMyupDF2O00r19JsmolyXdD" // depending on course 
  // const API_KEY = "AIzaSyCIFWHUm93iCiFfytTQGPtu-MzyXoUrIAY"

  return (
    <>
      <Container fluid="xs" className='home'>
        <Row>
          <Col lg={9} className='left-screen'>
            <h1>Lectures</h1>
            {courses && courses.map(course => <Course course={course} />)}
          </Col>
          <Col lg={3} className='right-screen'>
            <Explore explore={explore} />
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Home
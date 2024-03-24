import React, {useState, useEffect} from 'react'
import './Profile.css'
import {Col, Nav, Row, Tab} from 'react-bootstrap';
import Course from '../components/Course'
import courses from '../data/courses'

import Note from '../components/Note';

import supabase from '../config/supabaseClient'




function Profile() {

  const [notes, setNotes] = useState(null)

  useEffect(() => {
    const fetchData = async () =>{
      
      const { data, error } = await supabase
      .from('Notes')
      .select('Notes, title, videoId')


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
   
      <h1>Profile</h1>
      <div>
      <h3>Degree Checklist</h3>
      <ul>
      <div class="container"> 
              <div id="accordion">
  <div class="card">
    <div class="card-header" id="headingOne">
      <h5 class="mb-0">
        <button class="DCbutton" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" color ="white">
          CEN4721 - Human Computer Interaction
        </button>
      </h5>
    </div>

    <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
      <div class="card-body">
        Recommended Videos:
        <Col lg={9} className='left-screen'>
            {courses.map(course => <Course course={course} />)}
          </Col>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-header" id="headingTwo">
      <h5 class="mb-0">
        <button class="DCbutton" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
          COT3100 - Discrete Structures
        </button>
      </h5>
    </div>
    <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
      <div class="card-body">
        Recommended Videos:
        <Col lg={9} className='left-screen'>
            {courses.map(course => <Course course={course} />)}
          </Col>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-header" id="headingThree">
      <h5 class="mb-0">
        <button class="DCbutton" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
          COP46000 -  Operating Systems
        </button>
      </h5>
    </div>
    <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordion">
      <div class="card-body">
        Recommended Videos:
        <Col lg={9} className='left-screen'>
            {courses.map(course => <Course course={course} />)}
          </Col>
      </div>
    </div>
  </div>
    <div class="card">
    <div class="card-header" id="headingFour">
      <h5 class="mb-0">
        <button class="DCbutton" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
          STA3032 - Engineering Statistics
        </button>
      </h5>
    </div>
    <div id="collapseFour" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
      <div class="card-body">
      Recommended Videos:
        <Col lg={9} className='left-screen'>
            {courses.map(course => <Course course={course} />)}
          </Col>
      </div>
    </div>
  </div>
    <div class="card">
    <div class="card-header" id="headingFive">
      <h5 class="mb-0">
        <button class="DCbutton" data-toggle="collapse" data-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
          MAC2311 - Calculus 1
        </button>
      </h5>
    </div>
    <div id="collapseFive" class="collapse" aria-labelledby="headingfive" data-parent="#accordion">
      <div class="card-body">
      Recommended Videos:
        <Col lg={9} className='left-screen'>
            {courses.map(course => <Course course={course} />)}
          </Col></div>
    </div>
  </div>
    <div class="card">
    <div class="card-header" id="headingSix">
      <h5 class="mb-0">
        <button class="DCbutton" data-toggle="collapse" data-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
          MAC2312 - Calculus 2
        </button>
      </h5>
    </div>
    <div id="collapseSix" class="collapse" aria-labelledby="headingSix" data-parent="#accordion">
      <div class="card-body">
      Recommended Videos:
        <Col lg={9} className='left-screen'>
            {courses.map(course => <Course course={course} />)}
          </Col></div>
    </div>
  </div>
</div>

      </div>   
      </ul>
    </div>

    <div>
      <h1>My Component with Buttons</h1>

      {/* Button 1 with spacing */}
      <button className="my-button" onClick={() => console.log('Button 1 clicked')}>Button 1</button>

      {/* Add spacing between buttons */}
      <div className="button-spacing"></div>

      {/* Button 2 with spacing */}
      <button className="my-button" onClick={() => console.log('Button 2 clicked')}>Button 2</button>
    </div>
       
    </>
  )
}

export default Profile
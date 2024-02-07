import React, {useState, useEffect} from 'react'
import './Profile.css'
import {Col, Nav, Row, Tab} from 'react-bootstrap';

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
      <h3>Selected Courses</h3>
      <ul>
        <li>Lorem ipsum dolor sit amet</li>
        <li>Lorem ipsum dolor sit amet</li>
        <li>Lorem ipsum dolor sit amet</li>
        <li>Lorem ipsum dolor sit amet</li>
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
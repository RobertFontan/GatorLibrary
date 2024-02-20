import React, {useState, useEffect} from 'react'
import './Profile.css'
import {Col, Nav, Row, Tab} from 'react-bootstrap';
import Course from '../components/Course'
import courses from '../data/courses'
import Note from '../components/Note';

import supabase from '../config/supabaseClient'
import { useSession } from '../components/SessionContext'


function Profile() {
  const session = useSession()

  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('profile_id', session.user.id)

          setProfile(data)

        console.log('HOMEHOME', data, session.user.id)
        if (error) {
          console.error('error', error)
        }
      }
    };

    fetchUserData();
  }, [session]);
  /*

    const quizScores = [85, 92, 78];
    const userName = "John Doe";
    const profession = "Student";
    const email = "john.doe@example.com";
    const location = "Gainesville, FL";
    const joined = "January 1, 2024";
*/

  return (
    <>
   

   /*
      <h2>Welcome, {userName} ...</h2>
      <div>
      <div className="button-spacing"></div>
      <h4>Selected Courses</h4>
      <ul>
          {courses.map((course, index) => (
            <li key={index}>{course.title}</li>
          ))}
        </ul>
    </div>



    <div className="user-profile">
      <img
        className="profile-picture"
        src="https://placekitten.com/150/150" // Replace with the URL of your profile picture
        alt="Profile"
      />
      <h2 className="user-name">{userName}</h2>
      <p className="user-bio">{profession}</p>
      <ul className="user-details">
        <li>Email: {email}</li>
        <li>Location: {location}</li>
        <li>Joined: {joined}</li>
      </ul>
      <div className="user-buttons">
      <button className="button" onClick={() => console.log('Button 1 clicked')}>Edit Graduation Checklist</button>
      <div className="button-spacing"></div>
        <button className="button" onClick={() => console.log('Button 2 clicked')}>Video Preferences</button>
      </div>
    </div>
    <div className="button-spacing"></div>
    <h4>Previous Quizzes</h4>
    <div className="quiz-buttons">
        {/* Three buttons with latest quiz scores */}
        {quizScores.map((score, index) => (
          <button key={index} onClick={() => console.log(`Quiz ${index + 1} Score: ${score}`)}>
            Quiz {index + 1} Score: {score}
          </button>
        ))}
      </div>

      <div className="button-spacing"></div>

     {/*} {courses.map(course => <Course course={course} />) */}
       
     <div className="button-spacing"></div>
     <div className="button-spacing"></div>
      <h4>History</h4>
    </>
  )
}


export default Profile
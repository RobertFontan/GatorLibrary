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
  const [courses, setCourses] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setProfile(data);

        console.log('SETPROFILE', data, session.user.id);

        if (error) {
          console.error('error', error);
        }

        const { data: coursesData, error: errorCourses } = await supabase
          .from('courses')
          .select('*')
          .eq('profile_id', session.user.id);

        setCourses(coursesData);
        console.log('SETCOURSES', coursesData, session.user.id);

        if (errorCourses) {
          console.error('error', errorCourses);
        }
      }
    };

    fetchUserData();
  }, [session]);

  const quizScores = [85, 92, 78];
  /*

    
    const userName = "John Doe";
    const profession = "Student";
    const email = "john.doe@example.com";
    const location = "Gainesville, FL";
    const joined = "January 1, 2024";
*/


return (
  <div>
  {profile ? (
    <div>
     <h2>Welcome, {profile.full_name} ...</h2>
      <div>
      <div className="button-spacing"></div>
      <h4>Selected Courses</h4>
      <ul>
      {courses && courses.map(course => <p key={course.id}>{course.title}</p>)}
        </ul>
    </div>

    {/* User Profile */}
    <div className="user-profile">
        <img
          className="profile-picture"
          src="https://placekitten.com/150/150" // Replace with the URL of your profile picture
          alt="Profile"
        />
        <h2 className="user-name">{profile.full_name}</h2>
        <p className="user-bio">{profile.student_type}</p>
        <ul className="user-details">
          <li>Email: {profile.email}</li>
          <li>Year: {profile.year}</li>
        </ul>
        <div className="user-buttons">
          <button className="button" onClick={() => console.log('Button 1 clicked')}>
            Edit Graduation Checklist
          </button>
          <div className="button-spacing"></div>
          <button className="button" onClick={() => console.log('Button 2 clicked')}>
            Video Preferences
          </button>
        </div>
      </div>

       {/* Previous Quizzes */}
       <div>
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
      </div>

       {/* History */}
       <div>
        <div className="button-spacing"></div>
        <div className="button-spacing"></div>
        <h4>History</h4>
        {/* Add history content here */}
      </div>
    

    </div>
  ) : (
    <p>Loading...</p>
  )}
</div>
  );
};

export default Profile;
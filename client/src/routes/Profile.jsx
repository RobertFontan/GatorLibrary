import React, {useState, useEffect} from 'react'
import './Profile.css'
import {Col, Nav, Row, Tab} from 'react-bootstrap';
import { Link, Routes, Route, BrowserRouter, useLocation } from "react-router-dom"
import Course from '../components/Course'
import courses from '../data/courses'
import Note from '../components/Note';
import img1 from '../images/img1.jpeg';
import img2 from '../images/img2.jpeg';
import img3 from '../images/img3.jpeg';
import profileImage from '../images/kitten.jpeg'; 
import supabase from '../config/supabaseClient'
import { useSession } from '../components/SessionContext'



function Profile() {
  const session = useSession()

  const [profile, setProfile] = useState(null)
  const [courses, setCourses] = useState(null)
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [backgroundImage, setBackgroundImage] = useState(img1); // Default background image



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

        const { data: todosData, error: todosError } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', session.user.id);

      setTodos(todosData || []);

      if (todosError) {
        console.error('To-do list fetch error', todosError);
      }

      }
      
    };

    fetchUserData();
  }, [session]);

  const quizScores = [85, 92, 78];

  const addTodo = async () => {
    if (newTodo.trim() !== '') {
      try {
       
        await supabase
          .from('todos')
          .insert([
            {
              user_id: session.user.id,
              todo: newTodo,
            },
          ]);
  
       
        const { data: refreshedTodosData, error: refreshError } = await supabase
          .from('todos')
          .select('*')
          .eq('user_id', session.user.id);
  
        if (refreshedTodosData) {
          setTodos(refreshedTodosData || []);
          setNewTodo('');
        }
  
        if (refreshError) {
          console.error('To-do list refetch error', refreshError);
        }
      } catch (error) {
        console.error('Error adding todo', error);
      }
    }
  };
  
  
  
  const removeTodo = async (id) => {
    const { data, error } = await supabase.from('todos').delete().eq('id', id);
  
    if (error) {
      console.error('error', error);
    } else {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  const handleBackgroundImageChange = () => {
    if (backgroundImage === img1) {
      setBackgroundImage(img2);
    } else if (backgroundImage === img2) {
      setBackgroundImage(img3); 
    } else {
      setBackgroundImage(img1);
    }
  };
  
  
  
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
      <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', minHeight: '100vh' }}>
        <div className="transparent-container">

          <div className="transparent-box welcome-box">
            <h2>Welcome, {profile.full_name} ...</h2>
          </div>

          <div className="transparent-box courses-box">
            <div>
              <h4>Selected Courses</h4>
              <ul>
                {courses && courses.map(course => <p key={course.id}>{course.title}</p>)}
              </ul>
            </div>
          </div>

          <div className="transparent-box quizzes-box">
            <div>
              <h4>Previous Quizzes</h4>
              <div className="quiz-buttons">
                {quizScores.map((score, index) => (
                  <button key={index} onClick={() => console.log(`Quiz ${index + 1} Score: ${score}`)}>
                    Quiz {index + 1} Score: {score}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="transparent-box history-box">
            <div>
              <h4>History</h4>
              {/* Add history content here */}
            </div>
          </div>

          <div className="transparent-box user-profile-box">
          <div className="profile-picture-container">
          <div
        className="profile-picture"
        style={{ backgroundImage: `url(${profileImage})` }}
      />
      </div>
            <h2 className="user-name">{profile.full_name}</h2>
            <p className="user-bio">{profile.student_type}</p>
            <ul className="user-details">
              <li>Email: {profile.email}</li>
              <li>Year: {profile.year}</li>
            </ul>
            <div className="user-buttons">
              <Link to={"/dc"}>
              <button className="button" onClick={() => console.log('/dc')}>
                Edit Graduation Checklist
              </button>
              </Link>
              <div className="button-spacing"></div>
              <button className="button" onClick={() => console.log('Button 2 clicked')}>
                Video Preferences
              </button>
              <div className="button-spacing"></div>
              <Link to="/pomodoro">
  <button className="button">
    Pomodoro Timer
  </button>
</Link>

            </div>
          </div>

          <div className="transparent-box todo-box">
            <h4>To-Do List</h4>
            <div className="todo-input">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new to-do"
              />
              <button onClick={addTodo}>Add</button>
            </div>
            <ul className="todo-list">
              {todos.map((todo) => (
                <li key={todo.id} className="todo-item">
                  {todo.todo}
                  <button onClick={() => removeTodo(todo.id)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>

        </div>
        <div className="change-bg-button-container">
        <button className="change-bg-button" onClick={handleBackgroundImageChange}>
  Change Background Image
</button>
</div>

      </div>
    ) : (
      <p>Loading...</p>
    )}
  </div>
);


}

export default Profile;
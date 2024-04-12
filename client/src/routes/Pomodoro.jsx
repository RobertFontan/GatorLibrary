import React, { useState, useEffect } from 'react';
import './Pomodoro.css'; // Import CSS file for Pomodoro styling
import img1 from '../images/img1.jpeg';
import img2 from '../images/img2.jpeg';
import img3 from '../images/img3.jpeg';
import FocusQuestion from '../components/FocusQuestion';
import supabase from '../config/supabaseClient'
import { useSession } from '../components/SessionContext'


function Pomodoro() {
  const session = useSession()
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(img1); // Default background image
  const [inputMinutes, setInputMinutes] = useState('');
  const [inputSeconds, setInputSeconds] = useState('');
  const [todos, setTodos] = useState([]); 

  const [submittedFocus, setSubmittedFocus] = useState(''); // State to store submitted focus

  // Function to handle submission of focus from the FocusQuestion component
  const handleFocusSubmit = (focus) => {
    setSubmittedFocus(focus);
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
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

  const handleCustomTimeSubmit = (event) => {
    event.preventDefault();
    const totalSeconds = parseInt(inputMinutes) * 60 + parseInt(inputSeconds);
    if (!isNaN(totalSeconds) && totalSeconds > 0) {
      setMinutes(Math.floor(totalSeconds / 60));
      setSeconds(totalSeconds % 60);
    }
    setInputMinutes('');
    setInputSeconds('');
  };

   // Function to fetch todos from Supabase
   const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', session.user.id);
      if (error) throw error;
      setTodos(data);
      console.log('Complete');
    } catch (error) {
      console.error('Error fetching todos:', error.message);
    }
  };

  useEffect(() => {
    // Fetch todos when component mounts
    fetchTodos();
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            setIsRunning(false);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds]);

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', minHeight: '100vh' }}>
    <div className="pomodoro-container"> {/* Container for the entire Pomodoro component */}
        <div className="timer-box">
          <h4>Pomodoro Timer</h4>
          <div className="timer">
            <p>{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</p>
          </div>
          <div className="timer-buttons">
            {!isRunning ? (
              <button className="start-button" onClick={startTimer}>Start</button>
            ) : (
              <button className="stop-button" onClick={stopTimer}>Stop</button>
            )}
          </div>
        </div>
        <div className="change-bg-button-container">
          <button className="change-bg-button" onClick={handleBackgroundImageChange}>
            Change Background Image
          </button>
        </div>
        <form className="custom-time-form" onSubmit={handleCustomTimeSubmit}>
          <input 
            type="number" 
            placeholder="Minutes" 
            value={inputMinutes} 
            onChange={(e) => setInputMinutes(e.target.value)} 
          />
          <input 
            type="number" 
            placeholder="Seconds" 
            value={inputSeconds} 
            onChange={(e) => setInputSeconds(e.target.value)} 
          />
          <button type="submit">Set Custom Time</button>
        </form>
      </div>
      <div className="todos-container">
            {/* Focus question component */}
            <FocusQuestion onSubmit={handleFocusSubmit} />
        {/* Your other components... */}
     
      {/* Display submitted focus */}
      {submittedFocus && (
        <div className="submitted-focus">
          <p>Your focus for today: {submittedFocus}</p>
       
        </div>
      )}

<br /> 

          <h4>Todos</h4>
          <ul>
            {todos.map(todo => (
              <li key={todo.id}>{todo.todo}</li>
            ))}
          </ul>
        </div>
    </div>
  );
}

export default Pomodoro;

import React, { useState } from 'react';

function FocusQuestion({ onSubmit }) {
  const [focus, setFocus] = useState('');

  const handleChange = (event) => {
    setFocus(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(focus); // Call the onSubmit function passed from Pomodoro component
    setFocus('');
  };

  return (
    <div>
      <h3>What is your main focus for today?</h3>
      <form onSubmit={handleSubmit}>
      <input 
  type="text" 
  value={focus} 
  onChange={handleChange} 
  placeholder="Enter your focus here" 
  required 
  style={{ marginRight: '10px' }} // Add margin to the input element
/>

        <button 
          type="submit" 
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            backgroundColor: '#2196f3',
            color: 'white'
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default FocusQuestion;

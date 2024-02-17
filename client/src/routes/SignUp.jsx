// SignUp.js
import React, { useState } from 'react';
import supabase from '../config/supabaseClient';
import { Button } from 'react-bootstrap';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const [studentType, setStudentType] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [major, setMajor] = useState('');
  const [linkedin, setLinkedin] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log('SIGN UP IS CALLED')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          student_type: studentType,
          year: gradYear,
          major: major,
          linkedin: linkedin,
          // tables: 
          // insert relevant information here

        }
      }
    });

    if (error) {
      console.error('error called', error)
      return;
    }
    if (data) {
      console.log('SIGN UP IS SUCCESSFUL USER IS CALLED', data)
      const { data, error } = await supabase
        .from('profiles')
        .insert([{ id: user.id, full_name: fullName, student_type: studentType, year: gradYear, major: major, linkedin: linkedin}])

      if (error) {
        console.error(error);
        return;
      }
      console.log('data', data)
    }

  }

  return (
    <div>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Student Type"
          value={studentType}
          onChange={(e) => setStudentType(e.target.value)}
        />
        <input
          type="text"
          placeholder="Graduation Year"
          value={gradYear}
          onChange={(e) => setGradYear(e.target.value)}
        />
        <input
          type="text"
          placeholder="Major"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Linkedin"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />


        <Button type="submit" >Sign Up</Button>
      </form>
      {/* {error && <p>{error}</p>} */}
    </div>
  );
};

export default SignUp;

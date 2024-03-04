// SignUp.js
import React, { useState } from 'react';
import supabase from '../config/supabaseClient';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


const generateYears = (startYear) => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = startYear; year <= currentYear + 5; year++) {
      years.push(year);
    }
    return years;
  };

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [graduationYear, setGraduationYear] = useState('');
    const [major, setMajor] = useState('');
    const [linkedInUrl, setLinkedInUrl] = useState('');

    const years = generateYears(2020);
    const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log('SIGN UP IS CALLED', email, password, firstName, lastName, graduationYear, major, linkedInUrl)

    const { user, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // this is where user information is put in user auth table NOT profiles table
        data: {
          full_name: {fullName: firstName + ' ' + lastName},
          //student_type: studentType,
          year: graduationYear,
          major: major,
          linkedin: linkedInUrl
        }
      }
    });

    if (error) {
      console.error('error called', error)
      return;
    }

    // if user is signed up, insert user into profiles table for management
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{ id: user.id, full_name: {fullName: firstName + ' ' + lastName}, year: graduationYear, major: major, linkedin: linkedInUrl}])


      if(data)  {
        navigate('/home')
      }

      if (error) {
        console.error(error);
        return;
      }


      console.log('data', data)
    }

  }

    return (
        <div className='LoginContainerStyling'>
            <h1 className='LoginTitleStyling'> Gator Library</h1>
            <form onSubmit={handleSignUp}>
            <h2 style={{ fontSize: '1.3rem', textAlign: 'left', width: '100%', fontWeight:'bold' }}> Create Account</h2>
                <div className='inputGroup'>
                    <input 
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        style={{marginRight:'10px', borderRadius:'10px', border: '1px solid #cccccc', fontFamily: 'Sarabun'}}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        style={{marginLeft: '10px', borderRadius:'10px', border:'1px solid #cccccc', fontFamily: 'Sarabun'}}
                    />
                </div>   
                <div className='inputGroup'>
                    <select value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                        style={{marginRight:'10px', borderRadius:'10px', border: '1px solid #cccccc', fontFamily: 'Sarabun', width: '100%'}}>
                        <option value="">Select Graduation Year</option>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                </select>

                    <select 
                        value={major} 
                        onChange={(e) => setMajor(e.target.value)}
                        style={{marginLeft: '10px',marginRight: '10px', borderRadius:'10px', border:'1px solid #cccccc', fontFamily: 'Sarabun', width: '100%'}}>
                        <option value="">Select Major</option>
                        <option value="Computer Science CSE">Computer Science CSE</option>
                        <option value="Computer Science CLAS">Computer Science CLAS</option>
                    </select>

                    <input
                        type="text"
                        placeholder="LinkedIn Profile URL"
                        value={linkedInUrl}
                        onChange={(e) => setLinkedInUrl(e.target.value)}
                        style={{borderRadius:'10px', border:'1px solid #cccccc', fontFamily: 'Sarabun', width: '100%'}}
                    />
                </div>
                <input
                    className='inputFullWidth'
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className='inputFullWidth'
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                
                <button className='SignUpButton' type="submit" disabled={loading}>Create Account</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default SignUp;

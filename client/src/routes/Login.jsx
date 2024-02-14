import { React, useEffect, useState } from 'react'
import supabase from '../config/supabaseClient';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log('SIGN UP IS CALLED')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
          // tables: 
          // insert relevant information here

        }
      }
    });

    if (error) {
      console.log('error called', error)
      return;
    }
    if (data) {
      console.log('SIGN UP IS SUCCESSFUL USER IS CALLED', user)
      const { data, error } = await supabase
        .from('profiles')
        .insert([{ id: user.id, full_name: fullName }])

      if (error) {
        console.log(error);
        return;
      }
      console.log('data', data)
    }

  }


  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })


    if (error) {
      console.log('error called', error)
      return;
    }
    
    if (data){
      console.log('login successfull redirect to home', data)
      navigate('/home')

    }


  }

  const [isSignup, setIsSignup] = useState(false)

  const renderSignup = () => {
    return (
      <form style={{ margin: '20px', textAlign: 'center',  }} onSubmit={handleSignup}>
        <h1>Sign Up</h1>
        <div>
          <label htmlFor="first-name">Full Name</label>
          <input
            type="text"
            id="full-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button  type="submit">Sign Up</Button>
      </form>
    )
  }

  const renderLogin = () => {
    return (
      <form style={{margin: '20px', textAlign: 'center'}} onSubmit={handleLogin}>
        <h1>Login</h1>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Login</Button>
      </form>
    )
  }

  // /const toggleSignup = () => {setIsSignup(!isSignup)}

  return (
    <>
      {isSignup ? renderSignup() : renderLogin()}

      <Button onClick={() => setIsSignup(!isSignup)}>{isSignup ? 'Go to Log In' : 'Go to Sign Up'}</Button>

      {/* <Button onClick={() => setIsSignup(!isSignup)}>{isSignup ? 'Go to Log In' : 'Go to Sign Up'}</Button>
      {isSignup ? renderSignup() : renderLogin()} */}
    </>
  );
}

export default Login
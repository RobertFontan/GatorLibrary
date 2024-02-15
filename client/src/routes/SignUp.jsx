// SignUp.js
import React, { useState } from 'react';
import supabase from '../config/supabaseClient';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const handleSignUp = async (e) => {
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
                <button type="submit" disabled={loading}>Sign Up</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default SignUp;

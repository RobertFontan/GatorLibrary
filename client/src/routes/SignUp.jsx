// SignUp.js
import React, { useState } from 'react';
import supabase from '../config/supabaseClient';


const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { user, error: signUpError } = await supabase.auth.signUp({ email, password });
        
        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
        } else {
            // rename 'profiles' to whatever the supabase table is called
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    { id: user.id, first_name: firstName, last_name: lastName },
                ]);
            
            if (profileError) {
                setError(profileError.message);
            } else {
                setError('');
                // Redirect or show success message
            }
            setLoading(false);
        }
    };

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

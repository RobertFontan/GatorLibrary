import { React, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

import { Auth } from '@supabase/auth-ui-react'
import supabase from '../config/supabaseClient';
import { ThemeSupa } from '@supabase/auth-ui-shared'

import { useSession } from '../components/SessionContext'

function Login() {
  const navigate = useNavigate(); 
  const session = useSession()

  useEffect(() => {
    if (session) {
      navigate('/home')
    }
  }, [session])


  if (!session) {
    return (
      <div className='LoginContainerStyling'>
        <h1 className='LoginTitleStyling'> Gator Library</h1>
        <Auth
          supabaseClient={supabase}
          showLinks={false}
          appearance={{
            style: {
              input:{
                width: '500px', marginTop: '0px', fontFamily: 'Sarabun', border:'3px solid black', background: 'white', fontFamily:'Sarabun'
              },
              button: {
                backgroundColor: 'black', color: 'white', borderRadius: '20px',
                maxWidth: '250px', padding: '10px 20px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '20px auto'
              },

            },
          }}
          localization={{
            variables: {
              sign_in: {
                button_label: 'Log In',
                email_label: ' ',
                email_input_placeholder: 'Username',
                password_label: ' ',
                password_input_placeholder: 'Password'

              }
            }
          }}
          providers={[]}
        />
        <div style={{ marginTop: "0px", textDecoration: 'underline' }}>
          <Link to="/signup">Don't have an account? Sign up</Link>
        </div>
      </div>

    )
  }
  else {
    return (<div>Error...</div>)
  }
}

export default Login
import { React, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Auth } from '@supabase/auth-ui-react'
import supabase from '../config/supabaseClient';
import { ThemeSupa } from '@supabase/auth-ui-shared'

function Login() {

  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])


  if (!session) {
    return (
      <div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            style: {
              container: {margin: '20px'},
            },
          }}
          providers={['google', 'twitter']}
        />
      </div>
      
      )
  }
  else {
    return (<div>Logged in!</div>)
  }

  // return (
  //   <div>
  //     <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className='login-form'>
  //       <h3>SwampStream</h3>
  //       <input type="text" placeholder='Username' />
  //       <input type="text" placeholder='Password' />


  //       <Link to="/home">Sign In</Link>
  //     </form>

  //   </div>
  // )
}

export default Login
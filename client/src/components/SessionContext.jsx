import React, { useContext, createContext, useState, useEffect } from 'react';
import supabase from '../config/supabaseClient'

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            console.log('session', session)

        })

        const { data: { subscription }, } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
        return () => subscription.unsubscribe()


    }, []);

    return (
        <SessionContext.Provider value={session}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);

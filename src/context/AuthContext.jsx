import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(undefined); // undefined = loading

  const getLocalSession = () => {
    try {
      const saved = localStorage.getItem('admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const local = getLocalSession();
    
    // Get initial session once
    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session || local);
      }).catch(() => {
        setSession(local);
      });
    } catch {
      setSession(local);
    }

    // Listen for auth changes
    let subscription;
    try {
      const res = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session || getLocalSession());
      });
      subscription = res?.data?.subscription;
    } catch (e) {}

    return () => {
      if (subscription) {
        try { subscription.unsubscribe(); } catch (e) {}
      }
    };
  }, []);

  const loginLocal = (userObj) => {
    const newSession = { user: userObj || { email: 'admin@assalamclinic.uz' } };
    localStorage.setItem('admin_session', JSON.stringify(newSession));
    setSession(newSession);
  };

  const logoutLocal = () => {
    localStorage.removeItem('admin_session');
    try { supabase.auth.signOut(); } catch (e) {}
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, loading: session === undefined, loginLocal, logoutLocal }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

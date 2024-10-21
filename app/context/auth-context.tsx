'use client';
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
  
        
        const isTokenExpired = () => {
          try {
            const decodedToken = JSON.parse(atob(token.split('.')[1])); 
            return decodedToken.exp * 1000 < Date.now(); 
          } catch (error) {
            console.error('Failed to parse token:', error);
            return true; 
          }
        };
  
        if (isTokenExpired()) {
          localStorage.removeItem('token'); 
          window.location.href = '/auth/log-in'; 
          return;
        }
  
        
        const pollUserData = async () => {
          try {
            const res = await fetch('/api/user', {
              headers: { Authorization: `Bearer ${token}` },
            });
  
            if (res.ok) {
              const data = await res.json();
              setUser(data.user);
            } else if (res.status === 401 ||res.status === 404|| res.status === 500) {
              
              localStorage.removeItem('token');
              window.location.href = '/auth/log-in';
              return;
            } else {
              console.warn('Unexpected response status:', res.status);
            }
          } catch (err) {
            console.error('Failed to fetch user', err);
          } finally {
            
            setTimeout(pollUserData, 2000);
          }
        };
  
        
        pollUserData();
      } catch (error) {
        console.error('Error during fetching user:', error);
        window.location.href = '/auth/log-in';
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  
    return () => {
      setUser(null);
      setLoading(true);
    };
  }, []);

  const providerValue = useMemo(() => ({
    user,
    loading,
  }), [user, loading]);

  return (
    <UserContext.Provider value={providerValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

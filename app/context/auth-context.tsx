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

        // Long polling
        const pollUserData = async () => {
          try {
            const res = await fetch('/api/user', {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
              const data = await res.json();
              setUser(data.user);
            } else {
              // If unauthorized, redirect to login
              window.location.href = '/auth/log-in';
            }
          } catch (err) {
            console.error('Failed to fetch user', err);
            window.location.href = '/auth/log-in';
          } finally {
            // Continue polling after a delay
            setTimeout(pollUserData, 1000); // Poll every 5 seconds
          }
        };

        // Start polling
        pollUserData();
      } catch (error) {
        console.error('Error during fetching user:', error);
        window.location.href = '/auth/log-in';
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    
    // Cleanup function to clear the timeout on unmount
    return () => {
      setUser(null); // Clear user data
      setLoading(true); // Reset loading state
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

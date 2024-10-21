'use client';
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const StatusContext = createContext<any>(null);

export const StatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [statuses, setStatuses] = useState<any>(null);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  const [selectedSenderStatuses, setSelectedSenderStatuses] = useState<any>(null);
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoadingStatuses(false);
          return;
        }
        const pollStatusesData = async () => {
            try {
              const res = await fetch('/api/view-status', {
                headers: { Authorization: `Bearer ${token}` },
              });
    
              if (res.ok) {
                const data = await res.json();
                setStatuses(data.statuses);
              } else {
             console.log('An error occured')
                return;
              }
            } catch (err) {
              console.error('Failed to fetch user', err);
            } finally {
              setTimeout(pollStatusesData, 2000);
            }
          };
          pollStatusesData();
        }
        catch (error) {
            console.error('Error during status upload', error);
          } finally {
            setLoadingStatuses(false);
          }

    };
    fetchStatuses();
  }, []);
  const handleSelectSenderStatuses = (statuses: any) => {
    setSelectedSenderStatuses(statuses);
  };
  const [currentIndex, setCurrentIndex] = useState(0); 
  const providerValue = useMemo(() => ({
    statuses,
    loadingStatuses,
    selectedSenderStatuses, 
    handleSelectSenderStatuses,
    setSelectedSenderStatuses,
    currentIndex, setCurrentIndex
  }), [statuses, loadingStatuses,selectedSenderStatuses,
    handleSelectSenderStatuses,setSelectedSenderStatuses,currentIndex, setCurrentIndex]);

  return (
    <StatusContext.Provider value={providerValue}>
      {children}
    </StatusContext.Provider>
  );
};

export const useStatuses = () => useContext(StatusContext);

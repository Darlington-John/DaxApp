"use client"
import { useEffect, useRef, useState } from 'react';
import { useStatuses } from '~/app/context/status-context';

// Custom hook for managing popups
export  const usePopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const {setSelectedSenderStatuses, setCurrentIndex} =useStatuses()
  const ref = useRef<HTMLDivElement>(null);

  const togglePopup = () => {
    if (!isActive) {
      setIsActive(true);
      setIsVisible(true);
    } else {
      setIsVisible(false);
      setTimeout(() => setIsActive(false), 500);
      setSelectedSenderStatuses(null);
      setCurrentIndex(0)
    }
  };

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsVisible(false);
      setTimeout(() => setIsActive(false), 500);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return { isVisible, isActive, ref, togglePopup, setIsVisible , setIsActive};
};

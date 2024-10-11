import { useEffect, useState, useRef } from 'react';

export const useScrollToBottom = (threshold: number = 100) => {
  const scrollRef = useRef<HTMLDivElement>(null); // Reference to scrollable div
  const [show, setShow] = useState(false); // State to control button visibility

  // Scroll to the bottom of the div
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  // Handle scroll event to track position and show/hide the button
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
      const scrollHeight = scrollRef.current.scrollHeight;
      const clientHeight = scrollRef.current.clientHeight;

      console.log('scrollTop:', scrollTop);
      console.log('scrollHeight:', scrollHeight);
      console.log('clientHeight:', clientHeight);

      if (scrollHeight - scrollTop > clientHeight + threshold) {
        setShow(true); // Show button when scrolled up
      } else {
        setShow(false); // Hide button when near the bottom
      }
    }
  };

  // Attach the scroll event listener
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      console.log('Attaching scroll event listener');
      scrollElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollElement) {
        console.log('Removing scroll event listener');
        scrollElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [threshold]); // Re-run effect if threshold changes

  return { scrollRef, scrollToBottom, show };
};

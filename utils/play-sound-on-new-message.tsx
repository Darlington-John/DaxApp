import { useState, useEffect, useRef } from "react";

export const useSound = (contacts: any[], soundFile: string) => {
  const previousMessageCounts = useRef<Map<string, number>>(new Map()); 
  const [newMessage, setNewMessage] = useState(false);

  useEffect(() => {
    contacts?.forEach((contact) => {
      const currentMessageCount = contact?.messages.length;
      const previousCount = previousMessageCounts.current.get(contact?._id) ?? 0;

      
      if (currentMessageCount > previousCount) {
        setNewMessage(true); 
        const audio = new Audio(soundFile);
        audio.play();
      }

      
      previousMessageCounts.current.set(contact._id, currentMessageCount);
    });

    
    if (newMessage) {
      setNewMessage(false);
    }
  }, [contacts]); 
};

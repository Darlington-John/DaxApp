'use client'
import Image from "next/image";
import intro from './../../../public/images/intro.svg'
import me from './../../../public/images/me.svg'
import { useUser } from "~/app/context/auth-context";
import { useSelector } from "react-redux";
import ChatHeader from "./view-header";
import ChatInput from "./view-input";

import { useEffect, useState } from "react";

import emojiData from 'emoji-datasource-apple'; 
import ChatBox from "./chat-box";

const View = () => {
const {loading, user}= useUser();
    const activeContactId = useSelector((state: any) => state.contacts.activeContactId);

  
    const markMessagesAsRead = async () => {
      const activeChat = user?.contacts.find((chat: any) => activeContactId === chat._id);
      if (!activeChat) return;
    
      const senderPhone = activeChat.phone;
    
      try {
        const res = await fetch('/api/mark-read', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            receiverId: user._id, // Receiver's ID (logged-in user)
            senderPhone, // Sender's phone
          }),
        });
    
        const data = await res.json();
        if (res.ok) {
          console.log('Messages marked as read:', data);
        } else {
          console.error('Failed to mark messages as read:', data.error);
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };
    const [isDeleting, setIsDeleting] = useState(false);
    const [isMeDeleting, setIsMeDeleting] = useState(false);
    const handleDeleteMessage = async (messageId: string) => {
      const userId = user.phone;
      const activeChat = user.contacts.find(
        (contact: any) => contact._id === activeContactId
      );
      const receiverNumber = activeChat.phone;
  
      setIsDeleting(true);
  
      try {
        const res = await fetch('/api/delete-message', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            receiverNumber,
            messageId,
          }),
        });
  
        const data = await res.json();
        if (res.ok) {
          console.log('Message deleted:', data);
          // Optionally update the local UI here after deletion
        } else {
          alert('Failed to delete message: ' + data.error);
        }
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Error deleting message.');
      } finally {
        setIsDeleting(false);
      }
    };
    const handleDeleteMessageForMe = async (messageId: string) => {
      const userId = user.phone;
      const activeChat = user.contacts.find(
        (contact: any) => contact._id === activeContactId
      );
      const receiverNumber = activeChat.phone;
  
      setIsMeDeleting(true);
  
      try {
        const res = await fetch('/api/delete-message-for-me', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            receiverNumber,
            messageId,
          }),
        });
  
        const data = await res.json();
        if (res.ok) {
          console.log('Message deleted:', data);
          // Optionally update the local UI here after deletion
        } else {
          alert('Failed to delete message: ' + data.error);
        }
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Error deleting message.');
      } finally {
        setIsMeDeleting(false);
      }
    };
    useEffect(() => {
      if (activeContactId) {
        markMessagesAsRead();
      }
    }, [activeContactId]);

  
    const getEmojiImageUrl = (emojiUnicode: any) => {
      const formattedUnicode = emojiUnicode.split('-').join('-').toLowerCase();
      const emoji = emojiData.find(e => e.unified.toLowerCase() === formattedUnicode); 
    
      if (emoji) {
        return `https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji.image}`; 
      }
      return ''; 
    };
    const isEmojiOnly = (content: string) => {
      //@ts-ignore
      const emojiRegex = /^[\p{Emoji}\s]+$/u;
      return emojiRegex.test(content);
    };
    
    const transformContentToImages = (content: string) => {
      const isOnlyEmojis = isEmojiOnly(content);
      const emojiClass = isOnlyEmojis ? 'w-10 h-10' : 'w-5 h-5'; 
      const transformedContent = Array.from(content).map((char: string) => {
        const emojiImageUrl = getEmojiImageUrl(char.codePointAt(0)?.toString(16));
        if (emojiImageUrl) {
          return `<img src="${emojiImageUrl}" alt="${char}" class="${emojiClass}"/>`; 
        }
        return char === ' ' ? '&nbsp;' : char;
      }).join('');
    
      return transformedContent;
    };
    
    return (
    loading? null: ( <>     {user?.contacts.some((chat: any) => activeContactId === chat._id) ? (
        user?.contacts.map((chat: any) =>
          activeContactId === chat._id && (
            <div key={chat._id} className="w-full relative h-full bg-[#050e15] flex flex-col justify-between"   style={{
                backgroundImage: `url(/images/doodle.svg)`}}>
                  
<ChatHeader chat={chat}/>

                             <div className="flex p-4  w-full h-full flex-col  gap-1  items-start px-16 overflow-auto view">
                          
{chat?.messages?.map((data: any, index: any)=>(
<ChatBox data={data} {...data} key={index +1} transformContentToImages={transformContentToImages}
handleDeleteMessage={handleDeleteMessage }
handleDeleteMessageForMe={handleDeleteMessageForMe }
/>
))}
                             </div>
                       <ChatInput/>
            </div>
          )
        )
      ) : (
<div className="w-full h-full   py-3 bg-[#1F2937] flex items-center justify-center ">
            <div className="flex flex-col gap-4 items-center">
        <Image src={intro} alt="" className="lg:w-60"/>
        <div  className="flex gap-1  items-center">
        <Image src={me} alt="" className="w-6 lg:w-4"/>
        <h1 className="font-bold  font-[family-name:var(--font-mulish-bold)] text-blue text-3xl  lg:text-xl">
            DaxApp
        </h1>
        </div>
            </div>
                </div> 
      )}</>      )
   );
}
 
export default View;
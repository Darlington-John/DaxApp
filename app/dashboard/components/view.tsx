'use client'
import Image from "next/image";
import intro from './../../../public/images/intro.svg'
import me from './../../../public/images/me.svg'
import { useUser } from "~/app/context/auth-context";
import { useSelector } from "react-redux";
import ChatHeader from "./view-header";
import down from './../../../public/icons/down.svg'
import { useEffect,  useRef,  useState } from "react";

import ChatBox from "./chat-box";
import { transformContentToImages } from "~/utils/transfrom-emojis-to-img";
import { useScrollToBottom } from "~/utils/scroll-position";
import ChatInput from "./view-input/view-input";

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
    const handleDeleteMessageBase = async (
      messageId: string, 
      apiEndpoint: string, 
      setLoadingState: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      const userId = user.phone;
      const activeChat = user.contacts.find(
        (contact: any) => contact._id === activeContactId
      );
      const receiverNumber = activeChat.phone;
    
      setLoadingState(true);
    
      try {
        const res = await fetch(apiEndpoint, {
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
        setLoadingState(false);
      }
    };
    const handleDeleteMessage = (messageId: string) => {
      handleDeleteMessageBase(messageId, '/api/delete-message', setIsDeleting);
    };
    const handleDeleteMedia = (messageId: string) => {
      handleDeleteMessageBase(messageId, '/api/delete-media', setIsDeleting);
    };
    const handleDeleteMessageForMe = (messageId: string) => {
      handleDeleteMessageBase(messageId, '/api/delete-message-for-me', setIsMeDeleting);
    };
    const handleDownloadImage = async (imageUrl: any) => {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
  
        link.href = url;
        link.setAttribute('download', 'daxlightning.jpg'); // Custom file name or default
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
        // Release the blob URL after the download
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading the image:', error);
      }
    };
    const handleDownloadVideo = async (videoUrl: string) => {
      try {
        const response = await fetch(videoUrl);
        const blob = await response.blob(); // Get the video as a blob
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
    
        link.href = url;
        link.setAttribute('download', 'daxlightning.mp4'); // Set the video file name and extension
        document.body.appendChild(link);
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up the DOM
    
        // Release the blob URL after the download
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading the video:', error);
      }
    };
    useEffect(() => {
      let intervalId: any
  
      if (activeContactId) {
          const checkNewMessages = async () => {
              await markMessagesAsRead(); 
          };

          intervalId = setInterval(checkNewMessages, 1000);
      }
  
      return () => {
          if (intervalId) {
              clearInterval(intervalId);
          }
      };
  }, [activeContactId]);
    const chatBoxProps = {
      transformContentToImages,
      handleDeleteMessage,
      handleDeleteMessageForMe,
      isDeleting,
      isMeDeleting,
      handleDeleteMedia,
      handleDownloadImage,
      handleDownloadVideo
    };
    const { scrollRef, scrollToBottom, show } = useScrollToBottom(100);
    const activeChat = user?.contacts.find((chat: any) => chat._id === activeContactId);
    const prevMessageLength = useRef(activeChat?.messages.length);
    useEffect(() => {
      if (scrollRef.current && activeChat?.messages.length > prevMessageLength.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
      prevMessageLength.current = activeChat?.messages.length;
    }, [activeChat?.messages.length]);

    
    return (
    loading? null: ( <>     {user?.contacts.some((chat: any) => activeContactId === chat._id) ? (
        user?.contacts.map((chat: any) =>
          activeContactId === chat._id && (
            <div key={chat._id} className="w-full relative h-full bg-[#050e15] flex flex-col justify-between"   style={{
                backgroundImage: `url(/images/doodle.svg)`}}>
<ChatHeader chat={chat}/>

                             <div className="flex p-4  w-full h-full flex-col  gap-1  items-start px-16 overflow-auto view relative" ref={scrollRef}>
                          {show &&(  <button onClick={scrollToBottom} className="bg-deepBlue p-3 rounded-full self-center  fixed  bottom-32  right-10"><Image src={down} className="w-3" alt=''/></button>)}
                
{chat?.messages?.map((data: any, index: any)=>(
<ChatBox data={data}
 {...data} 
 key={index +1}
{...chatBoxProps}
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
'use client'
import Image from "next/image";
import intro from './../../../public/images/intro.svg'
import me from './../../../public/images/me.svg'
import { useUser } from "~/app/context/auth-context";
import { useSelector } from "react-redux";
import ChatHeader from "./view-header";
import down from './../../../public/icons/down.svg'
import { useEffect,  useRef,  useState } from "react";
import { transformContentToImages } from "~/utils/transfrom-emojis-to-img";
import { useScrollToBottom } from "~/utils/scroll-position";
import ChatInput from "./view-input/view-input";
import ChatBox from "./chat-box/chat-box";

const View = () => {
const {loading, user}= useUser();
    const activeContactId = useSelector((state: any) => state.contacts.activeContactId);

  
    const markMessagesAsRead = async () => {
      const activeChat = user?.contacts.find((chat: any) => activeContactId === chat._id);
      if (!activeChat) return;
    
      const senderPhone = activeChat.user.phone;
    
      try {
        const res = await fetch('/api/mark-read', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            receiverId: user._id, 
            senderPhone, 
          }),
        });
    
        const data = await res.json();
        if (!res.ok) {
          console.log('Messages not marked as read:', data);
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
      const receiverNumber = activeChat.user.phone;
    
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
        if (!res.ok) {
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
        link.setAttribute('download', 'daxlightning.jpg'); 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
        
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading the image:', error);
      }
    };
    const handleDownloadVideo = async (videoUrl: string) => {
      try {
        const response = await fetch(videoUrl);
        const blob = await response.blob(); 
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
    
        link.href = url;
        link.setAttribute('download', 'daxlightning.mp4'); 
        document.body.appendChild(link);
        link.click(); 
        document.body.removeChild(link); 
    
        
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
    }, [activeChat?.messages.length, activeContactId]);

    
    return (
    loading? null: ( <>     {user?.contacts.some((chat: any) => activeContactId === chat._id) ? (
        user?.contacts.map((chat: any) =>
          activeContactId === chat._id && (
            <div key={chat._id} className="w-full relative h-full bg-[#050e15] flex flex-col justify-between sm:overflow-hidden sm:h-screen"   style={{
                backgroundImage: `url(/images/doodle.svg)`}}>
<ChatHeader chat={chat.user} blockee={chat?.blockee}  blocker={chat?.blocker}/>

                             <div className="flex p-4  w-full h-full flex-col  gap-1  items-start px-16 overflow-auto view relative lg:px-10  lg:gap-3 sm:px-4" ref={scrollRef}>
                          {show &&(  <button onClick={scrollToBottom} className="bg-deepBlue p-3 rounded-full self-center  fixed  bottom-32  right-10"><Image src={down} className="w-3" alt=''/></button>)}
                
{chat?.messages?.map((data: any, index: any)=>(
<ChatBox data={data}
 {...data} 
 key={index +1}
{...chatBoxProps}
/>
))}
                             </div>
                <ChatInput blockee={chat?.blockee}  blocker={chat?.blocker}/>
            </div>
          )
        )
      ) : (
<div className="w-full h-full   py-3 bg-[#1F2937] flex items-center justify-center ">
            <div className="flex flex-col gap-4 items-center md:w-full">
        <Image src={intro} alt="" className="lg:w-60" priority/>
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
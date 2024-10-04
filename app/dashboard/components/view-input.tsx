'use client'
import Image from "next/image";
import { useUser } from "~/app/context/auth-context";
import { useSelector } from "react-redux";
import emoji from './../../../public/icons/smiley.svg'
import plus from './../../../public/icons/plus.svg'
import mic from './../../../public/icons/mic.svg'
import send from './../../../public/icons/send.svg'
import EmojiPicker, { EmojiClickData,EmojiStyle } from 'emoji-picker-react';
import loading from './../../../public/images/load.gif'
import { useEffect, useRef, useState } from "react";
import { usePopup } from "~/utils/togglePopups";
const ChatInput = () => {
    const {user}= useUser();
    const activeContactId = useSelector((state: any) => state.contacts.activeContactId);
    const [inputValue, setInputValue] = useState<string>('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(event.target.value);
      resizeTextarea();
    };
    const resizeTextarea = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = '40px';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };
    useEffect(() => {
      resizeTextarea();
    }, [inputValue]);
    
    const onEmojiClick = (emojiData: EmojiClickData) => {
      setInputValue((prevInput) => prevInput + emojiData.emoji); 
    };

  const [isLoading, setIsLoading] = useState(false);
    const handleSendMessage = async () => {
      if (!inputValue.trim()) return;
setIsLoading(true);
      const userId = user.phone;
      const activeChat = user?.contacts.find((chat: any) => activeContactId === chat._id);
      const receiverNumber = activeChat.phone;
    
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            receiverNumber,
            message: inputValue,
          }),
        });
    
        const data = await res.json();
        if (res.ok) {
          console.log('Message sent:', data);
          setInputValue(''); // Clear input
          setIsLoading(false);
        } else {
          alert(`An error occured`);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputValue.trim()) {
        e.preventDefault(); 
        handleSendMessage(); 
      }
    };
    const { isVisible: isEmojisVisible, isActive: emojis,  ref: emojisRef, togglePopup: toggleEmojisPopup} = usePopup();
    return (  <div className="flex flex-col w-full ">
        {emojis && <div className={`  pop h-[350px] relative z-10  ${isEmojisVisible ? '' :  ' pop-hidden'}`} ref={emojisRef}> <EmojiPicker onEmojiClick={onEmojiClick}  
        // @ts-ignore
        theme="dark" style={{width: '100%', height: '100%'}} EmojiStyle="apple" className=" view"/></div>}
        <div  className="w-full p-4 bg-deepBlue flex gap-4 items-center  relative z-20">
         <Image src={emoji} alt="" className="w-7 cursor-pointer" onClick={toggleEmojisPopup}/>
         <Image src={plus} alt="" className="w-7 cursor-pointer"/>

         <textarea
type="text"
placeholder="Type a message"
className='text-sm font-semibold  outline-none px-2 py-2 rounded-md rounded-md  w-full  bg-[#27516B]  focus:ring-2  ring-blue text-white resize-none  '
value={inputValue}
onChange={handleChange}
ref={textareaRef}
style={{ overflow: 'hidden', height: '40px',  }}
//@ts-ignore
onKeyDown={handleKeyDown}
autoFocus/>
{isLoading ? <Image src={loading} alt="" className="w-7   cursor-pointer"/>: <>{inputValue ===''?<Image src={mic} alt="" className="w-7   cursor-pointer"/> : <Image src={send} alt="" className="w-7  cursor-pointer" onClick={handleSendMessage}/>}</> }



         </div>
        </div>);
}
 
export default ChatInput;
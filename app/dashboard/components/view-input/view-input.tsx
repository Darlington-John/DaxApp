'use client'
import Image from "next/image";
import { useUser } from "~/app/context/auth-context";
import { useSelector } from "react-redux";
import emoji from '~/public/icons/smiley.svg'
import plus from '~/public/icons/plus.svg'
import mic from '~/public/icons/mic.svg'
import send from '~/public/icons/send.svg'
import img from '~/public/icons/img.svg'
import  { EmojiClickData } from 'emoji-picker-react';
import loading from '~/public/images/load.gif'
import { useEffect, useRef, useState } from "react";
import { usePopup } from "~/utils/togglePopups";
import { useDashboard } from "~/app/context/dashboard-context";

import Emojis from "./emoji-picker";
import UploadMedia from "./upload-media";
import ReplyMessages from "./reply-message";
import AudioRecorder from "./record-audio";
const ChatInput = ({blockee,  blocker}: any) => {
    const {user}= useUser();
    const{replyMessage, setReplyMessage, image, setImage, video, setVideo, isRecording,isPaused,audioUrl,startRecording,stopRecording,pauseRecording,resumeRecording,formatDuration,recordingDuration,     hideRecording,audioData, setAudioData,recordVisible, setRecordVisible, audio, setAudio}  =useDashboard();
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
  const activeChat = user?.contacts.find((chat: any) => activeContactId === chat._id);
    const handleSendMessage = async () => {
      if (!inputValue.trim()) return;
setIsLoading(true);

      const userId = user.phone;
 const receiverNumber = activeChat.user.phone;
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
            reply: replyMessage || image || video || audio,
          }),
        });
    
        const data = await res.json();
        if (res.ok) {
          setInputValue(''); 
          setReplyMessage('');
setImage('');
setVideo('');
setAudio('');
          setIsLoading(false);
        } else {
          setIsLoading(false);
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
    const { isVisible: isAttach, isActive: attach,  ref: attachRef, togglePopup: toggleAttachPopup} = usePopup();
    const { isVisible: isUpload, isActive: upload,  ref: uploadRef, togglePopup: toggleUploadPopup} = usePopup();
    const [file, setFile] = useState<File | null>(null);
const [uploading, setUploading] = useState(false);
const [uploadingRec, setUploadingRec] = useState(false);
const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null); 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
const fileType = selectedFile.type;
      setMediaType(fileType);
 const reader = new FileReader();
      reader.onloadend = () => {
        setMediaUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
const isImage = (type: string) => type.startsWith("image/");
  const isVideo = (type: string) => type.startsWith("video/");
const handleSendMedia = async () => {
  if (!file) return;
  setUploading(true);
setReplyMessage('');
setImage('');
  const userId = user.phone;
  const receiverNumber = activeChat.user.phone;
  const formData = new FormData();
  formData.append('file', file);

  formData.append('userId', userId);
  formData.append('receiverNumber', receiverNumber);
  formData.append('message', inputValue);
  formData.append('reply', replyMessage);
  try {
    const res = await fetch('/api/send-media', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setInputValue(''); 
      setIsLoading(false);
      setUploading(false);
      setMediaUrl(data.url);
      toggleUploadPopup();
    } else {
      (`An error occured`);
      setUploading(false);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
const handleSendAudio = async () => {
  stopRecording();
  if (!audioData) return;
setUploadingRec(true);
  const userId = user.phone;
  const receiverNumber = activeChat.user.phone;
  const formData = new FormData();

  formData.append('userId', userId);
  formData.append('receiverNumber', receiverNumber);
  formData.append('message', inputValue);
  formData.append('reply', replyMessage);
  formData.append('audio', audioData); 
  try {
    const res = await fetch('/api/send-audio', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setUploadingRec(false);
      stopRecording();
      setRecordVisible(false)
    } else {
      setUploadingRec(false);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
const fileInputRef = useRef<HTMLInputElement | null>(null);
const handleClick = () => {
  if (fileInputRef.current) {
    fileInputRef.current.click();
  }
  toggleUploadPopup();
};
useEffect(() => {
  if (file || upload) {
    toggleAttachPopup();
  }
}, [file]);

const emojisProps = {
    emojis ,isEmojisVisible, emojisRef,onEmojiClick
  };
  const mediaProps={upload,isUpload, uploadRef,  toggleUploadPopup,mediaUrl, mediaType,isImage ,isVideo,activeChat,uploading, handleSendMedia,file};
  const recordProps ={
    isRecording,isPaused,audioUrl,stopRecording,pauseRecording,resumeRecording,formatDuration,recordingDuration,hideRecording,audioData, setAudioData,handleSendMedia, handleSendAudio, uploadingRec
  };
  const replyProps={replyMessage, setReplyMessage,image, setImage,video,setVideo,audio, setAudio};
    return (  
    blockee || blocker?(<div className="w-full p-4  text-center text-dimWhite  bg-darkBlue  text-sm ">Can't send message to a blocked contact </div>) :( <div className="flex flex-col w-full  ">
      <Emojis {...emojisProps}/>
  <UploadMedia {...mediaProps}/>
   <ReplyMessages  {...replyProps}/>
                  <input type="file" onChange={handleFileChange}    ref={fileInputRef} className='hidden'  accept="image/*,video/*"/>
                  
 {recordVisible?<AudioRecorder {...recordProps}/>: (<div  className={`w-full p-4 bg-deepBlue flex gap-4 items-center  relative z-20 lg:p-2 lg:gap-2  ${upload && 'hidden'}`}>
          <Image src={emoji} alt="" className="w-7 cursor-pointer lg:w-5 " onClick={toggleEmojisPopup}/>
          <div className="shrink-0 relative">
 
          <Image src={plus} alt="" className="w-7 cursor-pointer lg:w-6" onClick={toggleAttachPopup}/>
          {attach && (
           <div className={`flex flex-col bg-deepBlue   absolute  w-[220px] rounded-md overflow-hidden z-[200] duration-300 ease  p-2 -top-[80px] lg:-top-[60px] lg:w-[150px]  lg:p-1  ${isAttach ? 'opacity-100' :  ' opacity-0'}   `} ref={attachRef}>
 <button className="flex gap-3 items-center  p-2  hover:bg-dimBlue   duration-150  rounded-md" onClick={handleClick}>
   <Image src={img} className="w-4" alt=""/>
   <h1 className="text-sm text-white  lg:text-xs">Photos & Videos</h1>
 </button>
           </div>
          )}
          </div>
 <textarea
 type="text"
 placeholder="Type a message"
 className='text-sm font-semibold  outline-none px-2 py-2 rounded-md rounded-md  w-full  bg-[#27516B]  focus:ring-2  ring-blue text-white resize-none  max-h-[200px] sm:max-h-[80px]  sm:min-h-[40px]  '
 value={inputValue}
 onChange={handleChange}
 ref={textareaRef}
 style={{ overflow: 'hidden', height: '40px' }}
 //@ts-ignore
 onKeyDown={handleKeyDown}
 autoFocus/>
 {isLoading ? <Image src={loading} alt="" className="w-7 lg:w-5   cursor-pointer"/>: <>{inputValue ===''?<Image src={mic} alt="" className="w-7 lg:w-5   cursor-pointer" onClick={startRecording}/> : <Image src={send}priority  alt="" className="w-7 lg:w-5  cursor-pointer" onClick={handleSendMessage}/>}</> }
 
  </div>)}
                     
      
         </div>)
   );
}
 
export default ChatInput;
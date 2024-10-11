'use client';
import React, { createContext, useContext, useState,  useMemo, useRef} from 'react';

const DashboardContext = createContext<any>(null);

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
    const [replyMessage, setReplyMessage] = useState(''); 
    const [image, setImage] = useState(''); 
    const [video, setVideo] = useState(''); 
    const [audio, setAudio] = useState(''); 
    const handleReplyClick = (messageContent: string, imgSrc: string,videoSrc: string, audioSrc: string) => {
      setReplyMessage(messageContent); 
      setImage(imgSrc);
      setVideo(videoSrc)
      setAudio(audioSrc)
    };
    const [recordVisible, setRecordVisible]= useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [recordingDuration, setRecordingDuration] = useState(0); 
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]); 
    const durationInterval = useRef<NodeJS.Timer | null>(null); 
    const [audioData, setAudioData] = useState<Blob | null>(null);
    
    const formatDuration = (seconds: number) => {
      const min = Math.floor(seconds / 60);
      const sec = seconds % 60;
      return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };
  
    
    const startRecording = async () => {
      setRecordVisible(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
  
        
        audioChunks.current = [];
        setAudioUrl(null);
        setRecordingDuration(0);
  
        
        durationInterval.current = setInterval(() => {
          setRecordingDuration((prev) => prev + 1);
        }, 1000);
  
        
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };
  
        
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, { type: "audio/mp3" });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioData(audioBlob);
          setAudioUrl(audioUrl); 
  
          
          if (durationInterval.current) {
            //@ts-ignore
            clearInterval(durationInterval.current);
          }
        };
  
        mediaRecorder.start();
        setIsRecording(true);
        setIsPaused(false);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };
  
    
    const stopRecording = () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        
        setIsPaused(false);
  setIsRecording(false);
        
        if (durationInterval.current) {
          //@ts-ignore
          clearInterval(durationInterval.current);
        }
      }
    };
  
    
    const pauseRecording = () => {
      if (mediaRecorderRef.current && isRecording && !isPaused) {
        mediaRecorderRef.current.pause(); 
        setIsPaused(true);
  
        
        if (durationInterval.current) {
          //@ts-ignore
          clearInterval(durationInterval.current);
        }
      }
    };
  
    
    const resumeRecording = () => {
      if (mediaRecorderRef.current && isPaused) {
        mediaRecorderRef.current.resume(); 
        setIsPaused(false);
  
        
        durationInterval.current = setInterval(() => {
          setRecordingDuration((prev) => prev + 1);
        }, 1000);
      }
    };
  const hideRecording=()=>{
    setRecordVisible(false);
    setIsRecording(false);
setAudioUrl(null)
  }
  const providerValue = useMemo(() => ({
    replyMessage, setReplyMessage, handleReplyClick, image, setImage,video, setVideo, isRecording,isPaused,audioUrl,startRecording,stopRecording,pauseRecording,resumeRecording,formatDuration,setRecordVisible,recordingDuration,
    recordVisible,hideRecording, setAudioUrl,audioData, setAudioData,audio, setAudio
  }), [replyMessage, setReplyMessage, image, setImage, video, setVideo, handleReplyClick,isRecording,isPaused,audioUrl,startRecording,stopRecording,pauseRecording,resumeRecording ,formatDuration,    recordVisible,hideRecording, setAudioUrl,setRecordVisible,audioData, setAudioData,audio, setAudio]);

  return (
    <DashboardContext.Provider value={providerValue}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);

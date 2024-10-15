import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import sendWhite from '~/public/icons/sendWhite.svg'
import bin from '~/public/icons/bin.svg'
import pause from '~/public/icons/pause-rec.svg'
import record from '~/public/icons/record.svg'
import recordGif from '~/public/images/record.gif'
import recordStop from '~/public/images/recordStop.png'
import stop from '~/public/icons/stop.svg'
import play from '~/public/icons/play.svg'
import loading from '~/public/images/load.gif'
import speaker from '~/public/icons/speaker.svg'
import pauseAudio  from '~/public/icons/pause.svg'
import { useSelector } from "react-redux";
import micShadow from '~/public/icons/micShadow.svg'
const AudioRecorder = (props:any) => {
const {isRecording,isPaused,audioUrl,stopRecording,pauseRecording,resumeRecording,formatDuration,recordingDuration,hideRecording,handleSendAudio,uploadingRec}=props;
const activeContactId = useSelector((state: any) => state.contacts.activeContactId);
useEffect(() => {

  if (activeContactId) {

    stopRecording()
  }
}, [activeContactId]);
  return (  
    <div  className={`w-full p-4 bg-deepBlue flex gap-4 items-center justify-center  relative z-20 `}>
      
    <div className="flex gap-3">
      <div className="flex items-center gap-3">
    <Image src={bin} alt='' className='w-4 cursor-pointer' onClick={hideRecording}/>
    <h3 className="text-lg text-silver sm:text-sm">{formatDuration(recordingDuration)}s</h3>
    </div>
    {isRecording && (
      <div className='flex items-center gap-[1px] opacity-80'>
      <Image src={isPaused ?recordStop: recordGif } alt='' className='w-10  cursor-pointer' />
      <Image src={isPaused ?recordStop: recordGif }  alt='' className='w-10  cursor-pointer' />
      <Image src={isPaused ?recordStop: recordGif }  alt='' className='w-10  cursor-pointer' />
      </div>
    )}

{!audioUrl && isRecording &&(  <>    {!isPaused ? (
                <Image onClick={pauseRecording} src={pause} alt=''  className='w-6 cursor-pointer' />
              ) : (
                <Image onClick={resumeRecording} src={record} alt=''  className='w-6 cursor-pointer' />
              )}</>)}

        {!audioUrl && isRecording &&(  <Image onClick={stopRecording} src={stop} alt=''  className='w-6 cursor-pointer' />)}
 
      {audioUrl && !isRecording && (
        <div>

      <CustomAudioPlayer audioUrl={audioUrl}/>
        </div>
      )}

      <button className={`h-10 w-10   rounded-full bg-blue  flex shrink-0 items-center justify-center self-center ${uploadingRec? 'bg-darkBlue': 'bg-blue'}`} onClick={handleSendAudio}>
   {uploadingRec ? <Image src={loading} alt="" className="w-6   cursor-pointer"/>:<Image src={sendWhite} alt="" className="w-6  cursor-pointer" /> }
     </button>
    </div>
    
     </div>
  );
}
 
export default AudioRecorder;

export const CustomAudioPlayer = (props: any) => {
const {audioUrl}=props;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); 
 
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const imageArray = [1, 2, 3];
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value) / 100; 
    if (audioRef.current) {
      audioRef.current.volume = value;
      setVolume(value);
    }
  };
  useEffect(() => {
    const audioElement = audioRef.current;

    const handleEnded = () => {
      setIsPlaying(false); 
    };

    
    if (audioElement) {
      audioElement.addEventListener("ended", handleEnded);
    }

    
    return () => {
      if (audioElement) {
        audioElement.removeEventListener("ended", handleEnded);
      }
    };
  }, []);
  return (
    <div >
      <audio ref={audioRef} src={audioUrl} preload="auto" >
      <track default kind="captions" />
</audio>
      <div className={`flex items-center   ${props.chat? 'gap-2':'gap-4'}`}>
        <div className={`flex items-center gap-3  rounded-full  ${props.chat? ' px-2 py-1 ':'bg-[#d1d7db42]  px-3 py-2'}`}>
        {props.speaker &&(
          <div className="h-[50px] w-[50px]    relative">
<img src={props?.profile ? props.profile: '/icons/default-user.svg' } className="w-full h-full object-cover rounded-full" alt=''/>
<Image src={micShadow} alt='' className="absolute bottom-0 right-0  w-4.5 "/>
          </div>
          )}
        <Image src={isPlaying?pauseAudio: play} alt='' className={` cursor-pointer ${props.chat? 'w-3':'w-4 sm:w-3'}`} onClick={handlePlayPause} />
        <div className='flex items-center gap-[1px] opacity-80'>
          {imageArray.map((_,index)=>(
            <Image src={isPlaying ?recordGif: recordStop } alt='' className={`cursor-pointer  ${props.chat? 'w-8':'w-10 sm:w-5'}`}  key={index +1}/>
          ))}
      </div>
      </div>
      {!props.chat &&(<div className="flex  items-center gap-2 sm:hidden">
      <Image src={speaker} alt='' className='w-5 cursor-pointer' onClick={handlePlayPause} />
        <input
          type="range"
          value={volume * 100} 
          onChange={handleVolumeChange}
          max="100"
          className="win10-thumb"
        />
        </div>)}
      
      </div>
    </div>
  );
};
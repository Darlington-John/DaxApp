import { medium } from "~/utils/font-types";
import sent from './../../../public/icons/tail-out.svg'
import recieved from './../../../public/icons/tail-in.svg'
import sentGrey from './../../../public/icons/sent-grey.svg'
import sentBlue from './../../../public/icons/sent-blue.svg'
import { formatTime } from "~/utils/format-date";
import { usePopup } from "~/utils/togglePopups";
import Image from "next/image";
import { useUser } from "~/app/context/auth-context";
import down from '~/public/icons/down.svg'
import photo from './../../../public/icons/photo.svg'
import loading from './../../../public/images/load.gif'
import { useEffect, useRef, useState } from "react";
import { useDashboard } from "~/app/context/dashboard-context";
import audioMic from '~/public/icons/micShadow.svg'
import { CustomAudioPlayer } from "./view-input/record-audio";
const ChatBox = (props: any) => {
    const { user} = useUser();
    const {transformContentToImages, handleDeleteMessage, handleDeleteMessageForMe, isDeleting, isMeDeleting, handleDeleteMedia,handleDownloadImage,handleDownloadVideo } =props;
    const {handleReplyClick} = useDashboard();
  const { isVisible: isMore, isActive: more,  ref: moreRef, togglePopup: toggleMorePopup} = usePopup();
  const action =[
    {
action: 'Reply',
onClick:  () => {
  handleReplyClick(
    props.content ?? '', 
    props.image ?? '',   
    props.video ?? '',
    props.audio??''
  );
  toggleMorePopup();
},
hidden: null,
loading: null,
    },
    {
      action: 'Download',
      onClick: () => {
        if (props.image) {
          handleDownloadImage(props.image);
          toggleMorePopup();
        } else if (props.video) {
          handleDownloadVideo(props.video);
          toggleMorePopup();
        }
      },
      hidden: !props.image && !props.video,
      loading: null,
          },
    {
        action: '  Delete for Me',
        onClick: () => handleDeleteMessageForMe(props._id),
        hidden: null,
        loading: isMeDeleting
            },
            {
                action: 'Delete for Everyone',
                onClick: () => props.image ? handleDeleteMedia(props.image?? '', props.video ?? '',props.audio ?? '') : handleDeleteMessage(props.content),
                hidden: props.sender !== user.phone,
                loading: isDeleting
                    },
  ]
  const popupRef = useRef<HTMLDivElement>(null);
  const [positionClass, setPositionClass] = useState('top-5');

  useEffect(() => {
    const handlePosition = () => {
      if (popupRef.current) {
        const rect = popupRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // If the container is positioned in the lower half of the viewport
        if (rect.top > viewportHeight / 2) {
          setPositionClass('bottom-5');
        } else {
          setPositionClass('top-5');
        }
      }
    };

    // Run the position check on component mount
    handlePosition();

    // Optionally, listen for window resize or scroll if the position may change dynamically
    window.addEventListener('resize', handlePosition);
    window.addEventListener('scroll', handlePosition);

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener('resize', handlePosition);
      window.removeEventListener('scroll', handlePosition);
    };
  }, []);
  const customClasses = { emojiClass: 'w-4  h-4', onlyEmojiClass: 'w-5  h-5 ' };
    return (  
      <div className={`flex     items-center px-2 text-sm text-dimWhite relative   pt-2.5  pb-[6px] gap-1  max-w-[60%]  flex-wrap h-auto   parent border-none  outline-none w-auto    ${medium}    ${props.sender === user.phone ?'self-end bg-[#004b64] rounded-l-md rounded-b-md': 'self-start bg-[#202C33] rounded-b-md rounded-r-md'}`} ref={popupRef} >
 <button className='   absolute right-1 top-1 bg-transparent  backdrop-blur-md p-1  rounded child '  onClick={toggleMorePopup}>
  <Image src={down} alt="" className="w-3.5"/>
      </button>
      {more && (<div className={`flex flex-col bg-deepBlue   absolute ${positionClass} w-[200px] rounded-md overflow-hidden z-[200] duration-300 ease   ${isMore ? 'opacity-100' :  ' opacity-0'}   ${props.sender !== user.phone ?'left-[102%]': 'right-[102%]'}`} ref={moreRef}>
 
{action.map((act: any, index: number)=>(
 <button className={`w-full hover:bg-dimBlue   duration-150 text-sm  px-5  py-2 ease flex items-center justify-between ${act.hidden === true && 'hidden'}`} key={index + 1} onClick={act.onClick}>
 <span>{act.action}</span>
 {act.loading ? <Image src={loading} alt="" className="w-4   cursor-pointer"/>:null }
</button>
))}

      </div>)}
      {props.replyingTo && (
        <div className={`bg-[#0000002e]  rounded-lg w-full ${props.replyingTo.startsWith('https')? '':'py-3 px-4'}`}>
{props.replyingTo.startsWith('https')? (
  <>
  {props.replyingTo.endsWith('mp4')?(
    <div className="flex items-center justify-between">
    {/* @ts-ignore */}

    <video className="object-cover w-16 h-16  rounded-lg" controls>
    <track default kind="captions" />
      <source src={props.replyingTo}/>
    </video>
    <div className="flex flex-col items-end pr-2">  <h1 className="text-xs text-lightGrey">Video</h1>
    <Image src={photo} alt='' className='w-3.5  self-end'/></div></div>):(  
    <>{props.replyingTo.endsWith('webm')? (<div className="flex items-center justify-between py-3"><CustomAudioPlayer audioUrl={props?.replyingTo} chat /><div className="flex flex-col items-end pr-2">  <h1 className="text-xs text-lightGrey">Audio</h1>
  <Image src={audioMic} alt='' className='w-3.5  self-end'/></div></div>): (<div className="flex items-center justify-between"><img   src={props.replyingTo} className="object-cover w-16 h-16  rounded-lg" alt=''/><div className="flex flex-col items-end pr-2">  <h1 className="text-xs text-lightGrey">Photo</h1>
  <Image src={photo} alt='' className='w-3.5  self-end'/></div></div>)}</>)}
  </>): (        <h1 className=" leading-[19px] text-sm text-dimWhite text-start" dangerouslySetInnerHTML={{ __html: transformContentToImages(props.replyingTo, customClasses) }} />)}

        </div>
      )}
        {props.image && (
        <div className="  max-w-[350px]  max-h-[450px]">
    <img src={props.image} alt='' className="  object-scale-down   rounded-md max-w-full   max-h-[450px]"/>
        </div>
      )}
              {props.video && (
        <div className="  max-w-[350px]  max-h-[450px]">
            <video  className="  object-scale-down   rounded-md max-w-full   max-h-[450px]" controls>
    <track default kind="captions" />
      <source src={props.video}/>
    </video>
        </div>
      )}
        {props.audio && (
        <div className="  max-w-[350px]  max-h-[450px]">
<CustomAudioPlayer audioUrl={props.audio} chat speaker={true} profile={props?.senderProfile}/>
        </div>
      )}
  <h1 className="leading-[19px] flex flex-wrap text-wrap"    dangerouslySetInnerHTML={{ __html: transformContentToImages(props.content) }} />
  <div className={[
  "flex",
  "gap-1",
  "items-center",
  "self-end",
  (props.image || props.video) ? "absolute right-4" : "",
  props.audio ? "absolute right-4 bottom-2" : "bottom-4",
].join(" ")}>
  <h1 className={`text-[11px] leading-none text-[#ffffff80]  `}>
  {formatTime(props.updatedAt)}
  </h1>
  {props.sender === user.phone && (
  <>{props.read === true?<Image src={sentBlue} alt="" className="w-4"/>:<Image src={sentGrey} alt="" className="w-4"/>}</>
  
  )}
  
  
  </div>
  
  
  {props.sender === user.phone ?(<Image src={sent} alt='' className="w-3 absolute top-0 -right-3"/>): (<Image src={recieved} alt='' className="w-3 absolute top-0  -left-3"/>)}
  
  </div>
    );
  }

  export default ChatBox;
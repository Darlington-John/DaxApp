import { medium } from "~/utils/font-types";
import down from './../../../public/icons/down.svg'
import sent from './../../../public/icons/tail-out.svg'
import recieved from './../../../public/icons/tail-in.svg'
import sentGrey from './../../../public/icons/sent-grey.svg'
import sentBlue from './../../../public/icons/sent-blue.svg'
import { formatTime } from "~/utils/format-date";
import { usePopup } from "~/utils/togglePopups";
import Image from "next/image";
import { useUser } from "~/app/context/auth-context";
const ChatBox = (props: any) => {
    const { user} = useUser();
    const {transformContentToImages, handleDeleteMessage, handleDeleteMessageForMe } =props;
  const { isVisible: isMore, isActive: more,  ref: moreRef, togglePopup: toggleMorePopup} = usePopup();
    return (  
      <div className={`flex     items-center px-2 text-sm text-dimWhite relative   pt-2.5  pb-[6px] gap-1 max-w-[60%]  flex-wrap h-auto parent   ${medium}    ${props.sender === user.phone ?'self-end bg-[#004b64] rounded-l-md rounded-b-md': 'self-start bg-[#202C33] rounded-b-md rounded-r-md'}`}>
      <button className='   absolute right-1 top-1 bg-transparent  backdrop-blur-md p-1  rounded child '  onClick={toggleMorePopup}>
  <Image src={down} alt="" className="w-3.5"/>
      </button>
      {/* {emojis && <div className={`  pop h-[350px] relative z-10  ${isEmojisVisible ? '' :  ' pop-hidden'}`} ref={emojisRef} */}
      {more && (<div className={`flex flex-col bg-deepBlue   absolute top-5 w-[200px] rounded-md overflow-hidden z-[200] duration-300 ease   ${isMore ? 'opacity-100' :  ' opacity-0'}   ${props.sender !== user.phone ?'left-[102%]': 'right-[102%]'}`} ref={moreRef}>
  <div className="w-full hover:bg-dimBlue   duration-150 text-sm  pl-5  py-2 ease">
Reply
  </div>
  <div className="w-full hover:bg-dimBlue   duration-150 text-sm  pl-5  py-2 ease">
React
  </div>
  {props.sender === user.phone ?(
    <>
      <button className="w-full hover:bg-dimBlue   duration-150 text-sm  pl-5  py-2 ease text-start" onClick={() => handleDeleteMessageForMe(props._id)}>
Delete for Me
  </button>
    <button className="w-full hover:bg-dimBlue   duration-150 text-sm  pl-5  py-2 ease text-start" onClick={() => handleDeleteMessage(props.content)}>
Delete for Everyone
  </button>

  </>): (<button className="w-full hover:bg-dimBlue   duration-150 text-sm  pl-5  py-2 ease text-start" onClick={() => handleDeleteMessageForMe(props._id)}>
Delete for Me
  </button>)}

      </div>)}
  <h1 className="leading-[19px] flex flex-wrap"   dangerouslySetInnerHTML={{ __html: transformContentToImages(props.content) }} />
  <div className="flex gap-1 items-center  self-end">
  <h1 className="text-[11px] leading-none text-[#ffffff80]  ">
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
import { medium } from "~/utils/font-types";
import sent from '~/public/icons/tail-out.svg'
import recieved from '~/public/icons/tail-in.svg'
import sentGrey from '~/public/icons/sent-grey.svg'
import sentBlue from '~/public/icons/sent-blue.svg'
import { formatTime } from "~/utils/format-date";
import { usePopup } from "~/utils/togglePopups";
import Image from "next/image";
import { useUser } from "~/app/context/auth-context";
import down from '~/public/icons/down.svg'
import { useEffect, useRef, useState } from "react";
import { useDashboard } from "~/app/context/dashboard-context";
import { CustomAudioPlayer } from "../view-input/record-audio";
import More from "./more-popup";
import ReplyTo from "./replying-to";

const ChatBox = (props: any) => {
  const { user } = useUser();
  const { transformContentToImages, handleDeleteMessage, handleDeleteMessageForMe, isDeleting, isMeDeleting, handleDeleteMedia, handleDownloadImage, handleDownloadVideo } = props;
  const { handleReplyClick } = useDashboard();
  const { isVisible: isMore, isActive: more, ref: moreRef, togglePopup: toggleMorePopup } = usePopup();

  const action = [
    {
      action: 'Reply',
      onClick: () => {
        handleReplyClick(
          props.content ?? '',
          props.image ?? '',
          props.video ?? '',
          props.audio ?? ''
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
      onClick: () => props.image ? handleDeleteMedia(props.image ?? '', props.video ?? '', props.audio ?? '') : handleDeleteMessage(props.content),
      hidden: props.sender.phone !== user.phone,
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
        if (rect.top > viewportHeight / 2) {
          setPositionClass('bottom-5');
        } else {
          setPositionClass('top-5');
        }
      }
    };
    handlePosition();
    window.addEventListener('resize', handlePosition);
    window.addEventListener('scroll', handlePosition);
    return () => {
      window.removeEventListener('resize', handlePosition);
      window.removeEventListener('scroll', handlePosition);
    };
  }, []);
  const customClasses = { emojiClass: 'w-4  h-4', onlyEmojiClass: 'w-5  h-5 ' };
  const moreProps = { more, positionClass, isMore, user, moreRef, action, props };
  const replyToProps = { props, customClasses };
  return (
    <div className={`flex     items-center px-2 text-sm text-dimWhite relative   pt-2.5  pb-[6px] gap-1  max-w-[60%]  flex-wrap h-auto   parent border-none  outline-none w-auto lg:max-w-[80%]    ${medium}    ${props.sender.phone === user.phone ? 'self-end bg-[#004b64] rounded-l-md rounded-b-md' : 'self-start bg-[#202C33] rounded-b-md rounded-r-md'}`} ref={popupRef} >
      <button className='   absolute right-1 top-1 bg-transparent  backdrop-blur-md p-1  rounded child ' onClick={toggleMorePopup}>
        <Image src={down} alt="" className="w-3.5" />
      </button>
      <More {...moreProps} />
      <ReplyTo {...replyToProps} />
      {props.image && (
        <div className="  max-w-[350px]  max-h-[450px]">
          <img src={props.image} alt='' className="  object-scale-down   rounded-md max-w-full   max-h-[450px]" />
        </div>
      )}
      {props.video && (
        <div className="  max-w-[350px]  max-h-[450px]">
          <video className="  object-scale-down   rounded-md max-w-full   max-h-[450px]" controls>
            <track default kind="captions" />
            <source src={props.video} />
          </video>
        </div>
      )}
      {props.audio && (
        <div className="  max-w-[350px]  max-h-[400px]">
          <CustomAudioPlayer audioUrl={props.audio} chat speaker={true} profile={props?.sender.profile} />
        </div>
      )}
      <h1 className="leading-[19px] flex flex-wrap text-wrap " dangerouslySetInnerHTML={{ __html: transformContentToImages(props.content) }} />
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
        {props.sender.phone === user.phone && (
          <>{props.read === true ? <Image src={sentBlue} alt="" className="w-4" /> : <Image src={sentGrey} alt="" className="w-4" />}</>
        )}
      </div>
      {props.sender.phone === user.phone ? (<Image src={sent} alt='' className="w-3 absolute top-0 -right-3" />) : (<Image src={recieved} alt='' className="w-3 absolute top-0  -left-3" />)}
    </div>

  );
}
export default ChatBox;
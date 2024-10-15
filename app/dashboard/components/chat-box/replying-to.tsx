import Image from "next/image";
import photo from '~/public/icons/photo.svg'
import { CustomAudioPlayer } from "../view-input/record-audio";
import audioMic from '~/public/icons/micShadow.svg'
import { transformContentToImages } from "~/utils/transfrom-emojis-to-img";
const ReplyTo = (items: any) => {
  const { props, customClasses } = items;
  return (
    props.replyingTo && (
      <div className={`bg-[#0000002e]  rounded-lg w-full ${props.replyingTo.startsWith('https') ? '' : 'py-3  px-4'}`}>
        {props.replyingTo.startsWith('https') ? (
          <>
            {props.replyingTo.endsWith('mp4') ? (
              <div className="flex items-center justify-between">
                {/* @ts-ignore */}

                <video className="object-cover w-16 h-16  rounded-lg" controls>
                  <track default kind="captions" />
                  <source src={props.replyingTo} />
                </video>
                <div className="flex flex-col items-end pr-2">  <h1 className="text-xs text-lightGrey">Video</h1>
                  <Image src={photo} alt='' className='w-3.5  self-end' /></div></div>) : (
              <>{props.replyingTo.endsWith('webm') ? (<div className="flex items-center justify-between py-3">
                <CustomAudioPlayer audioUrl={props?.replyingTo} chat /><div className="flex flex-col items-end pr-2">  <h1 className="text-xs text-lightGrey">Audio</h1>
                  <Image src={audioMic} alt='' className='w-3.5  self-end' /></div></div>) : (<div className="flex items-center justify-between"><img src={props.replyingTo} className="object-cover w-16 h-16  rounded-lg" alt='' /><div className="flex flex-col items-end pr-2">  <h1 className="text-xs text-lightGrey">Photo</h1>
                    <Image src={photo} alt='' className='w-3.5  self-end' /></div></div>)}</>)}
          </>) : (<h1 className=" leading-[19px] text-sm text-dimWhite text-start" dangerouslySetInnerHTML={{ __html: transformContentToImages(props.replyingTo, customClasses) }} />)}
      </div>
    )
  );
}

export default ReplyTo;
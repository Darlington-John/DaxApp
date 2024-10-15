import Image from "next/image";
import { transformContentToImages } from "~/utils/transfrom-emojis-to-img";
import x from '~/public/icons/xgrey.svg'

import photo from '~/public/icons/photo.svg'
import audioMic from '~/public/icons/micShadow.svg'
import { CustomAudioPlayer } from "./record-audio";
const ReplyMessages = (props: any) => {
  const { replyMessage, setReplyMessage, image, setImage, video, setVideo, audio, setAudio } = props;

  const customClasses = { emojiClass: 'w-4  h-4', onlyEmojiClass: 'w-5  h-5 ' };
  return (<>
    {replyMessage && (
      <div className="flex w-full items-center gap-4  bg-deepBlue  px-10 pt-2 z-20">
        <div className=" bg-darkBlue  py-3 px-4 rounded-lg w-full">
          <h1 className=" leading-[19px] text-sm text-dimWhite" dangerouslySetInnerHTML={{ __html: transformContentToImages(replyMessage, customClasses) }} />

        </div>
        <Image src={x} alt="" className="w-6 cursor-pointer" onClick={() => { setReplyMessage('') }} />
      </div>
    )}
    {image && (
      <div className="flex w-full items-center gap-4  bg-deepBlue  px-10 pt-2 z-20">
        <div className=" bg-darkBlue  pr-3  rounded-lg w-full justify-between flex items-center ">
          <img src={image} className="object-cover w-20 h-20 rounded-lg " alt='' />
          <div className="flex flex-col ">
            <h1 className="text-sm text-lightGrey">Photo</h1>
            <Image src={photo} alt='' className='w-4 self-end' />
          </div>
        </div>
        <Image src={x} alt="" className="w-6 cursor-pointer" onClick={() => { setImage('') }} />
      </div>
    )}
    {video && (
      <div className="flex w-full items-center gap-4  bg-deepBlue  px-10 pt-2 z-20">
        <div className=" bg-darkBlue  pr-3  rounded-lg w-full justify-between flex items-center ">
          <video src={video} className="object-cover w-20 h-20 rounded-lg " muted autoPlay loop />
          <div className="flex flex-col ">
            <h1 className="text-sm text-lightGrey">Video</h1>
            <Image src={photo} alt='' className='w-4 self-end' />
          </div>
        </div>
        <Image src={x} alt="" className="w-6 cursor-pointer" onClick={() => { setVideo('') }} />
      </div>
    )}
    {audio && (
      <div className="flex w-full items-center gap-4  bg-deepBlue  px-10 pt-2 z-20">
        <div className=" bg-darkBlue  pr-4   rounded-lg w-full justify-between flex items-center  py-3 relative overflow-hidden">
          <div className="bg-blue p-2 absolute -left-3  h-full  rounded-2xl">

          </div>
          <CustomAudioPlayer audioUrl={audio} chat profile={props?.senderProfile} />

          <div className="flex flex-col ">
            <h1 className="text-sm text-lightGrey">Audio</h1>
            <Image src={audioMic} alt='' className='w-4 self-end' />
          </div>
        </div>
        <Image src={x} alt="" className="w-6 cursor-pointer" onClick={() => { setAudio('') }} />
      </div>
    )}
  </>);
}

export default ReplyMessages;
import Image from "next/image";

import loading from '~/public/images/load.gif'

import sendWhite from '~/public/icons/sendWhite.svg'
import x from '~/public/icons/xgrey.svg'
const UploadMedia = (props: any) => {
    const {upload,isUpload, uploadRef,  toggleUploadPopup,mediaUrl, mediaType,isImage ,isVideo,activeChat,uploading, handleSendMedia,file}=props;
    return (  
        upload && <div className={`  pop h-[550px] relative z-10  bg-darkBlue  flex items-center justify-center rounded-2xl flex-col gap-4 sm:h-[400px]    ${isUpload ? '' :  ' pop-hidden'}`} ref={uploadRef} >
        <Image src={x} alt="" className="w-5  cursor-pointer absolute top-10 left-10 sm:top-5  sm:left-5  " onClick={toggleUploadPopup}/>
        {mediaUrl && mediaType && isImage(mediaType) && (
        <div className="w-[560px] h-[400px] relative overflow-hidden readingBook flex items-center  sm:w-full ">
          <img
            src={mediaUrl}
            className="w-full h-full object-scale-down"
            alt=''
          />
        </div>
      )}

      {/* Render video if media is a video */}
      {mediaUrl && mediaType && isVideo(mediaType) && (
        <div className="w-[560px] h-[400px] relative overflow-hidden readingBook flex items-center sm:w-full">
          <video controls className="w-full h-full object-scale-down">
          <track default kind="captions" />
            <source src={mediaUrl} type={mediaType} />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    <div className="w-[560px] items-center justify-between flex  sm:w-full  sm:p-3">
      
<h1 className="text-base text-white text-center text-blue">Send {mediaUrl && mediaType && (isImage(mediaType) ? 'Image' :[ isVideo(mediaType) ? 'Video' : ''])}  to {activeChat?.user.username}</h1>
    <button className={`p-4  rounded-full sm:p-3  ${uploading? 'bg-deepBlue':'bg-blue'}`} onClick={handleSendMedia} disabled={!file}>
     
        {uploading ? <Image src={loading} alt="" className="w-7  sm:w-6    cursor-pointer"/>:<Image src={sendWhite} alt="" className="w-7  sm:w-6   cursor-pointer" /> }
        </button>
    </div>
  
          </div>
    );
}
 
export default UploadMedia;
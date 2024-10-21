import Image from "next/image";

import x from '~/public/icons/xwhite.svg'
import emoji from '~/public/icons/smiley-White.svg'
import palette from '~/public/icons/pallete.svg'
import Emojis from "./emoji-picker";
import loading from '~/public/images/load.gif'
import sendWhite from '~/public/icons/sendWhite.svg'
const StatusUpdate = (props: any) => {
    const {status, isStatus, statusRef, toggleStatusPopup, setInputValue, changeColor, currentColorIndex, inputValue, handleChange, textareaRef,colors,      emojis ,isEmojisVisible, emojisRef,onEmojiClick,toggleEmojisPopup,sendingStatus, handleSendStatus}= props;
    const emojiProps={ emojis ,isEmojisVisible, emojisRef,onEmojiClick,toggleEmojisPopup }
  
    return ( 
        status && (<div className={`flex items-center justify-center   h-full w-full fixed  top-0 z-[200] left-0     ${isStatus ? 'opacity-100' :  ' opacity-0'}   `} ref={statusRef}>
            <div className='w-full absolute top-6 flex items-center justify-between px-6'>
<Image src={x} alt='' className='w-6  cursor-pointer' onClick={()=>{toggleStatusPopup(); setInputValue('')}}/>
<div className='flex gap-8 items-center '>
    
<Image src={palette} alt='' className='w-6  cursor-pointer' onClick={changeColor}/>
<div className="relative ">
<Image src={emoji} alt='' className='w-6  cursor-pointer' onClick={toggleEmojisPopup}/>
<Emojis {...emojiProps}/>
</div>
</div>
            </div>
<div className=' h-full w-full   flex items-center justify-center  px-3'  style={{ backgroundColor: colors[currentColorIndex]}}>
<textarea
//  type="text"
placeholder="Type a status"
className=' font-semibold  outline-none px-2 py-2 rounded-md rounded-md  w-full  bg-transparent   text-white resize-none  text-6xl  text-center self-center  status  leading-normal lg:text-5xl lg:leading-none sm:text-4xl'  
value={inputValue}
onChange={handleChange}
ref={textareaRef}
style={{ overflow: 'hidden'}}
//@ts-ignore
autoFocus/>
</div>
<div className='w-full absolute bottom-0   flex items-center justify-end px-6 py-4 bg-[#00000029] sm:py-2 sm:px-3'>

<button className={`h-12 w-12   rounded-full   flex shrink-0 items-center justify-center self-center sm:h-10 sm:w-10   ${sendingStatus?'bg-deepBlue':'bg-blue'}`} onClick={handleSendStatus} disabled={sendingStatus}>
{sendingStatus ? <Image src={loading} alt="" className="w-6    cursor-pointer"/>:<Image src={sendWhite} alt="" className="w-6   cursor-pointer" /> }
     </button>
            </div>
    </div>)

     );
}
 
export default StatusUpdate;
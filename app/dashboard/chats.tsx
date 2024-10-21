'use client'
import Image from 'next/image';
import ellipis from './../../public/icons/menu.svg'
import { useDispatch, useSelector } from 'react-redux';
import newChat from './../../public/icons/new-chat.svg'
import nochat from '~/public/images/no-chat.svg'
import { setActiveButton } from '~/store/buttonSlice';
import audioMic from '~/public/icons/micShadow.svg'
import photo from './../../public/icons/photo.svg'
import { useUser } from '../context/auth-context';
import { formatTime, isMoreThanOneDay, transformDate } from '~/utils/format-date';
import { setActiveContact } from '~/store/contactSlice';
import sentGrey from './../../public/icons/sent-grey.svg'
import sentBlue from './../../public/icons/sent-blue.svg'
import { transformContentToImages } from '~/utils/transfrom-emojis-to-img';
import { setActiveView } from '~/store/viewSlice';
import { useScreenSize } from '~/utils/useScreenSize';
const Chats = () => {
    const activeButtonIndex = useSelector((state: any) => state.buttons.activeButtonIndex);
    const activeViewIndex = useSelector((state: any) => state.views.activeViewIndex);

const {loading, user} = useUser();
    const dispatch = useDispatch();
    const handleClick = (index: number) => {
      dispatch(setActiveButton(index));
    };
    const handleViewClick = (index: number) => {
      dispatch(setActiveView(index));
    };
    const customClasses = { emojiClass: 'w-4  h-4', onlyEmojiClass: 'w-5  h-5 ' };
    const isScreenLarge = useScreenSize(640); 
    const shouldRender = () => {
      if (isScreenLarge) {
        return activeButtonIndex === 0;
      } else {
        return activeViewIndex === 0;
      }
    };
    const activeContactId = useSelector((state: any) => state.contacts.activeContactId);
    const activeChat = user?.contacts.find((chat: any) => activeContactId === chat._id);
    return (
        shouldRender() &&(<div className="flex flex-col gap-6  w-full lg:gap-3 md:h-full h-full"> 
            <div className="flex items-center justify-between w-full px-4 lg:px-2 ">
            <h1 className="text-[22px] font-bold text-dimWhite bold  lg:text-lg   ">Chats
                </h1>
            <div className='flex gap-6 items-center lg:gap-3'>

            <Image src={newChat} alt="" className="w-6 cursor-pointer lg:w-5 sm:hidden" onClick={() => handleClick(0.1)}/>
            <Image src={newChat} alt="" className="w-6 cursor-pointer lg:w-5 hidden sm:flex" onClick={() => handleViewClick(0.1)}/>
            <Image src={ellipis} alt="" className="w-6 lg:w-5"/>
    
            </div>
            </div>

            <div className='flex flex-col  lg:px-1  overflow-auto h-full sm:px-0' >
              {loading?
               null:<>
               {(user?.contacts.length!== 0?<>{
               (user?.contacts
      .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .map((data : any, index: any)=>{
                const lastMessageRead= data.messages[data.messages.length - 1]?.sender.phone !== user.phone && data.messages[data.messages.length - 1]?.read === false;
return(
  <button className={`flex items-center  h-[70px] border-b  border-b-1 border-deepBlue  px-4  lg:px-2 lg:h-[60px] gap-2 duration-150 transition ease ${data._id===activeChat?._id ? 'bg-deepBlue' :'hover:bg-[#1c3a4d9c]'}`} key={index + 1} onClick={() => {dispatch(setActiveContact(data._id)); handleViewClick(0.2)}}>
  <img src={data.user.profile? data.user.profile: '/icons/default-user.svg'} className='  h-[50px]  w-[50px]  object-cover rounded-full lg:h-[35px] lg:w-[35px] shrink-0' alt=''/>
  <div className='flex flex-col gap-0 w-full items-start overflow-hidden'>
    <div className='flex items-center w-full justify-between'>
      
<h1 className={`text-[15px]  text-white lg:text-sm    ${lastMessageRead ? 'font-[family-name:var(--font-mulish-semi)]': 'font-[family-name:var(--font-mulish)]'}   `}>{data.user.username}</h1>
<h1 className={` text-[11px] norm lg:text-[11px] ${lastMessageRead ? 'text-blue': 'text-lightGrey'}`}>
{isMoreThanOneDay(data.updatedAt)
? transformDate(data.updatedAt)  
: formatTime(data.updatedAt)}
</h1>
    </div>
   <div className={`flex items-center gap-1   ${lastMessageRead && 'justify-between  w-full'} `}>
{data.messages[data.messages.length - 1]?.image && (<div className='flex gap-1 items-center'><Image src={photo} className='w-4 sm:w-3' alt=''/><h1 className='text-sm text-silver sm:text-xs'>Photo</h1></div>)}
{data.messages[data.messages.length - 1]?.video && (<div className='flex gap-1 items-center'><Image src={photo} className='w-4 sm:w-3' alt=''/><h1 className='text-sm text-silver sm:text-xs'>Video</h1></div>)}
{data.messages[data.messages.length - 1]?.audio && (<div className='flex gap-1 items-center'><Image src={audioMic} className='w-4 sm:w-3' alt=''/><h1 className='text-sm text-silver sm:text-xs'>Audio</h1></div>)}
{data.messages[data.messages.length - 1]?.sender.phone === user.phone && (
<>{data.messages[data.messages.length - 1]?.read === true?<Image src={sentBlue} alt="" className="w-4"/>:<Image src={sentGrey} alt="" className="w-4"/>}</>

)}
<h1
className={`text-[13px]  text-silver lg:text-xs     truncate   overflow-hidden line clamp-1  flex   message-box  ${lastMessageRead ? 'font-[family-name:var(--font-mulish-semi)]': 'font-[family-name:var(--font-mulish)]'}`}
dangerouslySetInnerHTML={{
__html: data.messages && data.messages.length > 0
? transformContentToImages(data.messages[data.messages.length - 1].content, customClasses)
: 'Messages are end-to-end encrypted '
}}
/>

{lastMessageRead &&(<span className='bg-blue  text-xs text-darkBlue  h-5 w-5  rounded-full flex items-center justify-center shrink-0'>
{data.messages.filter((msg: any) => msg.read === false).length}
</span>)}


</div>
  </div>

</button>
)
}))}
               </>:<div className='flex flex-col text-dimWhite gap-2 p-2  h-full items-center justify-center '>
<Image src={nochat} alt='' className='w-[80%]'/>
<div className='flex gap-3 items-center flex-col '>
<h1 className='text-xl font-[family-name:var(--font-mulish-bold)] sm:text-base'>Stay connected to loved ones</h1>
<button className='text-sm text-blue underline ' onClick={() => {
        if (isScreenLarge) {
          handleClick(0.1); 
        } else {
          handleViewClick(0.1); 
        }
      }}>Start a new chat today</button>
</div>
               </div>)}</>
                }
            </div>
            </div>)
          );
}
 
export default Chats;




'use client'
import Image from 'next/image';
import ellipis from './../../public/icons/menu.svg'
import { useSelector } from 'react-redux';
import newStatus from '~/public/icons/plus.svg'
import { useUser } from '../context/auth-context';
import { useScreenSize } from '~/utils/useScreenSize';
import { usePopup } from '~/utils/togglePopups';
import { useEffect, useRef, useState } from 'react';
import StatusUpdate from './components/status/status';

import  { EmojiClickData } from 'emoji-picker-react';
import TypePopup from './components/status/type-popup';
import { useStatuses } from '../context/status-context';
import StatusViewer from './components/status/status-viewer';
const Status = () => {
    const activeButtonIndex = useSelector((state: any) => state.buttons.activeButtonIndex);
    const activeViewIndex = useSelector((state: any) => state.views.activeViewIndex);

const { user} = useUser();

const { statuses, handleSelectSenderStatuses} = useStatuses();
    const isScreenLarge = useScreenSize(640); 
    const shouldRender = () => {
      if (isScreenLarge) {
        return activeButtonIndex === 1;
      } else {
        return activeViewIndex === 1;
      }
    };
    const { isVisible: isType, isActive: type, ref: typeRef, togglePopup: toggleTypePopup } = usePopup();
    const { isVisible: isStatus, isActive: status, ref: statusRef, togglePopup: toggleStatusPopup } = usePopup();
    const { isVisible: isViewing, isActive: view, ref: viewRef, togglePopup: toggleViewPopup } = usePopup();
    const [inputValue, setInputValue] = useState<string>('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(event.target.value);
      resizeTextarea();
    };
    const resizeTextarea = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = '40px';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };
    useEffect(() => {
      resizeTextarea();
    }, [inputValue]);
    const colors = ['#792138', '#6E257E', '#243640', '#F0B330', '#26C4DC','#FF7B6B',
'#90A841',
      '#74676A',
      '#54C265'];
  
    
    const [currentColorIndex, setCurrentColorIndex] = useState(0);
  
    
    const changeColor = () => {
      setCurrentColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    };
    const onEmojiClick = (emojiData: EmojiClickData) => {
      setInputValue((prevInput) => prevInput + emojiData.emoji); 
    };
    const [sendingStatus, setSendingStatus]= useState(false);
    const handleSendStatus = async () => {
        if (!inputValue.trim() || sendingStatus) return;
  setSendingStatus(true);
  
        const userId = user?._id;
        const text=true;
        const background= colors[currentColorIndex];
        const content= inputValue;

        try {
          const res = await fetch('/api/status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              text,
              background,
              content
            }),
          });
      
          const data = await res.json();
          if (res.ok) {
            

setTimeout(()=>{toggleStatusPopup(); 
  setInputValue(''); 
  setSendingStatus(false);}, 5000)
          } else {
            setSendingStatus(false)
            alert(`An error occured: ${data}`);
          }
        } catch (error) {
          console.error('Error sending message:', error);
        }
      };
    const { isVisible: isEmojisVisible, isActive: emojis,  ref: emojisRef, togglePopup: toggleEmojisPopup} = usePopup();

    const statusProps={
      status, isStatus, statusRef, toggleStatusPopup, setInputValue, changeColor, currentColorIndex, inputValue, handleChange, textareaRef,colors,      emojis ,isEmojisVisible, emojisRef,onEmojiClick,toggleEmojisPopup, sendingStatus, setSendingStatus,handleSendStatus
    }
    const typeProps={
      type,isType,typeRef, toggleStatusPopup
    }
    const filterOwnedStatus=
    statuses?.filter((status: any) => status?.sender?._id === user?._id);
    const filteredStatuses = statuses?.filter((status: any) => 
      status.contacts.some((contact: any) => contact.contact === user?._id)
    );
    
    
    const groupedStatuses = filteredStatuses?.reduce((acc: any, status: any) => {
      const senderId = status.sender._id; 
    
      if (!acc[senderId]) {
        acc[senderId] = {
          sender: status.sender,
          statuses: [],
        };
      }
    
      acc[senderId].statuses.push(status); 
      return acc;
    }, {});
    
    
    const groupedStatusesArray = groupedStatuses ? Object.values(groupedStatuses) : [];
    const viewerProps={isViewing,view, viewRef,  toggleViewPopup, statuses, filterOwnedStatus }
    const lastStatus = statuses
  ?.filter((status: any) => status?.sender?._id === user?._id)
  .slice(-1)[0];

    return (
        shouldRender() &&(<div className="flex flex-col gap-6  w-full lg:gap-3 md:h-full"> 
            <div className="flex items-center justify-between w-full px-4 lg:px-2 ">
            <h1 className="text-[22px] font-bold text-dimWhite bold  lg:text-lg   ">Status 

                </h1>

            <div className='flex gap-6 items-center lg:gap-3'>

            <Image src={newStatus} alt="" className="w-6 cursor-pointer lg:w-5 sm:hidden" onClick={toggleTypePopup}/>
            <Image src={newStatus} alt="" className="w-6 cursor-pointer lg:w-5 hidden sm:flex" onClick={toggleTypePopup}/>
            <Image src={ellipis} alt="" className="w-6 lg:w-5"/>
    
            </div>
            </div>

            <div className='flex flex-col  lg:px-1      relative' >
            <button className={`flex items-center  h-[70px] border-b  border-b-1 border-deepBlue  px-4   gap-2 duration-150 transition ease hover:bg-[#1c3a4d9c]`}   {...(lastStatus ?{onClick: toggleViewPopup}:{onClick: toggleTypePopup})}>
                <div className='  h-[50px]  w-[50px]       shrink-0 relative  '>
                  {lastStatus?(<div className='shrink-0 object-cover rounded-full w-full h-full overflow-hidden flex items-center justify-center outline  outline-blue  outline-offset-2 '  style={{backgroundColor: `${lastStatus.background}`}} >
                    <h1 className='text-white leading-none text-[7px] text-center font-[family-name:var(--font-mulish)]'>
{lastStatus.content}
</h1>
                  </div>):(<img src={user?.profile?  user?.profile: '/icons/default-user.svg'} className=' shrink-0 object-cover rounded-full w-full h-full ' alt=''/>)}
  
  <button className='bg-blue  rounded-full absolute bottom-0 right-0'>
  <Image src={newStatus} alt="" className="w-4 cursor-pointer lg:w-5 "/>
  </button>
  </div>
  <div className='flex flex-col gap-0 w-full items-start overflow-hidden'>
    <div className='flex items-start  w-full flex-col '>
      
<h1 className={`text-base   text-white lg:text-sm     font-[family-name:var(--font-mulish)]   `}>My status</h1>
<h1 className={` text-xs norm  text-lightGrey`}>
Click to {lastStatus?'view':'add'} status update
</h1>
    </div>
  </div>

</button>
<TypePopup {...typeProps}/>
            </div>
            {groupedStatusesArray.map(({ sender, statuses }: any) => (
      <button key={sender._id} className='flex gap-3 items-center px-4 '  onClick={() => {handleSelectSenderStatuses(statuses);toggleViewPopup()}} >
        <div className='h-[50px]  w-[50px]      shrink-0 relative  rounded-full overflow-hidden outline  outline-blue  outline-offset-2'>
        {statuses.slice(-1).map((status: any) => (
          <div key={status._id} className='h-full w-full flex items-center justify-center   ' style={{ backgroundColor: `${status.background}` }}>
            <h1 className='text-[7px] text-white text-center'>{status.content}</h1>
          </div>
        ))}
        </div>
        <div>
        <h1 className='text-base text-white font-[family-name:var(--font-mulish)] lg:text-sm'>{sender.username}</h1>
        </div>
      </button>
    ))}
      <StatusViewer {...viewerProps}/>
<StatusUpdate {...statusProps}/>
            </div>)
          );
}
 
export default Status;
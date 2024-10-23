
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import back from '~/public/icons/back.svg'
import { setActiveView } from '~/store/viewSlice';
import menuIcon from '~/public/icons/menu.svg'
import { Tooltip } from 'react-tooltip';
import { usePopup } from '~/utils/togglePopups';
import { useState } from 'react';
import { useUser } from '~/app/context/auth-context';
import loadingGif from '~/public/images/load.gif'
const ChatHeader = ({chat, blockee,blocker}: any) => {
    const dispatch = useDispatch();
    const handleClick = (index: number) => {
        dispatch(setActiveView(index));
      };
      const {user}= useUser();
      const { isVisible: isMenu, isActive: menu, ref: menuRef, togglePopup: toggleMenuPopup } = usePopup();
      const [blocking, setBlocking]= useState(false);
      const blockContact = async () => {
        if (blocking) return;
        const blockerId = user?._id;
        setBlocking(true);
        try {
          const res = await fetch('/api/block', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              blockeeId: chat?._id,
              blockerId,
            }),
          });

          if (res.ok) {
            setTimeout(()=>{ setBlocking(false);
              toggleMenuPopup();},3000)

          } else {
            setBlocking(false);
          }
        } catch (error) {
          console.error('Error blocking/unblocking', error);
        }
      };
    return (
        <div className="w-full px-4 py-2 bg-deepBlue flex items-center  justify-between lg:px-2  lg:py-1 ">
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
<Image src={back} alt='' className='w-5 hidden sm:flex'   onClick={() => handleClick(0)}/>
        <img src={chat?.profile? chat.profile: '/icons/default-user.svg'}  className="w-10 h-10 object-cover rounded-full lg:w-9  lg:h-9" alt=""/>
        </div>
        <div className="flex flex-col gap-1  ">
        <h1 className="text-base text-white  lg:text-sm">{chat.username} </h1>
        </div>
        </div>
        {!blockee&&(
<button className='relative' onClick={toggleMenuPopup}>
<Image src={menuIcon} alt='' className='w-6 toolti ' />
<Tooltip
className='sm:hidden'
    anchorSelect=".toolti"
    content={`Menu`}
    place='right'
    style={{ backgroundColor: 'white', color: "black"  , fontSize: '12px', zIndex:100}}

  />
  {menu && (<div className={`bg-[#202C33] p-1 absolute top-[100%] right-0 w-[150px] rounded-md z-[100]    ${isMenu ? 'opacity-100' :  ' opacity-0'}`} ref={menuRef}>
<button className='w-full hover:bg-dimBlue   duration-150 text-sm  px-5  py-2 ease flex items-center justify-between sm:py-1 text-white rounded-md' onClick={blockContact} disabled={blocking}>

<span>  {blocker?'Unblock':'Block'}</span>
{blocking ? <Image src={loadingGif} alt="" className="w-4   cursor-pointer"/>:null }
</button>
  </div>)}
</button>
)}
                                     </div>
      );
}
 
export default ChatHeader;
"use client"
import Image from "next/image";
import chat from './../../../public/icons/chats.svg'
import status from './../../../public/icons/status.svg'
import { Tooltip } from 'react-tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveButton } from '~/store/buttonSlice';
import { useUser } from "~/app/context/auth-context";
import { setActiveView } from "~/store/viewSlice";
import { useScreenSize } from "~/utils/useScreenSize";
import { countUnreadMessages } from "~/utils/count-unread-messages";
const ChatBar = () => {
const {loading, user} = useUser();
  const dispatch = useDispatch();
  const unreadMessages= countUnreadMessages()
  const activeButtonIndex = useSelector((state: any) => state.buttons.activeButtonIndex);
  const activeViewIndex = useSelector((state: any) => state.views.activeViewIndex);
  const handleClick = (index: number) => {
    dispatch(setActiveButton(index));
  };
  const handleViewClick = (index: number) => {
    dispatch(setActiveView(index));
  };
  const isScreenLarge = useScreenSize(640);



    return (  <section className="flex flex-col  items-center  justify-between  h-full bg-deepBlue  p-2 lg:p-1 md:h-auto md:w-full    md:flex-col   md:h-full md:px-3">
<div className="flex flex-col  items-center   gap-3 transition duration-150 rounded-full  md:flex-col  md:items-start">
<button      onClick={() => {
        if (isScreenLarge) {
          handleClick(0); 
        } else {
          handleViewClick(0); 
        }
      }}
        className={`tooltip-1    p-3 lg:p-2  transition duration-150 rounded-full flex gap-3 md:p-3   ${
          String(activeButtonIndex || activeViewIndex).startsWith('0') ? 'bg-darkBlue' : ''
        }`}>
          <div className="relative">
            {unreadMessages >0 && (
            <span className="bg-blue p-1 text-[10px] text-darkBlue absolute -top-2  left-3 h-4 w-4 rounded-full   flex items-center  justify-center">
              <span>
              {unreadMessages}
              </span>
            </span>
          )}
<Image src={chat} alt="" className="w-6 lg:w-5"/>
</div>

<h1 className="hidden md:flex text-base  text-blue">Chats</h1>
<Tooltip
    anchorSelect=".tooltip-1"
    content={`Chats`}
    place='right'
    className="md:hidden"
    style={{ backgroundColor: 'white', color: "black"  , fontSize: '12px', zIndex:100}}

  />
</button>
<button onClick={() => {
        if (isScreenLarge) {
          handleClick(1); 
        } else {
          handleViewClick(1); 
        }
      }}
className={`tooltip-2    p-3 lg:p-2  transition duration-150 rounded-full flex gap-3 md:p-3 ${
  String(activeButtonIndex ||activeViewIndex).startsWith('1') ? 'bg-darkBlue' : ''
}`}>

<Image src={status} alt="" className="w-6 lg:w-5"/>
<h1 className="hidden md:flex text-base  text-blue">Status</h1>
<Tooltip
className='md:hidden'
    anchorSelect=".tooltip-2"
    content={`Status`}
    place='right'
    style={{ backgroundColor: 'white', color: "black"  , fontSize: '12px', zIndex:100}}

  />
</button>

</div>
<div className="flex flex-col  items-center   gap-3 transition duration-150 rounded-full md:flex-row md:flex-col  md:items-start">
<button onClick={() => {
        if (isScreenLarge) {
          handleClick(2); 
        } else {
          handleViewClick(2); 
        }
      }}
className={`tooltip-5    p-1 transition duration-150 rounded-full flex gap-3 md:p-3 ${
  String(activeButtonIndex ||activeViewIndex).startsWith('2') ? 'bg-darkBlue' : ''
}`}  >
  {loading ? null: <img src={user?.profile? user.profile: '/icons/default-user.svg'} alt="" className="w-9 h-9  rounded-full object-cover lg:w-7  lg:h-7 "/>}
  <h1 className="hidden md:flex text-base  text-blue">Profile</h1>
<Tooltip
className='md:hidden'
    anchorSelect=".tooltip-5"
    content={`Profile`}
    place='right'
    style={{ backgroundColor: 'white', color: "black"  , fontSize: '12px', zIndex:100}}

  />
</button>
</div>
    </section>);
}
 
export default ChatBar;
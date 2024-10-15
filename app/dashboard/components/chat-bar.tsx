"use client"
import Image from "next/image";
import chat from './../../../public/icons/chats.svg'
import status from './../../../public/icons/status.svg'
import contacts from './../../../public/icons/contacts.svg'
import settings from './../../../public/icons/settings.svg'
import { Tooltip } from 'react-tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveButton } from '~/store/buttonSlice';
import { useUser } from "~/app/context/auth-context";
import { useEffect, useState } from "react";
import { setActiveView } from "~/store/viewSlice";
import { useScreenSize } from "~/utils/useScreenSize";
const ChatBar = () => {
const {loading, user} = useUser();
  const dispatch = useDispatch();
  const activeButtonIndex = useSelector((state: any) => state.buttons.activeButtonIndex);
  
  const handleClick = (index: number) => {
    dispatch(setActiveButton(index));
  };
  const handleViewClick = (index: number) => {
    dispatch(setActiveView(index));
  };
  const isScreenLarge = useScreenSize(640);



    return (  <section className="flex flex-col  items-center  justify-between  h-full bg-deepBlue  p-2 lg:p-1 md:h-auto md:w-full  md:flex-row">
<div className="flex flex-col  items-center   gap-3 transition duration-150 rounded-full md:flex-row">
<button      onClick={() => {
        if (isScreenLarge) {
          handleClick(0); 
        } else {
          handleViewClick(0); 
        }
      }}
        className={`tooltip-1    p-3 lg:p-2  transition duration-150 rounded-full  ${
          String(activeButtonIndex).startsWith('0') ? 'bg-darkBlue' : ''
        }`}>
<Image src={chat} alt="" className="w-6 lg:w-5"/>
<Tooltip
    anchorSelect=".tooltip-1"
    content={`Chats`}
    place='right'
    className="sm:hidden"
    style={{ backgroundColor: 'white', color: "black"  , fontSize: '12px', zIndex:100}}

  />
</button>
<button onClick={() => handleClick(1)}
className={`tooltip-2    p-3 lg:p-2  transition duration-150 rounded-full ${
  String(activeButtonIndex).startsWith('1') ? 'bg-darkBlue' : ''
}`}>
<Image src={status} alt="" className="w-6 lg:w-5"/>
<Tooltip
    anchorSelect=".tooltip-2"
    content={`Status`}
    place='right'
    style={{ backgroundColor: 'white', color: "black"  , fontSize: '12px', zIndex:100}}

  />
</button>
<button onClick={() => handleClick(2)}
className={`tooltip-3    p-3 lg:p-2  transition duration-150 rounded-full ${activeButtonIndex === 2 ? 'bg-darkBlue  ' : ''}`}>
<Image src={contacts} alt="" className="w-6 lg:w-5"/>
<Tooltip
    anchorSelect=".tooltip-3"
    content={`Contacts`}
    place='right'
    style={{ backgroundColor: 'white', color: "black"  , fontSize: '12px', zIndex:100}}

  />
</button>
</div>
<div className="flex flex-col  items-center   gap-3 transition duration-150 rounded-full md:flex-row">
<button onClick={() => handleClick(3)}
className={`tooltip-4    p-3 lg:p-2  transition duration-150 rounded-full ${activeButtonIndex === 3 ? 'bg-darkBlue  ' : ''}`}  >
<Image src={settings} alt="" className="w-6 lg:w-5"/>
<Tooltip
    anchorSelect=".tooltip-4"
    content={`Settings`}
    place='right'
    style={{ backgroundColor: 'white', color: "black"  , fontSize: '12px', zIndex:100}}

  />
</button>
<button onClick={() => handleClick(4)}
className={`tooltip-5    p-1 transition duration-150 rounded-full ${activeButtonIndex === 4 ? 'bg-darkBlue  ' : ''}`}  >
  {loading ? null: <img src={user?.profile? user.profile: '/icons/default-user.svg'} alt="" className="w-9 h-9  rounded-full object-cover lg:w-7  lg:h-7 "/>}

<Tooltip
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
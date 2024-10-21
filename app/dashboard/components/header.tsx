'use client'
import Image from 'next/image';
import me from '~/public/images/me.svg'
import x from '~/public/icons/xmark.svg'
import bars from '~/public/icons/bars.svg'
import { useDashboard } from '~/app/context/dashboard-context';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
const MobileHeader = () => {
const {isOverlayOpen, setIsOverlayOpen} =useDashboard();
const [icon, setIcon] = useState(bars);
const activeViewIndex = useSelector((state: any) => state.views.activeViewIndex);
useEffect(() => {
    const overlayElement = document.getElementById('myOverlay');
    if (!overlayElement) {
      return;
    }
overlayElement.style.width = '0%';
setIsOverlayOpen(false);
setIcon(bars);
  }, [activeViewIndex, setIsOverlayOpen]);
  const handleToggleOverlay = () => {
      toggleOverlay();
      setIsOverlayOpen(!isOverlayOpen);
      setIcon(isOverlayOpen ? bars : x);
    };
 
  
    return (  <nav className={` items-center   px-2 py-2 bg-deepBlue sticky top-0   z-[50] hidden  ${activeViewIndex === 0.2 ?' hidden': ' md:flex'}`}>
        <div className='bg-darkBlue h-8 w-8 rounded-full  flex items-center justify-center'>
        <Image src={icon} alt="" className="w-6 lg:w-4 " onClick={handleToggleOverlay}/>
        </div>
  <div  className="flex gap-1  items-center  mx-auto">
        <Image src={me} alt="" className="w-6 lg:w-4"/>
        <h1 className="font-bold  font-[family-name:var(--font-mulish-bold)] text-blue text-3xl  lg:text-xl">
            DaxApp
        </h1>
        </div>

    </nav>);
}
 
export default MobileHeader;

export  const toggleOverlay = () => {
    const overlayElement = document.getElementById('myOverlay');
    if (!overlayElement) {

      return;
    }
  
    if (overlayElement.style.width === '100%') {
      overlayElement.style.width = '0%';
  
    } else {
      overlayElement.style.width = '100%';
    }
      
  
    
  
  };
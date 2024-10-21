'use client'
import Image from "next/image";

import loading from '~/public/images/load.gif'
import { useScreenSize } from "~/utils/useScreenSize";
const More = (item: any) => {
    const {more,positionClass,isMore,user, moreRef,action,props}=item;
    const isScreenLarge = useScreenSize(640);
    
    return (  
        more && (<div className={`flex flex-col bg-deepBlue   absolute ${isScreenLarge && [positionClass]}  w-[200px] rounded-md overflow-hidden z-[200] duration-300 ease  sm:top-0 sm:w-[170px]    ${isMore ? 'opacity-100' :  ' opacity-0'}   ${props.sender.phone !== user.phone ?'left-[102%]  sm:left-[0%]': 'right-[102%] sm:right-[0%] '}`} ref={moreRef}>
 
            {action.map((act: any, index: number)=>(
             <button className={`w-full hover:bg-dimBlue   duration-150 text-sm  px-5  py-2 ease flex items-center justify-between sm:py-1 ${act.hidden === true && 'hidden'}`} key={index + 1} onClick={act.onClick}>
             <span>{act.action}</span>
             {act.loading ? <Image src={loading} alt="" className="w-4   cursor-pointer"/>:null }
            </button>
            ))}
            
                  </div>)
    );
}
 
export default More;
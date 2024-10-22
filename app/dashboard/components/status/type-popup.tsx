import Image from "next/image";
import images from '~/public/icons/inages.svg'
import text from '~/public/icons/text.svg'
const TypePopup = (props: any) => {
    const {type,isType,typeRef, toggleStatusPopup}=props
    return (
        type && (<div className={`flex flex-col bg-deepBlue   absolute   w-[170px] rounded-sm overflow-hidden z-[200] duration-300 ease  top-0 right-10  sm:w-[170px] py-2    ${isType ? 'opacity-100' :  ' opacity-0'}   `} ref={typeRef}>
           <button className={`w-full hover:bg-dimBlue   duration-150 text-sm  px-4  py-2 ease flex items-center gap-2  sm:py-1 text-silver `}   onClick={toggleStatusPopup} >
              <Image src={text} className='w-5' alt=''/>
            <span>Text</span>
           </button>
           
                 </div>)
      );
}
 
export default TypePopup;
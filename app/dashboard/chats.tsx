'use client'
import Image from 'next/image';
import ellipis from './../../public/icons/menu.svg'
import { useDispatch, useSelector } from 'react-redux';
import newChat from './../../public/icons/new-chat.svg'
import { setActiveButton } from '~/store/buttonSlice';
import { bold, medium } from '~/utils/font-types';
import { useUser } from '../context/auth-context';
import { transformDate } from '~/utils/format-date';
import { setActiveContact } from '~/store/contactSlice';
const Chats = () => {
    const activeButtonIndex = useSelector((state: any) => state.buttons.activeButtonIndex);

const {loading, user} = useUser();
    const dispatch = useDispatch();
    const handleClick = (index: number) => {
      dispatch(setActiveButton(index));
    };
    const activeContactId = useSelector((state: any) => state.contacts.activeContactId);
    return (
        activeButtonIndex === 0 &&(<div className="flex flex-col gap-6  w-full"> 
            <div className="flex items-center justify-between w-full px-4 lg:px-2">
            <h1 className="text-[22px] font-bold text-dimWhite bold  lg:text-xl ">Chats
                </h1>
            <div className='flex gap-6 items-center lg:gap-3'>

            <Image src={newChat} alt="" className="w-6 cursor-pointer" onClick={() => handleClick(0.1)}/>
            <Image src={ellipis} alt="" className="w-6"/>
    
            </div>
            </div>
            <div className='flex flex-col px-2' >
              {loading? null: (user?.contacts.map((data : any, index: any)=>(
                <button className='flex items-center  h-[70px] border-b  border-b-1 border-deepBlue  px-2  lg:px-2 lg:h-[60px] gap-2' key={index + 1} onClick={() => dispatch(setActiveContact(data._id))}>
                  <img src={data.profile? data.profile: '/icons/default-user.svg'} className='  h-[50px]  w-[50px]  object-cover rounded-full lg:h-[35px] lg:w-[35px]' alt=''/>
                  <div className='flex flex-col gap-0 w-full items-start'>
                    <div className='flex items-center w-full justify-between'>
                      
<h1 className={`text-[15px]  text-white lg:text-sm    md:${bold}  ${medium} `}>{data.username}</h1>
<h1 className='text-lightGrey text-[11px] norm lg:text-[11px]'>

{transformDate(data.updatedAt)}
</h1>
                    </div>
                    <h1 className='text-[13px]  norm text-silver  lg:text-xs line-clamp-1'>Messages are end-to-end encrypted.</h1>
                  </div>

</button>
              )))}
            </div>
            </div>)
          );
}
 
export default Chats;




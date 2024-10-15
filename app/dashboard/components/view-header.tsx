
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import back from '~/public/icons/back.svg'
import { setActiveView } from '~/store/viewSlice';
const ChatHeader = ({chat}: any) => {
    const dispatch = useDispatch();
    const handleClick = (index: number) => {
        dispatch(setActiveView(index));
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
                                     </div>
      );
}
 
export default ChatHeader;
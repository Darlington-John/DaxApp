"use client"
import ChatBar from './chat-bar';

const Overlay = () => {
  return (
    <div className={`hidden  fixed  z-40 top-0 left-0             flex-col gap-16 justify-end  fade ease-out duration-[0.5s]    overflow-hidden  h-full  backdrop-blur-sm  md:flex  `}  id="myOverlay">
        <div className={`absolute    top-[60px]   md:top-[50px]    h-[calc(100vh-50px)] sm:w-[140px]`}>
<ChatBar/>
</div>
    </div>
  );
};

export default Overlay;

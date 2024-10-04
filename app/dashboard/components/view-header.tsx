const ChatHeader = ({chat}: any) => {
    return (
        <div className="w-full px-4 py-2 bg-deepBlue flex items-center  justify-between">
        <div className="flex items-center gap-4">
        <img src={chat?.profile? chat.profile: '/icons/default-user.svg'}  className="w-10 h-10 object-cover rounded-full" alt=""/>
        <div className="flex flex-col gap-1  ">
        <h1 className="text-base text-white  ">{chat.username} </h1>
        </div>
        </div>
                                     </div>
      );
}
 
export default ChatHeader;
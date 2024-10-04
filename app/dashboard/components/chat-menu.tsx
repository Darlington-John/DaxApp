"use client"

import Chats from "../chats";
import NewChat from "../new-chat";
import Profile from "../profile";




const ChatMenu = () => {


    return (<div className="flex flex-col gap-5  w-full">
        <NewChat/>
        <Chats/>
<Profile/>

        </div>  );
}
 
export default ChatMenu;
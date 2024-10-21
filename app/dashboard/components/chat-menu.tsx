"use client"

import Chats from "../chats";
import NewChat from "../new-chat";
import Profile from "../profile";
import Status from "../status";




const ChatMenu = () => {


    return (<div className="flex flex-col gap-5  w-full">
        <NewChat/>
        <Chats/>
        <Status/>
<Profile/>

        </div>  );
}
 
export default ChatMenu;
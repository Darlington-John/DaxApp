'use client'
import { useSelector } from "react-redux";
import ChatBar from "./components/chat-bar";
import ChatMenu from "./components/chat-menu";
import View from "./components/view";

const Dashboard = () => {
    const activeViewIndex = useSelector((state: any) => state.views.activeViewIndex);

    return (  <main className="flex items-start bg-[#0C1317]  h-screen p-4  lg:p-0  md:flex-col">
<div  className="h-full flex shrink-0 md:hidden">
<ChatBar/>
</div>

<div className="w-[450px] py-3 flex shrink-0 bg-darkBlue h-full 2xl:w-[400px]  lg:w-[300px] md:flex-1 border-x border-[#262F34] md:hidden">
<ChatMenu/>
</div>
<div className="w-full h-full    overflow-hidden md:hidden">
<View/>
</div>



<div className=" w-full  hidden  md:flex overflow-hidden">
<div className={`w-[450px] py-3 flex shrink-0 bg-darkBlue h-full 2xl:w-[400px]  lg:w-[300px]  border-x border-[#262F34] md:h-[calc(100vh-45px)] sm:w-full   ${(activeViewIndex === 0||activeViewIndex === 0.1) ? ' ':'sm:hidden'}`}>
<ChatMenu/>
</div>
<div className={`w-full  h-full    overflow-hidden  ${activeViewIndex === 1? ' ':'sm:hidden'}`}>
    <View/>
</div>
</div>
<div  className={`w-full  shrink-0 hidden md:flex  ${activeViewIndex === 1? ' sm:hidden':''}`}>
<ChatBar/>
</div>
    </main>);
}
 
export default Dashboard;
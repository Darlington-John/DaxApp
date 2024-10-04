
import ChatBar from "./components/chat-bar";
import ChatMenu from "./components/chat-menu";
import View from "./components/view";

const Dashboard = () => {
    return (  <main className="flex items-start bg-[#0C1317]  h-screen p-4  lg:p-0 ">
<div  className="h-full flex shrink-0">
<ChatBar/>
</div>

<div className="w-[450px] py-3 flex shrink-0 bg-darkBlue h-full 2xl:w-[400px]  lg:w-[300px] md:flex-1 border-x border-[#262F34]">
<ChatMenu/>
</div>
<div className="w-full h-full     md:hidden overflow-hidden">
<View/>
</div>
    </main>);
}
 
export default Dashboard;
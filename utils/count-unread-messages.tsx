import { useUser } from "~/app/context/auth-context";


export const countUnreadMessages = () => {
    const {loading, user}= useUser();
    if (loading)return;
    if (!user) return 0;

    const userId = user?._id; 

    
    const unreadMessages = user?.contacts?.reduce((total: number, contact: any) => {
      const unreadForContact = contact?.messages?.filter(
        (message: any) => message.sender._id !== userId && !message.read
      );
      return total + unreadForContact.length;
    }, 0);

    return unreadMessages;
  };
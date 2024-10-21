import EmojiPicker from "emoji-picker-react";

const Emojis= (props: any) => {
const {emojis ,isEmojisVisible, emojisRef,onEmojiClick}=props;
    return ( 
        emojis && <div className={` h-[350px] absolute top-10 right-0  z-10 rounded-lg  overflow-hidden    ${isEmojisVisible ? 'opacity-100' :  ' opacity-0'}`} ref={emojisRef}> <EmojiPicker onEmojiClick={onEmojiClick}  
        //@ts-ignore
        theme="dark" style={{width: '100%', height: '100%'}} EmojiStyle="apple" className=" view"/>
        </div>
     );
}
 
export default Emojis;
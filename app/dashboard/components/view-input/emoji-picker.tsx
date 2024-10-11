import EmojiPicker from "emoji-picker-react";

const Emojis= (props: any) => {
const {emojis ,isEmojisVisible, emojisRef,onEmojiClick}=props;
    return ( 
        emojis && <div className={`  pop h-[350px] relative z-10  ${isEmojisVisible ? '' :  ' pop-hidden'}`} ref={emojisRef}> <EmojiPicker onEmojiClick={onEmojiClick}  
        //@ts-ignore
        theme="dark" style={{width: '100%', height: '100%'}} EmojiStyle="apple" className=" view"/>
        </div>
     );
}
 
export default Emojis;
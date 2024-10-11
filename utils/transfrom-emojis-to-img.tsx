
import emojiData from 'emoji-datasource-apple'; 
const getEmojiImageUrl = (emojiUnicode: any) => {
    const formattedUnicode = emojiUnicode.split('-').join('-').toLowerCase();
    const emoji = emojiData.find(e => e.unified.toLowerCase() === formattedUnicode); 
  
    if (emoji) {
      return `https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji.image}`; 
    }
    return ''; 
  };
  const isEmojiOnly = (content: string) => {
    //@ts-ignore
    const emojiRegex = /^[\p{Emoji}\s]+$/u;
    return emojiRegex.test(content);
  };
  export const transformContentToImages = (
    content: string, 
    customEmojiClasses?: { emojiClass: string; onlyEmojiClass: string }
  ) => {
    const isOnlyEmojis = isEmojiOnly(content);
    
    // Use the passed-in custom classes, or fallback to default
    const emojiClass = isOnlyEmojis 
      ? customEmojiClasses?.onlyEmojiClass || 'w-10 h-10' 
      : customEmojiClasses?.emojiClass || 'w-5 h-5'; 
  
    const transformedContent = Array.from(content).map((char: string) => {
      const emojiImageUrl = getEmojiImageUrl(char.codePointAt(0)?.toString(16));
      if (emojiImageUrl) {
        return `<img src="${emojiImageUrl}" alt="${char}" class="${emojiClass}"/>`;
      }
      return char === ' ' ? ' ' : char;
    }).join('');
  
    return transformedContent;
  };
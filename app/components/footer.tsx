'use client'
import { usePathname } from "next/navigation";

const Footer = () => {
    const linkname = usePathname();
    return (  <div className={`w-full relative h-[300px] flex shrink-0 bg-fixed bg-cover ${(linkname.startsWith('/auth') || linkname.startsWith('/dashboard')) && 'hidden'}`}style={{ backgroundImage: `url(/images/meBg.jpg)`}}>

    </div>);
}
 
export default Footer;
"use client"
import Image from "next/image";
import me from './../../public/images/me.svg'
import Button from "./animated-buttons";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "../context/auth-context";
import Link from "next/link";
const Header = () => {
  const {user, loading } = useUser();
 
    const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollThreshold = 50; 

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > scrollThreshold) {
      
      if (currentScrollY > lastScrollY) {
        setIsVisible(false); 
      } else {
        setIsVisible(true);  
      }
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);
  const linkname = usePathname();

    return (  <div className={`w-full  backdrop-blur-sm   py-4 px-6  items-center justify-between sticky top-0 z-[100] flex transition duration-[0.5s] ease xs:py-1.5  xs:px-2  ${isVisible ? 'bg-darkBlue' : 'bg-[#091926cc]'}  ${(linkname.startsWith('/auth') || linkname.startsWith('/dashboard')) && 'hidden'}`}>
<Link href={'/'} className="flex gap-1  items-center">
<Image src={me} alt="" className="w-5 xs:w-4 xs:w-3"/>
<h1 className="font-bold  font-[family-name:var(--font-mulish-bold)] text-blue text-2xl  xs:text-xl">
    DaxApp
</h1>
</Link>
<div className="flex gap-4 items-center  sm:justify-center">
    
<Button grey to="/auth/log-in" action="Login" />
<Button blue to="/auth/sign-up" action="Get started"/>
</div>

    </div>);
}
 
export default Header;
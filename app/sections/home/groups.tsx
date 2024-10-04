"use client"
import Image from "next/image";
import Button from "~/app/components/animated-buttons";
import phone from './../../../public/images/phone.png'
import ayesha from './../../../public/images/ayesha.png'
import { useInView } from "framer-motion";
import { useRef } from "react";
const Groups = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const float = {
        transform: isInView ? "none" : "translateY(200px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
      }
    return ( <section  className="bg-darkBlue flex items-center    xl:flex-col"  ref={ref}>
 
<div className="w-1/2 p-4 flex items-end   justify-end  xl:self-end  xl:w-auto lg:order-2 relative xs:w-[250px] overflow-hidden xs:self-center" style={float}>
<Image src={phone} alt=""  quality={100}/>
<Image src={ayesha} alt=""  quality={100} className="absolute  top-[90px] right-0 move  "/>
 </div>
 <div className="w-1/2 p-4  flex flex-col gap-5  items-start  px-20 xl:px-5 xl:self-start  xl:w-auto lg:order-1 xs:gap-2" style={{    transform: isInView ? "none" : "translateY(200px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 1.3s"}}>
<h1 className='text-[60px]  leading-[60px] text-white xl:text-[50px]  xl:leading-[50px]  md:text-3xl '>Keep in touch
<br/><span className='text-blue '>with your groups</span></h1>
<p className='text-white text-lg  leading-[25px] w-[500px] xl:text-base md:text-sm xs:w-full  '>Whether it{`'`}s planning an outing with friends or simply staying on top of your family chats, group conversations should feel effortless.
</p>
<Button blue to="/auth/sign-up" action="Get started"/>
</div>
    </section> );
}
 
export default Groups;
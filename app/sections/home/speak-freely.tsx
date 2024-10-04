"use client"
import Image from 'next/image';
import encrypt from './../../../public/images/encrypt.png'
import Button from '~/app/components/animated-buttons';
import { useInView } from "framer-motion";
import { useRef } from "react";
const SpeakFreely = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const float = {
        transform: isInView ? "none" : "translateY(200px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
      }
    return (<section className="flex items-center   bg-carbon xl:flex-col" ref={ref}>
<div className="w-1/2 p-4 flex items-end  justify-end  xl:self-start xl:w-auto lg:order-2" style={float}>
<Image src={encrypt} alt=""  quality={100}/>
 </div>

<div className="w-1/2 p-4  flex flex-col gap-5 items-start  px-20 xl:px-5 xl:self-end xl:w-auto lg:order-1 xs:gap-2" style={{    transform: isInView ? "none" : "translateY(200px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 1.3s"}}>
<h1 className='text-[60px]  leading-[60px] text-white xl:text-[50px]  xl:leading-[50px]  md:text-3xl '>Speak<br/><span className='text-blue '>freely</span></h1>
<p className='text-white text-lg  leading-[25px] w-[500px] xl:text-base md:text-sm xs:w-full  '>
With end-to-end encryption, your personal messages and calls are secured. Only you and the person you{`'`}re talking to can read or listen to them, and nobody in between, not even DaxApp.
</p>
<Button blue to="/auth/sign-up" action="Get started"/>
</div>
    </section>  );
}
 
export default SpeakFreely;
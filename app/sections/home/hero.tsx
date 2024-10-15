"use client"
import Image from "next/image";
import { motion } from "framer-motion";
import family from './../../../public/images/parents.png'
import Button from "~/app/components/animated-buttons";
import goodMorning from './../../../public/images/goodMorning.png'
import heart from './../../../public/images/heart.png'
import coffee from './../../../public/images/coffee.png'
import rec from './../../../public/images/rec.png'
import smile from './../../../public/images/smile.png'
import cry from './../../../public/images/cry.png'
import wait from './../../../public/images/wait.png'

const Hero = () => {
    return ( <section  className="w-full h-screen relative  p-8 bg-darkBlue  flex  items-center justify-center min-h-[650px] md:p-2 sm:h-[calc(70vh)]">
        
        <div className="w-full h-full relative flex  items-center justify-center"><Image src={family}quality={100}  alt="family" priority fill className="object-cover rounded-2xl z-10 object-top" />
        <div className="flex items-center relative z-20  justify-center  px-[100px]  py-10 w-full lg:px-[20px] md:px-4 md:justify-between sm:flex-col sm:items-start sm:p-4 sm:gap-5">
<div className="flex flex-col gap-20  items-start   w-1/2  lg:gap-5 sm:order-2 ">
    <div className="flex flex-col gap-5 items-start md:gap-3">
    <h1 className="text-white text-[80px] leading-[80px] lg:text-[60px] lg:leading-[60px] md:text-5xl">Message <br/>privately</h1>
    <p className="text-lg leading-[25px] text-white w-[350px] lg:w-[300px] lg:text-base md:text-sm ">
    Simple, reliable, private messaging and calling for free*, available all over the world
    </p>
    </div>
    <Button white  to="/auth/sign-up" action="Get started"/>
</div>
<div className="flex flex-col gap-4  items-start   w-1/2    w-[440px] lg:w-[300px] md:w-[250px] md:gap-2 sm:order-1 sm:w-[85%] sm:self-end">
<motion.div className="relative w-full" initial={{ visibility: 'hidden', opacity: 0, translateY: 20  }}
        animate={{ visibility: 'visible', opacity: 1 , translateY: 0}}
        transition={{ duration: 0.3}}>
<Image src={goodMorning} alt="chat"/>
<Image src={heart} alt="" className=" absolute -bottom-7 w-full sm:-bottom-4"/>
</motion.div>
<motion.div className="w-full" initial={{ visibility: 'hidden', opacity: 0, translateY: 20  }}
        animate={{ visibility: 'visible', opacity: 1 ,  translateY: 0}}
        transition={{ duration: 0.3, delay: 0.7 }}><Image src={coffee} alt="chat" className="w-full"/></motion.div>
        <motion.div className="w-full" initial={{ visibility: 'hidden', opacity: 0 ,  translateY: 20 }}
        animate={{ visibility: 'visible', opacity: 1, translateY: 0 }}
        transition={{ duration: 0.3, delay: 1.5 }}>
        <Image src={rec} alt="chat" className="w-full"/>
        </motion.div>

<motion.div className="relative w-full sm:hidden" initial={{ visibility: 'hidden', opacity: 0  ,  translateY: 20}}
        animate={{ visibility: 'visible', opacity: 1 ,  translateY: 0}}
        transition={{ duration: 0.3, delay: 2.5}}>
<Image src={smile} alt="chat"/>
<Image src={cry} alt="" className=" absolute -bottom-7 w-full"/>
</motion.div>
<motion.div className="w-full" initial={{ visibility: 'hidden', opacity: 0 , translateY: 20 }}
        animate={{ visibility: 'visible', opacity: 1,  translateY: 0 }}
        transition={{ duration: 0.3, delay: 3.5 }} >
<Image src={wait} alt="chat" className="w-full"/>
</motion.div>
</div>
        </div>
        </div>

    </section> );
}
 
export default Hero;
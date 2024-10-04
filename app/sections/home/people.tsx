'use client'
import Image from "next/image";
import people from './../../../public/images/people.png'
import bonjour from './../../../public/images/bonjour.png'
import { useInView } from "framer-motion";
import { useRef } from "react";
const People = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const float = {
        transform: isInView ? "none" : "translateY(200px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0s"
      }
    return ( <section className="flex flex-col gap-20 w-full bg-darkBlue  px-20 py-20 lg:py-10 lg:gap-10  md:px-5 sm:gap-5">
<Image src={people} alt="" style={float}  />
<p className="text-[48px] leading-[48px] text-dimWhite text-center font-[family-name:var(--font-mulish)] xl:text-[40px] lg:text-[35px] lg:leading-[35px] md:text-2xl xs:text-xl" ref={ref}>
With private messaging and calling, you can<br className="lg:hidden"/> be yourself, speak freely and feel close to the<br className="lg:hidden"/> most important people in your life no matter<br className="lg:hidden"/> where they are.
</p>

<Image src={bonjour} alt="" style={float}   />
    </section> );
}
 
export default People;
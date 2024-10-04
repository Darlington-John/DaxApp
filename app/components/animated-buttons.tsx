import Link from "next/link";

const Button = (props: any) => {
    return ( <>
    {props.grey && (
        <Link href={props.to} className="bubble flex items-center  h-[50px]  w-[130px]  text-center   justify-center  2xl:w-[100px] 2xl:h-[40px]  2xl:text-sm  text-white     text-base  rounded-[20px] text-center  
relative overflow-hidden z-[1]  transition duration-[0.5s] bg-[#9a9a9a66]  xs:w-[80px] ">
        {props.action}{[1, 2, 3, 4].map((key) => (
        <span key={key} className="bg-[#0AA0EA]"></span>
      ))}
     </Link>

    )}
     {props.blue && (
             <Link  href={props.to}  className="bubble-blue  flex items-center  h-[50px]  w-[130px]  text-center   justify-center 2xl:w-[100px] 2xl:h-[40px]  2xl:text-sm    
             text-[#091926] text-base  rounded-[20px] text-center relative  overflow-hidden   z-[1] transition duration-[0.5s] bg-[#0AA0EA] ">
              {props.action}<span ></span><span></span><span></span><span></span>
          </Link>
    )}
    {props.white && (
             <Link  href={props.to}  className="bubble-white  flex items-center  h-[50px]  w-[150px]  text-center   justify-center 2xl:w-[100px] 2xl:h-[40px]  2xl:text-sm    
             text-[#091926] text-base  rounded-[20px] text-center relative  overflow-hidden   z-[1] transition duration-[0.5s] bg-[#0AA0EA] ">
              {props.action}<span ></span><span></span><span></span><span></span>
          </Link>
    )}
    </> );
}
 
export default Button;
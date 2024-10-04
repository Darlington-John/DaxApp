"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, ChangeEvent, FormEvent, useEffect
} from 'react';
import doodle from './../../../public/images/doodle.jpg'
import me from './../../../public/images/me.png'
import { useRouter } from 'next/navigation';
interface FormData {
username: string;
  email: string;
  password: string;
  phone: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
username: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        window.location.href = '/dashboard'; 
       const data = await res.json();
       localStorage.setItem('token', data.token);
      } else {
        const error = await res.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard'); 
    }
  }, [router]);
  return (
    <div   className='relative flex items-center justify-center h-screen w-full  px-2'>
            <Link href="/" className="flex  items-center text-3xl font-[800] md:text-2xl  2xs:shrink-0  absolute top-3 left-4 z-40 bg-darkBlue p-2 rounded-md gap-1">

    <Image src={me} alt="" className="w-5 xs:w-4 xs:w-3"/>
<h1 className="font-bold  font-[family-name:var(--font-mulish-bold)] text-blue text-2xl  xs:text-xl">
    DaxApp
</h1>
</Link>
            <Image    src={doodle}
fill
priority={true} alt='' className='object-cover'/>
<div className='relative  z-40  bg-darkBlue  px-4 py-10 flex flex-col  w-[500px] rounded-2xl border border-2 border-[#394E60]  gap-3 shadow-lg  xs:gap-6'>
<div>
      <h1 className='text-3xl font-bold text-center text-blue leading-none'>Welcome  to DaxApp</h1>
      <h1 className='text-sm font-semibold text-center text-lightGrey'>Please enter details to sign up.</h1>
      </div>
<form onSubmit={handleSubmit} className='flex flex-col gap-2'>
  <div className='flex items-center gap-2'>
  <div className="flex flex-col  w-full text-white gap-1">
        <label htmlFor="username" className="text-sm font-semibold">Username:</label>
        <input
         type="text"
         name="username"
         value={formData.username}
         onChange={handleChange}
         placeholder="Username"
         required
           className={`text-sm font-semibold  outline-none px-2 py-3 rounded-md rounded-md  w-full  bg-deepBlue  focus:ring-2  ring-blue`}
      />

          </div>
          <div className="flex flex-col  w-full text-white gap-1">
        <label htmlFor="username" className="text-sm font-semibold">Phone number:</label>
        <input
         type="number"
         name="phone"
         value={formData.phone}
         onChange={handleChange}
         placeholder="phone"
         required
           className={`text-sm font-semibold  outline-none px-2 py-3 rounded-md rounded-md  w-full  bg-deepBlue  focus:ring-2  ring-blue`}
      />

          </div>
  </div>

<div className="flex flex-col  w-full text-white gap-1">
        <label htmlFor="email" className="text-sm font-semibold">Email:</label>
        <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
           className={`text-sm font-semibold  outline-none px-2 py-3 rounded-md rounded-md  w-full  bg-deepBlue focus:ring-2  ring-blue`}
      />

          </div>

<div className='flex flex-col  w-full text-white gap-1'>
<label htmlFor="email" className="text-sm font-semibold">Password:</label>
          <div className={` flex gap-2  rounded-md pr-2   `}>
            
        <input
  name="password"
  value={formData.password}
  onChange={handleChange}
  placeholder="Password"
  required
          className={`text-sm font-semibold  outline-none px-2 py-3 rounded-md rounded-md  w-full text-white   bg-deepBlue focus:ring-2  ring-blue`}
          type={isPasswordVisible ? 'text' : 'password'}
      />
      <button   onClick={handleTogglePasswordVisibility}  type="button">
      <img
       alt=""  src={isPasswordVisible ?'/icons/eye-close.svg' : '/icons/eye-open.svg'}

className="w-5  h-5"
   />
      </button>
      </div>
      </div>
      <div className='flex items-center justify-between  pt-2'>
        <button type="submit" className='bg-blue  text-darkBlue  text-sm font-semibold py-2 w-[100px]  rounded-full hover:bg-darkBlue hover:ring hover:ring-blue  hover:text-blue   transition duration-300 ease-out'>Sign up</button>

        <Link href="/auth/log-in" className='text-xs text-lightGrey '>Already  have an account?</Link>
        
        </div>
    </form>
</div>

    </div>
  );
}

"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import doodle from './../../../public/images/doodle.jpg'
import me from './../../../public/images/me.png'
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading]= useState(false);
  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const check = !(
    email &&
  password
  );
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(check){
      setLoading(false)
    }
    else{
      setLoading(true)
    }
    try {
      const res = await fetch('/api/log-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setLoading(false)
        const data = await res.json();
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard'; 
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed');
        setLoading(false)
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false)
    }
  };
  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard'); 
    }
  }, [router]);
  return (
    <div className='relative flex items-center justify-center h-screen w-full  px-2 ' >
     <Link href="/" className="flex  items-center text-3xl font-[800] md:text-2xl  2xs:shrink-0  absolute top-3 left-4 z-40 bg-darkBlue p-2 rounded-md gap-1">

<Image src={me} alt="" className="w-5 xs:w-4 xs:w-3"/>
<h1 className="font-bold  font-[family-name:var(--font-mulish-bold)] text-blue text-2xl  xs:text-xl">
DaxApp
</h1>
</Link>
      <Image    src={doodle}
fill
priority={true} alt='' className='object-cover'/>
<div className='relative  z-40  bg-darkBlue  px-4 py-10 flex flex-col  w-[400px] rounded-2xl border border-2 border-deepBlue  gap-3 shadow-lg '>
  <div>
      <h1 className='text-3xl font-bold text-center text-blue  leading-none'>Welcome back!</h1>
      <h1 className='text-sm font-semibold text-center  text-lightGrey'>Please enter details to sign in.</h1>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
      <div className="flex flex-col  w-full text-white gap-1">
        <label htmlFor="email" className="text-sm font-semibold">Email:</label>
        <input
        type="email"
        value={email}

        placeholder="Email"
        required

        onChange={(e) => {
          setEmail(e.target.value);
           setError(''); 
        }}
           className={`text-sm font-semibold  outline-none px-2 py-3 rounded-md rounded-md  w-full  bg-deepBlue  focus:ring-2  ring-blue   ${error ===`Sorry, we couldn't find an account with that email address.` ? ' border border-red text-red': '  text-white'}`}
      />
            {error  ===`Sorry, we couldn't find an account with that email address.` && (      <h1 className='text-xs  text-red'>{error}</h1>)}

          </div>
          <div className="flex flex-col  w-full text-darkGrey gap-1">
        <label htmlFor="password" className="text-sm font-semibold text-white">Password:</label>
        <div className={` flex gap-2  rounded-md pr-2   `}>
        <input
  value={password}
onChange={(e) =>{setPassword(e.target.value); setError('')}}
  placeholder="Password"
        required
          className={`text-sm font-semibold  outline-none px-2 py-3 rounded-md rounded-md  w-full text-sm font-semibold  outline-none px-2 py-3 rounded-md rounded-md  w-full  bg-deepBlue  focus:ring-2  ring-blue  ${error ==='Incorrect password' ? 'text-red ': ' text-white'}`}
          type={isPasswordVisible ? 'text' : 'password'}
      />
      <button   onClick={handleTogglePasswordVisibility}  type="button">
      <img
       alt=""  src={isPasswordVisible ?'/icons/eye-close.svg' : '/icons/eye-open.svg'}

className="w-5  h-5"
   />
      </button>
      </div>
      {error  ==='Incorrect password' && (      <h1 className='text-xs text-red'>{error}</h1>)}
          </div>
          <div className='flex items-center justify-between  pt-2'>
        <button type="submit" className='bg-blue  text-darkBlue  text-sm font-semibold py-2 w-[100px]  rounded-full hover:bg-darkBlue hover:ring hover:ring-blue  hover:text-blue   transition duration-300 ease-out'  disabled={check}>{loading?(<img src={'/images/doubleWhite.gif'} alt="" className='w-5 mx-auto'/>): 'Login'}</button>
        <Link href="/auth/sign-up" className='text-xs text-lightGrey '>Don{`'`}t  have an account?</Link>
        </div>
      </form>
      </div>
    </div>
  );
};

export default LoginPage;

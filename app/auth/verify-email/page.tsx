"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import loadingGif from '~/public/images/doubleWhite.gif'

const VerifyEmail = () => {
  const [error, setError] = useState('');
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState('');
const [isVerifying, setIsVerifying]= useState(false);
const [email, setEmail] = useState<string | null>(null);


useEffect(() => {
    // This will only run on the client side
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setError('Email not found. Please go back to sign up.');
    }
  }, []);

const handleVerify = async () => {
  if (!email) {
    setError('Email not found. Please go back to sign up.');
    return;
  }

  setIsVerifying(true);
  try {
    const response = await fetch('/api/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, verificationCode }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.removeItem('email');
      window.location.href = '/dashboard';

    } else {
      setError(data.error || 'Verification failed');
    }
  } catch (error) {
    setError('An error occurred during verification');
  } finally {
    setIsVerifying(false);
  }
};
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard'); 
    }
  }, [router]);

  return (



    <div className='relative  z-40  bg-darkBlue  px-4 py-10 flex flex-col  w-[400px] rounded-2xl border border-2 border-deepBlue  gap-3 shadow-lg '>
  <div className='flex flex-col gap-3 '>
      <h1 className='text-3xl font-bold text-center text-blue  leading-none'>Please check your email</h1>
      <h1 className='text-sm font-semibold text-center  text-lightGrey'>We've sent a code to  your mail</h1>
      </div>
<div className='flex flex-col gap-2'>
<div className="flex flex-col  w-full text-white gap-6">
        <input
           className={`text-sm font-semibold  outline-none px-2 py-3 rounded-md rounded-md  w-full  bg-deepBlue  focus:ring-2  ring-blue   ${error  ? ' border border-red text-red': '  text-white'}`}
           type="text"
           value={verificationCode}
           onChange={(e) => setVerificationCode(e.target.value)}
           placeholder="Enter the code"
      />
            {error && (      <h1 className='text-xs  text-red'>{error}</h1>)}
<button onClick={handleVerify} className='bg-blue  text-darkBlue  text-sm font-semibold py-2 w-full   rounded-md hover:bg-darkBlue hover:ring hover:ring-blue  hover:text-blue   transition duration-300 ease-out h-[40px]  'disabled={isVerifying}>
{isVerifying?(<Image src={loadingGif } alt="" className='w-5 mx-auto' />): 'Sign up'}
</button>
<h1 className='text-sm text-lightGrey text-center'>Did'nt recieve an email? <span className='text-sm font-bold text-white'>Resend</span></h1>
          </div>
</div>
 
      </div>
  );
};

export default VerifyEmail;

"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import loadingGif from '~/public/images/doubleWhite.gif'

const VerifyEmail = () => {
    const [error, setError] = useState('');
    const router = useRouter();
    const [isVerifying, setIsVerifying] = useState(false);
    const [email, setEmail] = useState<string | null>(null);
    const [verificationCode, setVerificationCode] = useState(Array(6).fill('')); 
  
    useEffect(() => {
      const storedEmail = localStorage.getItem('email');
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        setError('Email not found. Please go back to sign up.');
      }
    }, []);
    const isVerificationCodeComplete = () => {
        return verificationCode.every((digit) => digit.length === 1);
      };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        setError('')
      const value = e.target.value;
  
      
      if (/^[0-9]$/.test(value) || value === '') {
        const newCode = [...verificationCode];
        newCode[index] = value; 
        setVerificationCode(newCode);
  
        
        if (value && index < 5) {
          document.getElementById(`code-input-${index + 1}`)?.focus();
        }
      }
    };
  
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      
      if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
        document.getElementById(`code-input-${index - 1}`)?.focus();
      }
    };
  
    const handleVerify = async () => {
      if (!email) {
        setError('Email not found. Please go back to sign up.');
        return;
      }
      if (!isVerificationCodeComplete()) { // Check if the verification code is complete
        setError('Please enter all 6 digits of the verification code.');
        return;
      }
      setIsVerifying(true);
      try {
        const codeString = verificationCode.join(''); 
        const response = await fetch('/api/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, verificationCode: codeString }),
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
      <div className='relative z-40 bg-darkBlue px-4 py-10 flex flex-col w-[400px] rounded-2xl border border-2 border-deepBlue gap-8 shadow-lg'>
        <div className='flex flex-col gap-5'>
          <h1 className='text-3xl font-bold text-center text-blue leading-none'>Please check your email</h1>
          <h1 className='text-sm font-semibold text-center text-lightGrey'>We've sent a code to your mail</h1>
        </div>
        <div className='flex flex-col gap-6'>
          <div className="flex justify-between gap-2 w-full text-white">
            {verificationCode.map((digit, index) => (
              <input
                key={index + 1}
                id={`code-input-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                className={`text-base font-semibold outline-none px-2 py-3 rounded-md w-full bg-deepBlue text-center focus:ring-2 ring-blue ${error ? 'border border-red text-red' : 'text-white'}`}
              />
            ))}
          </div>
          {error && <h1 className='text-xs text-red'>{error}</h1>}
          <button onClick={handleVerify} className={`bg-blue text-darkBlue text-sm font-semibold py-2 w-full rounded-md hover:bg-darkBlue hover:ring hover:ring-blue hover:text-blue transition duration-300 ease-out h-[40px] ${isVerificationCodeComplete()?'opacity-100':'opacity-40'}`} disabled={isVerifying || !isVerificationCodeComplete()}>
            {isVerifying ? <Image src={loadingGif} alt="Loading..." className='w-5 mx-auto' /> : 'Verify'}
          </button>
        </div>
      </div>
    );
  };
  
  export default VerifyEmail;

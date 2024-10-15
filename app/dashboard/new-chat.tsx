'use client'
import Image from 'next/image';
import back from './../../public/icons/back.svg'
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useUser } from '~/app/context/auth-context';
import { setActiveButton } from '~/store/buttonSlice';
import loading from './../../public/images/load.gif'
import { useScreenSize } from '~/utils/useScreenSize';
import { setActiveView } from '~/store/viewSlice';
const NewChat = () => {
  const { user } = useUser();
  const activeButtonIndex = useSelector((state: any) => state.buttons.activeButtonIndex);
  const activeViewIndex = useSelector((state: any) => state.views.activeViewIndex);
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [adding, setAdding] = useState(false);
  const currentUserId = user?._id


  const handleAddContact = async () => {
    if (!phone) {
      setMessage('Please enter a phone number.');
      return;
    }
    if (adding) return;
    setAdding(true);
    try {
      const res = await fetch('/api/add-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone, // phone number to search for
          currentUserId, // current logged-in user's ID
        }),
      });

      const data = await res.json();

      if (res.status === 200) {
        setMessage(data.message);
        setAdding(false);
        setTimeout(() => {
          dispatch(setActiveButton(0));
        }, 2000);

      } else {
        setMessage(data.message + '');
        setAdding(false);
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    }
  };
  const dispatch = useDispatch();
  const handleClick = (index: number) => {
    dispatch(setActiveButton(index));
  };
  const isScreenLarge = useScreenSize(640); 
  const shouldRender = () => {
    if (isScreenLarge) {
      return activeButtonIndex === 0.1;
    } else {
      return activeViewIndex === 0.1;
    }
  };
  const handleViewClick = (index: number) => {
    dispatch(setActiveView(index));
  };
  return (
    shouldRender() && (<div className="flex flex-col gap-6 px-4 w-full">
      <div className="flex items-center  gap-4 md:gap-2">
        <Image src={back} alt="" className="w-6 cursor-pointer  md:w-4" onClick={() => {
        if (isScreenLarge) {
          handleClick(0); 
        } else {
          handleViewClick(0); 
        }
      }} />
        <h1 className="text-base  text-dimWhite  md:text-sm">New Chat
        </h1>
      </div>
      <div className='flex flex-col gap-2  w-full'>
        <div className='flex items-center gap-2 '>
          <input
            type="number"
            placeholder="Enter phone number"
            className='text-sm font-semibold  outline-none px-2 py-2 rounded-md rounded-md  w-full  bg-deepBlue  focus:ring-2  ring-blue text-white '
            min={10000000000}
            max={99999999999}
            onInput={(e: any) => {
              const value = e.target.value;
              if (value.length > 11) {
                e.target.value = value.slice(0, 11); // Limit input to 11 digits
              }
            }}
            onChange={(e) => {
              setPhone(e.target.value);
              setMessage('');
            }}
            value={phone}

          />

          <button onClick={handleAddContact} className={`  text-darkBlue  text-sm font-semibold py-2   rounded-md  hover:bg-darkBlue hover:ring hover:ring-blue  hover:text-blue   transition duration-300 ease-out px-4 ${adding ? 'bg-deepBlue' : 'bg-blue'}`} disabled={adding}>   {adding ? <Image src={loading} alt="" className="w-5   cursor-pointer mx-auto" /> : 'Add'}</button>
        </div>
        {message === 'User not found.' && (<div className='flex flex-col text-dimWhite text-sm items-center w-full'>
          <h1 className='text-sm  bold '>No results</h1>
          <h1 className='text-sm norm'>This number is not on DaxApp</h1>
        </div>)}
        {message === 'User is already in contacts.' && (<div className='flex flex-col text-dimWhite text-sm items-center w-full'>
          <h1 className='text-sm  bold '>In contacts</h1>
          <h1 className='text-sm norm'>This number is in your contacts</h1>
        </div>)}
        {message === 'Internal server error.' && (<div className='flex flex-col text-dimWhite text-sm items-center w-full'>
          <h1 className='text-sm  bold '>Error</h1>
          <h1 className='text-sm norm'>An error occured, try again</h1>
        </div>)}
        {message === 'Users added to each other\'s contacts successfully.' && (<div className='flex flex-col text-dimWhite text-sm items-center w-full'>
          <h1 className='text-sm  bold '>Sucess</h1>
          <h1 className='text-sm norm'>Contact added successfully</h1>
        </div>)}
      </div>

    </div>)
  );
}

export default NewChat;




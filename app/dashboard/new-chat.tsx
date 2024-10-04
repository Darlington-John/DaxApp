'use client'
import Image from 'next/image';
import back from './../../public/icons/back.svg'
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useUser } from '~/app/context/auth-context';
import { setActiveButton } from '~/store/buttonSlice';
const NewChat = () => {
    const {user} = useUser();
    const activeButtonIndex = useSelector((state: any) => state.buttons.activeButtonIndex);
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [userDetails, setUserDetails] = useState<any>(null);
  const currentUserId = user?._id
    const handleAddContact = async () => {
      if (!phone) {
        setMessage('Please enter a phone number.');
        return;
      }
  
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
          setUserDetails(data.user);
        } else {
          setMessage(data.message + '') ;
          setUserDetails(null);
        }
      } catch (error) {
        setMessage('Something went wrong. Please try again.');
      }
    };
    const dispatch = useDispatch();
    const handleClick = (index: number) => {
      dispatch(setActiveButton(index));
    };
    return (
        activeButtonIndex === 0.1 &&(<div className="flex flex-col gap-6 px-4 w-full"> 
            <div className="flex items-center  gap-4">
            <Image src={back} alt="" className="w-6 cursor-pointer" onClick={() => handleClick(0)}/>
            <h1 className="text-base  text-dimWhite ">New Chat
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
      <button onClick={handleAddContact} className='bg-blue  text-darkBlue  text-sm font-semibold py-2   rounded-md  hover:bg-darkBlue hover:ring hover:ring-blue  hover:text-blue   transition duration-300 ease-out px-4'>Add</button>
    </div>
    {message ==='User not found.'&&(<div className='flex flex-col text-dimWhite text-sm items-center w-full'>
      <h1 className='text-sm  bold '>No results</h1>
      <h1 className='text-sm norm'>This number is not on DaxApp</h1>
    </div>)}
    {message ==='User is already in contacts.'&&(<div className='flex flex-col text-dimWhite text-sm items-center w-full'>
      <h1 className='text-sm  bold '>In contacts</h1>
      <h1 className='text-sm norm'>This number is in your contacts</h1> 
    </div>)}
    {message ==='Internal server error.'&&(<div className='flex flex-col text-dimWhite text-sm items-center w-full'>
      <h1 className='text-sm  bold '>Error</h1>
      <h1 className='text-sm norm'>An error occured, try again</h1>
    </div>)}
    {message ==='Users added to each other\'s contacts successfully.'&&(<div className='flex flex-col text-dimWhite text-sm items-center w-full'>
      <h1 className='text-sm  bold '>Sucess</h1>
      <h1 className='text-sm norm'>Contact added successfully</h1>
    </div>)}
                </div>
      
            </div>)
          );
}
 
export default NewChat;




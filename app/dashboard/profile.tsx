"use client"
import Image from 'next/image';

import ColorThief from 'colorthief';
import defaultUser from './../../public/icons/default-user.svg'
import { useSelector } from 'react-redux';
import { useUser } from '~/app/context/auth-context';
import { useEffect, useRef, useState } from 'react';
import xMark from './../../public/icons/xmark.svg'
import clip from './../../public/icons/paperclip.svg'
import load from './../../public/images/doubleWhite.gif'
import edit from './../../public/icons/edit.svg'
import acct from './../../public/icons/account.svg'
import mail from './../../public/icons/mail.svg'
import phone from './../../public/icons/phone.svg'
import logout from '~/public/icons/log-out.svg'
import { usePopup } from '~/utils/togglePopups';
import { useScreenSize } from '~/utils/useScreenSize';
const Profile = () => {
    const activeButtonIndex = useSelector((state: any) => state.buttons.activeButtonIndex);
const {loading, user} =useUser();
const { isVisible: isEditImageVisible, isActive: editImage,  ref: editImageRef, togglePopup: toggleEditImagePopup} = usePopup();
const { isVisible: isEditNameVisible, isActive: editName,  ref: editNameRef, togglePopup: toggleEditNamePopup} = usePopup();


const [file, setFile] = useState<File | null>(null);
const [uploading, setUploading] = useState(false);
const [imageUrl, setImageUrl] = useState<string | null>(null);
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0];
  if (selectedFile) {
    setFile(selectedFile);

    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string); 
    };
    reader.readAsDataURL(selectedFile); 
  }
};

const handleUpload = async () => {
  
  if (!file) {

    return;
  }

  setUploading(true);

  const formData = new FormData();
  formData.append('file', file);

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/upload-profile', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
 
      setImageUrl(data.url);
      toggleEditImagePopup();
    } else {
      alert(`Upload failed: ${data.error}`);
    }
  } catch (error) {
    console.error('Upload error:', error);
    alert('An error occurred while uploading the file.');
  } finally {
    setUploading(false);
  }
};
const fileInputRef = useRef<HTMLInputElement | null>(null);

const handleClick = () => {
  if (fileInputRef.current) {
    fileInputRef.current.click();
  }
};
const [bgColor, setBgColor] = useState('#b6a7c5');
useEffect(() => {
  if (typeof window !== 'undefined'){
  const getColor = async () => {
    const colorThief = new ColorThief();
    const img = document.createElement('img');
    img.src =user?.profile? user.profile: '/icons/default-user.svg';
    img.crossOrigin = 'Anonymous'; // Enable CORS
img.onload = () => {
  const dominantColor = colorThief.getColor(img);

  // Convert to RGB format
  const rgbColor = `rgb(${dominantColor.join(', ')})`;
  setBgColor(rgbColor);
  };
  };
  getColor();
}
}, [ user?.profile? user.profile: '/icons/default-user.svg']);
const updateName = async (newUserName: string) => {
  try {
    const token = localStorage.getItem('token'); 

    const res = await fetch('/api/update-name', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ username: newUserName}),
    });

    const data = await res.json();

    if (res.ok) {
      toggleEditNamePopup();
    } else {
      console.error('Failed to update name:', data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
const [username, setUsername] = useState('');
  const [loaderVisible, setLoaderVisible] = useState(false);
  const handleUpdate = async () => {
    setLoaderVisible(true); 
  
    try {
      await updateName(username);
  
      
    
    } catch (error) {
      console.error('Failed to update name:', error);
      
    } finally {
      setLoaderVisible(false); 
    }
  };
  const activeViewIndex = useSelector((state: any) => state.views.activeViewIndex);
  const isScreenLarge = useScreenSize(640); 
  const shouldRender = () => {
    if (isScreenLarge) {
      return activeButtonIndex === 2;
    } else {
      return activeViewIndex === 2;
    }
  };

  const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

if (!isMounted) {
  return null;
}
    return (
        <>
        {shouldRender() &&(
          <>
                  <div className="flex flex-col gap-6 px-4 w-full overflow-auto"> 
        <div className="flex items-center justify-between w-full ">
        <h1 className="text-[22px] font-bold text-dimWhite font-[family-name:var(--font-mulish-bold)]">Profile 
            </h1>
        </div>
        </div>
            <div className='flex flex-col gap-5    w-full'>
             <div className='flex flex-col gap-2    items-center justify-center relative py-16'>
<div className=' absolute w-full h-[65%] self-start flex top-0 z-20' style={{ backgroundColor: bgColor }}>
<button className='absolute bottom-4 bg-darkBlue right-4 p-3 rounded-full   hover:ring hover:ring-blue  hover:ring-2 z-30 '  onClick={toggleEditImagePopup} >
                <Image src={edit} alt='' className='w-6'/>
              </button>
</div>
<button className=' items-center justify-center  flex  relative z-20' onClick={toggleEditImagePopup} >
{loading ? null: <img src={user?.profile? user.profile: '/icons/default-user.svg'}  crossOrigin="anonymous"      alt="" className="w-40 rounded-full object-cover h-40  ring ring-8 ring-darkBlue"/>}
</button>
</div>
<div className='flex flex-col gap-6 w-full px-2'>
<div className='flex  items-start justify-between gap-4'>
<div className='flex items-start gap-5 '>
<Image src={acct} className='w-7' alt=''/>

<h1 className='text-dimWhite text-base'>{user?.username}</h1>

</div>
<Image src={edit} className='w-6' alt=''  onClick={toggleEditNamePopup}/>
</div>
<div className='flex  items-start justify-between gap-4'>
<div className='flex items-start gap-5 '>
<Image src={phone} className='w-7' alt=''/>

<h1 className='text-dimWhite text-base'>{user?.phone}</h1>
</div>
</div>
<div className='flex  items-start justify-between gap-4'>
<div className='flex items-start gap-5 '>
<Image src={mail} className='w-7' alt=''/>

<h1 className='text-dimWhite text-base'>{user?.email}</h1>
</div>
</div>

<p className='text-xs text-dimGrey'>Name and phone number will be visible to all<br/> your DaxApp contacts</p>
<button className='flex  items-start justify-between gap-4 w-full py-4   border-t  border-deepBlue' onClick={async () => {
            localStorage.removeItem('token');
            window.location.href = '/auth/log-in'; 
          }} >
<div className='flex items-start gap-5 ' >
<Image src={logout} className='w-7' alt=''/>

<h1 className='text-dimWhite text-base'>Logout</h1>
</div>
</button>
</div>
            </div>
            </>
        )}
        {editImage && (
       <div className={`fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-4 `}>

       <div className={`w-[300px]  rounded-2xl   pop  duration-300 ease-in-out 2xs:w-full bg-deepBlue  flex flex-col  items-center gap-6 pt-8  pb-6  px-5 relative   ${isEditImageVisible ? '' : 'pop-hidden'}`} ref={editImageRef} >
        <button className='  h-8 w-8 rounded-full flex items-center justify-center absolute top-2 right-2' onClick={toggleEditImagePopup}>
<Image src={xMark} alt='' className='w-3'/>
        </button>
       <div className='flex w-full flex-col  items-center justify-center gap-4'>
       <div className='flex items-center justify-center h-40 w-40  rounded-full  text-white text-6xl    font-bold  xs:h-32 xs:w-32  xs:text-5xl relative readingBook overflow-hidden'>

{imageUrl ? (
      <div className="w-full h-full relative overflow-hidden rounded-full readingBook">
        <img src={imageUrl} alt="Selected Profile Preview" className="w-full h-full object-cover" />
      </div>
    ) : (

         <Image src={defaultUser} alt="Current Profile" className="w-full h-full object-cover" />
      
    )}

   
</div>
<h1 className='text-lg text-lightGrey  font-medium text-center'>
      {user.profile? 'Change profile photo': 'Upload profile photo'}
    </h1>
</div>
<div className='w-full  items-center  justify-between flex'>
<button className='bg-darkBlue  h-[40px] px-4 text-sm font-semibold text-blue  rounded-lg  flex gap-1 items-center justify-center  hover:ring-1 ring-blue  duration-300 ease-out  ' onClick={handleClick}>
  <span>File</span>
<Image src={clip} className='w-3' alt=""/>
</button>
   <button onClick={handleUpload} disabled={!file} className='bg-blue  hover:ring-2  ring-blue  duration-300 ease-out flex items-center justify-center text-center text-sm  h-[40px] w-[90px] rounded-lg text-darkBlue  ring-offset-[2px] outline-[0px]'>
        {uploading ? (<Image src={load} alt="" className='w-5'/>) : 'Upload'}
      </button>
</div>
       <input type="file" onChange={handleFileChange}    ref={fileInputRef} className='hidden' />
   
         </div>
         </div>
            )}
{editName && (
       <div className={`fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8   xs:items-end  xs:px-0 `}>
       <div className={`w-[400px]  rounded-2xl   pop  duration-300 ease-in-out xs:w-full  bg-darkBlue ring ring-blue  ring-1   ${isEditNameVisible ? '' : 'pop-hidden'}`} ref={editNameRef} >
       <div  className="flex flex-col p-4 gap-3">
        <div className="flex flex-col gap-1">
        <h1 className="text-sm font-semibold text-dimWhite">Name:</h1>
          <input
      value={username}
      onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter new name"
            className="text-sm text-white  font-semibold bg-deepBlue  focus:ring-2  ring-blue  outline-none px-2 py-3 rounded-md "
          />
          </div>

      <div className="w-full items-center justify-between flex pt-3">
          <button onClick={handleUpdate} className="hover:bg-blue  hover:ring ring-blue  hover:ring-1   ring-offset-1   px-4 py-3 rounded-2xl text-white  text-sm font-semibold ease-out duration-300 bg-blue ">{loaderVisible ? (<Image src={load} className="w-6" alt=""/>): 'Update'}</button>
          <button type="button" className="  px-4 py-3 rounded-2xl text-dimWhite text-sm font-semibold hover:bg-deepBlue   ease-out duration-300"  onClick={toggleEditNamePopup}>Cancel</button>
          </div>
        </div>
         </div>
         </div>
            )}
            </>  );
}
 
export default Profile;
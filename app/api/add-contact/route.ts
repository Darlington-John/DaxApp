import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import connectMongo from '~/lib/mongodb';
import User from '~/models/User';

export async function POST(req: Request) {
  await connectMongo();

  const { phone, currentUserId } = await req.json(); 

  if (!phone || !currentUserId) {
    return NextResponse.json({ message: 'Phone number and current user ID are required.' }, { status: 400 });
  }

  try {
    
    const userToAdd:any = await User.findOne({ phone });

    if (!userToAdd) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    
    const currentUser:any = await User.findById(currentUserId);

    if (!currentUser) {
      return NextResponse.json({ message: 'Current user not found.' }, { status: 404 });
    }

    
    const isAlreadyInContacts = currentUser.contacts.some((contact: any) => 
      contact.user.toString() === userToAdd._id.toString()
    );

    if (isAlreadyInContacts) {
      return NextResponse.json({ message: 'User is already in contacts.' }, { status: 400 });
    }

    
    currentUser.contacts.push({
      user: userToAdd._id as mongoose.Types.ObjectId,  
      messages: []          
    
    });
    
    await currentUser.save();

    
    const isCurrentUserInTheirContacts = userToAdd.contacts.some((contact: any) => 
      contact.user.toString() === currentUser._id.toString() 
    );

    if (!isCurrentUserInTheirContacts) {
      userToAdd.contacts.push({
        user: currentUser._id as mongoose.Types.ObjectId,  
        messages: []            
      });

      await userToAdd.save();
    }

    return NextResponse.json({ message: 'Users added to each other\'s contacts successfully.' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}

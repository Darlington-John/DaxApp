import { NextRequest, NextResponse } from 'next/server';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const { userId, receiverNumber, message, reply} = await req.json();

    
    const sender = await User.findOne({ phone: userId });
    const receiver = await User.findOne({ phone: receiverNumber });

    if (!sender || !receiver) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    
    let senderContact = sender.contacts.find(
      (contact: any) => String(contact.user) === String(receiver._id)
    );
    
    if (!senderContact) {
      sender.contacts.push({ user: receiver._id as mongoose.Types.ObjectId, messages: [] });
      senderContact = sender.contacts[sender.contacts.length - 1];  
    }
    
    let receiverContact = receiver.contacts.find(
      (contact: any) => String(contact.user) === String(sender._id)
    );

    if (!receiverContact) {
      receiver.contacts.push({ user: sender._id as mongoose.Types.ObjectId, messages: [] });
      receiverContact = receiver.contacts[receiver.contacts.length - 1];
    }

    
    const newMessage:any = {
      sender: sender._id,
      receiver: receiver._id,
      content: message,
      replyingTo: reply || null,

      read: false,  
    };

    
    senderContact.messages.push(newMessage);
    receiverContact.messages.push(newMessage);

    
    await sender.save();
    await receiver.save();

    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

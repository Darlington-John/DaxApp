
import { NextRequest, NextResponse } from 'next/server';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';

export async function PATCH(req: NextRequest) {
  try {
    await connectMongo();

    const { receiverId, senderPhone } = await req.json();

    
    const receiver:any = await User.findById(receiverId);
    if (!receiver) {
      return NextResponse.json({ error: 'Receiver not found' }, { status: 404 });
    }

    
    const sender:any = await User.findOne({ phone: senderPhone });
    if (!sender) {
      return NextResponse.json({ error: 'Sender not found' }, { status: 404 });
    }

    
    const receiverContactIndex = receiver.contacts.findIndex(
      (contact: any) => contact.user.toString() === sender._id.toString()
    );
    const senderContactIndex = sender.contacts.findIndex(
      (contact: any) => contact.user.toString() === receiverId
    );

    if (receiverContactIndex === -1 || senderContactIndex === -1) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    
    receiver.contacts[receiverContactIndex].messages.forEach((message: any) => {
      if (!message.read && message.sender.toString() === sender._id.toString()) {
        message.read = true;
      }
    });

    
    sender.contacts[senderContactIndex].messages.forEach((message: any) => {
      if (!message.read && message.sender.toString() === sender._id.toString()) {
        message.read = true;
      }
    });

    
    await receiver.save();
    await sender.save();

    return NextResponse.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
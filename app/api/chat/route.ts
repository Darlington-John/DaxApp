
import { NextRequest, NextResponse } from 'next/server';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const { userId, receiverNumber, message, reply } = await req.json();

    
    const sender = await User.findOne({ phone: userId });
    const receiver = await User.findOne({ phone: receiverNumber });

    if (!sender || !receiver) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    
    const senderContactIndex = sender.contacts.findIndex(
      (contact: any) => contact.phone === receiverNumber
    );
    const receiverContactIndex = receiver.contacts.findIndex(
      (contact: any) => contact.phone === userId
    );

    
    receiver.contacts[receiverContactIndex].messages.push({
      content: message,
      sender: userId, 
      receiver: receiverNumber, 
      read: false, 
      replyingTo: reply,
    });

    sender.contacts[senderContactIndex].messages.push({
      content: message,
      sender: userId, 
      receiver: receiverNumber, 
      read: false, 
      replyingTo: reply,
    });

    
    await sender.save();
    await receiver.save();

    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

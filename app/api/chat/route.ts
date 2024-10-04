// /api/chat.ts
import { NextRequest, NextResponse } from 'next/server';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const { userId, receiverNumber, message } = await req.json();

    // Find sender and receiver users
    const sender = await User.findOne({ phone: userId });
    const receiver = await User.findOne({ phone: receiverNumber });

    if (!sender || !receiver) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find contact index in both sender and receiver contact lists
    const senderContactIndex = sender.contacts.findIndex(
      (contact: any) => contact.phone === receiverNumber
    );
    const receiverContactIndex = receiver.contacts.findIndex(
      (contact: any) => contact.phone === userId
    );

    // Add message to both sender and receiver
    receiver.contacts[receiverContactIndex].messages.push({
      content: message,
      sender: userId, // The sender's phone
      receiver: receiverNumber, // The receiver's phone
      read: false, // The receiver hasn't read the message yet
    });

    sender.contacts[senderContactIndex].messages.push({
      content: message,
      sender: userId, // The sender's phone
      receiver: receiverNumber, // The receiver's phone
      read: false, // Sender also marks it as unread for now
    });

    // Save updates to both users
    await sender.save();
    await receiver.save();

    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

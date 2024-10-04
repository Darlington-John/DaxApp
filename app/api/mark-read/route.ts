// /api/chat/mark-read.ts
import { NextRequest, NextResponse } from 'next/server';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';

export async function PATCH(req: NextRequest) {
  try {
    await connectMongo();

    const { receiverId, senderPhone } = await req.json();

    // Find the receiver user (the one opening the message)
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return NextResponse.json({ error: 'Receiver not found' }, { status: 404 });
    }

    // Find the sender (who sent the message) by their phone number
    const sender = await User.findOne({ phone: senderPhone });
    if (!sender) {
      return NextResponse.json({ error: 'Sender not found' }, { status: 404 });
    }

    // Find the message between the receiver and sender in both contacts
    const receiverContactIndex = receiver.contacts.findIndex(
      (contact: any) => contact.phone === senderPhone
    );
    const senderContactIndex = sender.contacts.findIndex(
      (contact: any) => contact.phone === receiver.phone
    );

    if (receiverContactIndex === -1 || senderContactIndex === -1) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Mark all unread messages from the sender as read in the receiver's array
    receiver.contacts[receiverContactIndex].messages.forEach((message: any) => {
      if (!message.read && message.sender === senderPhone) {
        message.read = true; // Mark as read on the receiver's side
      }
    });

    // Mark the same messages as read in the sender's contact array
    sender.contacts[senderContactIndex].messages.forEach((message: any) => {
      if (!message.read && message.sender === senderPhone) {
        message.read = true; // Mark as read on the sender's side as well
      }
    });

    // Save both documents
    await receiver.save();
    await sender.save();

    return NextResponse.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

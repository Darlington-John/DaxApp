import { NextRequest, NextResponse } from 'next/server';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const { userId, senderPhone } = await req.json();

    // Find the receiver (current user) by their phone number
    const receiver = await User.findOne({ phone: userId });

    if (!receiver) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the contact corresponding to the sender
    const contactIndex = receiver.contacts.findIndex(contact => contact.phone === senderPhone);
    if (contactIndex !== -1) {
      // Update the 'read' status of all unread messages
      receiver.contacts[contactIndex].messages.forEach((message: any) => {
        if (!message.read) {
          message.read = true; // Mark as read
        }
      });
    }

    // Save the updated document
    await receiver.save();

    return NextResponse.json({ message: 'Messages marked as read successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

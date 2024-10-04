// DELETE method to delete a message for both users
import { NextRequest, NextResponse } from 'next/server';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';
export async function DELETE(req: NextRequest) {
  try {
    await connectMongo();

    const { userId, receiverNumber, messageId } = await req.json();

    // Find the sender and receiver users
    const sender = await User.findOne({ phone: userId });
    const receiver = await User.findOne({ phone: receiverNumber });

    if (!sender || !receiver) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the contact index for both sender and receiver
    const senderContactIndex = sender.contacts.findIndex(
      (contact: any) => contact.phone === receiverNumber
    );

    const receiverContactIndex = receiver.contacts.findIndex(
      (contact: any) => contact.phone === userId
    );

    if (senderContactIndex === -1 || receiverContactIndex === -1) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Find and remove the message in sender's contacts
    const senderMessages = sender.contacts[senderContactIndex].messages;
    sender.contacts[senderContactIndex].messages = senderMessages.filter(
      (msg: any) => msg.content.toString() !== messageId
    );

    // Find and remove the message in receiver's contacts
    const receiverMessages = receiver.contacts[receiverContactIndex].messages;
    receiver.contacts[receiverContactIndex].messages = receiverMessages.filter(
      (msg: any) => msg.content.toString() !== messageId
    );

    // Save updates to both sender and receiver
    await sender.save();
    await receiver.save();

    return NextResponse.json({ message: 'Message deleted for both users' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
  
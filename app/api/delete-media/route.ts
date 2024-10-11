import { NextRequest, NextResponse } from 'next/server';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';

export async function DELETE(req: NextRequest) {
  try {
    await connectMongo();

    const { userId, receiverNumber, messageId } = await req.json();

    // Find sender and receiver
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

    if (senderContactIndex === -1 || receiverContactIndex === -1) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Filter messages for sender (either image or video matches messageId)
    const senderMessages = sender.contacts[senderContactIndex].messages;
    sender.contacts[senderContactIndex].messages = senderMessages.filter(
      (msg: any) => (!msg.image || msg.image.toString() !== messageId) &&
                    (!msg.video || msg.video.toString() !== messageId) &&
                    (!msg.audio || msg.audio.toString() !== messageId) // Add audio check here
    );
    
    // Filter messages for receiver (either image, video, or audio matches messageId)
    const receiverMessages = receiver.contacts[receiverContactIndex].messages;
    receiver.contacts[receiverContactIndex].messages = receiverMessages.filter(
      (msg: any) => (!msg.image || msg.image.toString() !== messageId) &&
                    (!msg.video || msg.video.toString() !== messageId) &&
                    (!msg.audio || msg.audio.toString() !== messageId) // Add audio check here
    );
    await sender.save();
    await receiver.save();

    return NextResponse.json({ message: 'Message deleted for both users' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

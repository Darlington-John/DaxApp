
import { NextRequest, NextResponse } from 'next/server';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';
export async function DELETE(req: NextRequest) {
  try {
    await connectMongo();

    const { userId, receiverNumber, messageId } = await req.json();

    
    const sender:any = await User.findOne({ phone: userId });
    const receiver:any = await User.findOne({ phone: receiverNumber });

    if (!sender || !receiver) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    
    const senderContactIndex = sender.contacts.findIndex(
      (contact: any) => contact.user.toString() === receiver._id.toString()
    );

    const receiverContactIndex = receiver.contacts.findIndex(
      (contact: any) => contact.user.toString() === sender._id.toString()
    );

    if (senderContactIndex === -1 || receiverContactIndex === -1) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }
    sender.contacts[senderContactIndex].messages = sender.contacts[senderContactIndex].messages.filter(
      (msg: any) => msg.content.toString() !== messageId 
    );
    receiver.contacts[receiverContactIndex].messages = receiver.contacts[receiverContactIndex].messages.filter(
      (msg: any) => msg.content.toString() !== messageId 
    );

    
    await sender.save();
    await receiver.save();

    return NextResponse.json({ message: 'Message deleted for both users' });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
  

import { NextRequest, NextResponse } from 'next/server';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';
export async function DELETE(req: NextRequest) {
    try {
      await connectMongo();
  
      const { userId, receiverNumber, messageId } = await req.json();
  
      const sender = await User.findOne({ phone: userId });
      const receiver = await User.findOne({ phone: receiverNumber });
  
      if (!sender || !receiver) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
  
      
      const senderContactIndex = sender.contacts.findIndex(
        (contact: any) => contact.phone === receiverNumber
      );
      if (senderContactIndex !== -1) {
        sender.contacts[senderContactIndex].messages = sender.contacts[
          senderContactIndex
        ].messages.filter((msg: any) => msg._id.toString() !== messageId);
      }
  
      
      const receiverContactIndex = receiver.contacts.findIndex(
        (contact: any) => contact.phone === userId
      );
      if (receiverContactIndex !== -1) {
        receiver.contacts[receiverContactIndex].messages = receiver.contacts[
          receiverContactIndex
        ].messages.filter((msg: any) => msg._id.toString() !== messageId);
      }
  
      
      await sender.save();
      await receiver.save();
  
      return NextResponse.json({ message: 'Message deleted successfully' });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
  }
  

import { NextRequest, NextResponse } from 'next/server';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';
export async function DELETE(req: NextRequest) {
    try {
      await connectMongo();
  
      const { userId, receiverNumber, messageId } = await req.json();
      const sender:any = await User.findOne({ phone: userId });
      if (!sender) {
        return NextResponse.json({ error: 'Sender not found' }, { status: 404 });
      }
      const receiver:any = await User.findOne({ phone: receiverNumber });
      if (!receiver) {
        return NextResponse.json({ error: 'receiver not found' }, { status: 404 });
      }
      if (!sender || !receiver) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
  
      
      const senderContactIndex = sender.contacts.findIndex(
        (contact: any) => contact.user.toString() === receiver._id.toString() 
      );

      if (senderContactIndex === -1) {
        return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
      }
      sender.contacts[senderContactIndex].messages = sender.contacts[senderContactIndex].messages.filter(
        (msg: any) => msg._id.toString() !== messageId 
      );
      
      const receiverContactIndex = receiver.contacts.findIndex(
        (contact: any) => contact.user.toString() === sender._id.toString()
      );
      if (receiverContactIndex === -1) {
        return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
      }
      receiver.contacts[receiverContactIndex].messages = receiver.contacts[receiverContactIndex].messages.filter(
        (msg: any) => msg._id.toString() !== messageId 
      );
  
      
      await sender.save();
      await receiver.save();
  
      return NextResponse.json({ message: 'Message deleted successfully' });
    } catch (error) {
     
      return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
  }
  
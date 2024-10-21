
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/mongodb';
import User from '~/models/User';

export async function PATCH(req: NextRequest) {
    try {
      await connectMongo(); 
  
      const { blockerId, blockeeId } = await req.json();
  
      if (!blockerId || !blockeeId) {
        return NextResponse.json({ error: 'Missing blocker or blockee IDs' }, { status: 400 });
      }
  
      
      const blocker = await User.findById(blockerId);
      const blockee = await User.findById(blockeeId);
  
      if (!blocker || !blockee) {
        return NextResponse.json({ error: 'Blocker or Blockee not found' }, { status: 404 });
      }
  
      
      const blockerContactIndex = blocker.contacts.findIndex(
        (contact: any) => contact.user.toString() === blockeeId
      );
      const blockeeContactIndex = blockee.contacts.findIndex(
        (contact: any) => contact.user.toString() === blockerId
      );
  
      if (blockerContactIndex === -1 || blockeeContactIndex === -1) {
        return NextResponse.json({ error: 'Contact not found in one or both users' }, { status: 404 });
      }
  
      
      blocker.contacts[blockerContactIndex].blocker = false;
      blockee.contacts[blockeeContactIndex].blockee = false;
  
      
      await blocker.save();
      await blockee.save();
  
      return NextResponse.json({ message: 'Contact blocked successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error blocking contact:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
import { NextRequest, NextResponse } from 'next/server';
import User , { Status }from '~/models/User';
import connectMongo from '~/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    
    await connectMongo();

    
    const { userId, text, background, content } = await req.json();

    
    const sender = await User.findById(userId).populate('contacts.user');
    if (!sender) {
      return NextResponse.json({ error: 'Sender not found' }, { status: 404 });
    }

    
    const contacts = sender.contacts.map((contact: any) => ({
      contact: contact.user._id
    }));

    
    const newStatus = new Status({
      sender: userId,
      text,
      background,
      content,
      contacts, 
    });

    
    await newStatus.save();

    
return NextResponse.json(
  { message: 'Status created successfully', status: newStatus }
);
  } catch (error) {
    console.error('Error creating status:', error);
    return NextResponse.json({ error: 'An error occurred while creating status' }, { status: 500 });
  }
}

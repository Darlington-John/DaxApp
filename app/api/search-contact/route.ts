
import { NextResponse } from 'next/server';
import connectMongo from '~/lib/mongodb';

import User from '~/models/User';

export async function POST(req: Request) {
    await connectMongo(); // Ensure MongoDB connection is established
  
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ message: 'Phone number is required.' }, { status: 400 });
    }
  
    try {
      const user = await User.findOne({ phone });
  
      if (user) {
        return NextResponse.json({ exists: true, message: 'User exists.' }, { status: 200 });
      } else {
        return NextResponse.json({ exists: false, message: 'User does not exist.' }, { status: 404 });
      }
    } catch (error) {
      return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
  }

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    
    if (!JWT_SECRET) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    
    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (!decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    
const user = await User.findById(decoded.userId)
  .populate({
    path: 'contacts.user',
    select: 'username email profile phone',
  })
  .populate({
    path: 'contacts.messages.sender',
    select: 'username email profile phone',
  })
  .populate({
    path: 'contacts.messages.receiver',
    select: 'username email profile phone',
  })
  
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
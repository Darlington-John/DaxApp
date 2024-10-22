
import { NextResponse,NextRequest } from 'next/server';
import connectMongo from '~/lib/mongodb';
import { Status } from '~/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Assuming JWT_SECRET is defined somewhere
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (!decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const statuses = await Status.find()
      .populate('sender', 'username profile') 
      .lean();

    return NextResponse.json({ statuses }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Error fetching statuses:', error);
    return NextResponse.json({ error: 'Failed to fetch statuses' }, { status: 500 });
  }
}

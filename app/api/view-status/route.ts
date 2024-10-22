
import { NextResponse } from 'next/server';
import connectMongo from '~/lib/mongodb';
import { Status } from '~/models/User';

export async function GET() {
  try {
    await connectMongo();
    const statuses = await Status.find()
      .populate('sender', 'username profile') 
      .lean();
    return NextResponse.json({ statuses });
  } catch (error) {
    console.error('Error fetching statuses:', error);
    return NextResponse.json({ error: 'Failed to fetch statuses' }, { status: 500 });
  }
}

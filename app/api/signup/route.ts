import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  try {
    
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    
    await connectMongo();

    
    const { username, email, password , phone} = await req.json();
if (!username || !email || !password || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      profile: "",
      contacts: [],
      archive: [],
    });

    
    await newUser.save();

    
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1y' });

    
    return NextResponse.json({ message: 'User created successfully', token }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred during sign up' }, { status: 500 });
  }
}

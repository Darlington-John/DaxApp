import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  try {
    // Ensure JWT_SECRET is defined
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    // Connect to MongoDB
    await connectMongo();

    // Parse the incoming request
    const { username, email, password , phone} = await req.json();
    console.log('Received data:', { username, email, password, phone });

    // Check for missing fields
    if (!username || !email || !password || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      profile: "",
      contacts: [],
      archive: [],
    });

    // Save the new user to the database
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1y' });

    // Return the token to the client
    return NextResponse.json({ message: 'User created successfully', token }, { status: 201 });
  } catch (error) {
    console.error('Error during sign up:', error);
    return NextResponse.json({ error: 'An error occurred during sign up' }, { status: 500 });
  }
}

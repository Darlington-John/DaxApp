import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';
import { mailOptions, transporter } from '~/lib/nodemailer';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    await connectMongo();

    const { username, email, password, phone } = await req.json();
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const hashedVerificationCode = await bcrypt.hash(verificationCode.toString(), 10);

    if (!username || !email || !password || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await transporter.sendMail({
      ...mailOptions,
      to: email,
      subject: `Verify your DaxApp email ${username}`,
      html: `
 <table style="background-color: #1C3A4D; font-family: Arial, sans-serif; border-radius: 10px; max-width: 370px; margin: 10px auto; padding: 30px;">
  <tr>
    <td align="center" style="padding: 0px;">
      <img src="https://res.cloudinary.com/dycw73vuy/image/upload/v1729761494/DaxApp-10-23-2024_09_42_PM-removebg-preview_enhanced_xr0f4d.png" alt="logo" width="200" style="display: block; margin: 0 auto; border: none;" />
    </td>
  </tr>
  <tr>
    <td style="border-top: 1px solid #EDEDED; padding: 30px 15px; box-sizing: border-box; color: #d1d7db;">
      <p style="margin: 0; padding-bottom: 10px;">Hello ${username},</p>
      <p style="font-size: 14px; font-weight: 300; line-height: 20px; margin: 0 0 20px 0;">
        Thanks for signing up with DaxApp! Before you get started messaging with DaxApp, we need you to confirm your email address. Please copy this number below to complete your signup.
      </p>
    </td>
  </tr>
  <tr>
    <td align="center" style="padding: 10px 0;">
      <p style="font-size: 30px; color: #ffffff; font-weight: bold; margin: 0;">
        ${verificationCode}
      </p>
    </td>
  </tr>
  <tr>
    <td align="start" style="padding-top: 20px;">
      <p style="font-size: 14px; color: #d1d7db; margin: 0;">
        Darlington
      </p>
    </td>
  </tr>
</table>
      `,
    });

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
      verificationHash: hashedVerificationCode, 
      profile: '',
      contacts: [],
      archive: [],
    });

    await newUser.save();
    return NextResponse.json({
      message: 'User created successfully. Please verify your email.',
      email: email, 
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: 'An error occurred during sign up' }, { status: 500 });
  }
}

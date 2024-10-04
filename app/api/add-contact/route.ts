import { NextResponse } from 'next/server';
import connectMongo from '~/lib/mongodb';
import User from '~/models/User';

export async function POST(req: Request) {
  await connectMongo();

  const { phone, currentUserId } = await req.json(); 

  if (!phone || !currentUserId) {
    return NextResponse.json({ message: 'Phone number and current user ID are required.' }, { status: 400 });
  }

  try {
    // Find the user to add by phone number
    const userToAdd = await User.findOne({ phone });

    if (!userToAdd) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Find the current user by ID
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return NextResponse.json({ message: 'Current user not found.' }, { status: 404 });
    }

    // Check if the user to add is already in the current user's contacts
    const isAlreadyInContacts = currentUser.contacts.some(contact => contact.phone === phone);

    if (isAlreadyInContacts) {
      return NextResponse.json({ message: 'User is already in contacts.' }, { status: 400 });
    }

    // Add user to current user's contacts
    currentUser.contacts.push({
      username: userToAdd.username,
      email: userToAdd.email,
      phone: userToAdd.phone,
      profile: userToAdd.profile || '',
      messages: []
    });

    // Save changes to the current user
    await currentUser.save();

    // Now add the current user to the userToAdd's contacts as well
    const isCurrentUserInTheirContacts = userToAdd.contacts.some(contact => contact.phone === currentUser.phone);

    if (!isCurrentUserInTheirContacts) {
      userToAdd.contacts.push({
        username: currentUser.username,
        email: currentUser.email,
        phone: currentUser.phone,
        profile: currentUser.profile || '',
        messages: []
      });

      await userToAdd.save();
    }

    return NextResponse.json({ message: 'Users added to each other\'s contacts successfully.' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}

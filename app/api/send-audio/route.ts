import { NextRequest, NextResponse } from 'next/server';
import cloudinary from 'cloudinary';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const formData = await req.formData(); 
    const userId = formData.get('userId') as string; 
    const receiverNumber = formData.get('receiverNumber') as string;
    const message = formData.get('message') as string;
    const reply = formData.get('reply') as string;
    const audio = formData.get('audio') as Blob | null;  


    const sender:any = await User.findOne({ phone: userId });
    const receiver:any = await User.findOne({ phone: receiverNumber });

    if (!sender || !receiver) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!audio || typeof audio === 'string') {
      return NextResponse.json({ error: 'No file uploaded or incorrect format' }, { status: 400 });
    }

   

    let audioUrl = '';
    if (audio) {
      
      const audioBuffer = Buffer.from(await audio.arrayBuffer());

      
      const uploadAudioResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const options = { folder: 'uploads', resource_type: 'auto' as any  }; 
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          options,
          (error, result) => {
            if (error) {
              reject(new Error(error.message || 'Audio Upload failed'));
            } else {
              resolve(result as { secure_url: string });
            }
          }
        );
        uploadStream.end(audioBuffer);
      });

      audioUrl = uploadAudioResult.secure_url; 
    }

    
  const senderContactIndex = sender.contacts.findIndex(
      (contact: any) => contact.user.toString() === receiver._id.toString()
    );
    const receiverContactIndex = receiver.contacts.findIndex(
      (contact: any) => contact.user.toString() === sender._id.toString()
    );

    if (senderContactIndex === -1 || receiverContactIndex === -1) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    
    const newMessage = {
      content: message,
      sender: sender._id,
      receiver: receiver._id,
      read: false,
      replyingTo: reply,
      audio: audioUrl || '', 
    };

    
    receiver.contacts[receiverContactIndex].messages.push(newMessage);
    sender.contacts[senderContactIndex].messages.push(newMessage);

    
    await sender.save();
    await receiver.save();

    
    return NextResponse.json({ message: 'Message sent successfully', url: audioUrl});
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

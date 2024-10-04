import mongoose, { Schema, Document, Model } from 'mongoose';
const messageSchema: Schema = new Schema({
  sender: { type: String, required: true }, // Ensure this is a String
  receiver: { type: String, required: true },
  content: { type: String, required: true }, 
  read: { type: Boolean, default: false }, 
}, { timestamps: true });

const contactsSchema: Schema = new Schema({
  username: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  profile: { type: String, required: false },
  messages: { type: [messageSchema], default: [] },
}, { timestamps: true }); 
interface IMessage {
  sender: string; // User ID of the sender
  receiver: string;
  content: string;
  read: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
interface IContacts {
  username: string;
  phone: string;
  email: string;
  profile: string;
  messages: IMessage[];
}

const archiveSchema: Schema = new Schema({
  username: { type: String, required: false },
  email: { type: String, required: false },
  profile: { type: String, required: false },
  phone: { type: String, required: true },
}, { timestamps: true }); 

interface IArchive {
  username: string;
  email: string;
  profile: string;
  phone: string;
}

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profile: string;
  phone: string;
  contacts: IContacts[];
  archive: IArchive[];
  createdAt?: Date; 
  updatedAt?: Date;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  username: { type: String, required: true },
  profile: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  contacts: { type: [contactsSchema], default: [] }, 
  archive: { type: [archiveSchema], default: [] },
}, { timestamps: true }); 

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
export type { IUser };

import mongoose, { Schema, Document, Model, Types } from 'mongoose';
const messageSchema: Schema = new Schema({
  sender: { type: mongoose.Types.ObjectId, ref: 'User', required: true }, 
  receiver: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: false }, 
  replyingTo:{ type: String, required: false }, 
  image:{ type: String, required: false },
  video: { type: String, required: false },
  audio: { type: String, required: false },
  read: { type: Boolean, default: false }, 
}, { timestamps: true });

const contactsSchema: Schema = new Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  messages: { type: [messageSchema], default: [] },
}, { timestamps: true }); 
interface IMessage {
  sender: Types.ObjectId; 
  receiver: Types.ObjectId;
  content: string;
  replyingTo?: string;
  image?: string ;
  video?:  string ;
  audio?: string;
  read: boolean;
  createdAt?: Date;
  updatedAt?: Date;

}
interface IContacts {
  user: Types.ObjectId;
  messages: IMessage[];
}

const archiveSchema: Schema = new Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true }); 

interface IArchive {
  user: Types.ObjectId; 
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

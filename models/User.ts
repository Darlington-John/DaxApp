
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
  blocker:{ type:Boolean,  default: false },
  blockee:{ type:Boolean,  default: false },
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
  blocker?:boolean,
  blockee?:boolean,
}



const statusSchema: Schema = new mongoose.Schema({
  sender: { type: mongoose.Types.ObjectId, ref: 'User', required: true }, 
  text: { type: Boolean,default: false},
  contacts:[
 {
     contact: { type: mongoose.Types.ObjectId, ref: 'User', required: true }
  }
  ],
  background:{ type: String,required: false},
  content: { type: String,default: false},
}, { timestamps: true });

interface IStatus extends Document {
  sender: Types.ObjectId;
  text?: boolean;
  background?: string;
  content?: string;
  contacts: { contact: Types.ObjectId; seen: boolean }
}
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profile: string;
  phone: string;
  contacts: IContacts[];
  verificationHash: string;
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
  verificationHash: { type: String, required: true}
}, { timestamps: true }); 

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

  const Status: Model<IStatus> = mongoose.models.Status || mongoose.model<IStatus>('Status', statusSchema);
export default User;
export {Status}
export type { IUser, IStatus };

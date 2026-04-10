import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String },
  bio: { type: String },
  avatarUrl: { type: String },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);

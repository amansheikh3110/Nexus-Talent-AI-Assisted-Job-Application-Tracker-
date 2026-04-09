import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  user: mongoose.Types.ObjectId;
  company: string;
  role: string;
  status: 'Applied' | 'Phone Screen' | 'Interview' | 'Offer' | 'Rejected';
  dateApplied: Date;
  jdLink?: string;
  notes?: string;
  salaryRange?: string;
  aiSuggestions?: string[];
}

const ApplicationSchema = new Schema<IApplication>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'], 
    default: 'Applied' 
  },
  dateApplied: { type: Date, default: Date.now },
  jdLink: { type: String },
  notes: { type: String },
  salaryRange: { type: String },
  aiSuggestions: [{ type: String }]
}, { timestamps: true });

export default mongoose.model<IApplication>('Application', ApplicationSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  deviceInfo: {
    name?: string;
    type?: string;
    os?: string;
    browser?: string;
    fingerprint?: string;
  };
  ip?: string;
  location?: string;
  isActive: boolean;
  lastActivity?: Date;
  expiresAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    deviceInfo: {
      name: { type: String },
      type: { type: String },
      os: { type: String },
      browser: { type: String },
      fingerprint: { type: String },
    },
    ip: { type: String },
    location: { type: String },
    isActive: { type: Boolean, default: true },
    lastActivity: { type: Date },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<ISession>("Session", sessionSchema);

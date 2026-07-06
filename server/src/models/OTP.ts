import mongoose, { Schema, Document } from "mongoose";

export interface IOTP extends Document {
  userId: mongoose.Types.ObjectId;
  type: "email_verification" | "phone_verification" | "password_reset" | "transfer" | "login";
  code: string;
  attempts: number;
  maxAttempts: number;
  isUsed: boolean;
  expiresAt: Date;
}

const otpSchema = new Schema<IOTP>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["email_verification", "phone_verification", "password_reset", "transfer", "login"],
      required: true,
    },
    code: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 5 },
    isUsed: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IOTP>("OTP", otpSchema);

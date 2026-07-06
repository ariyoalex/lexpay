import mongoose, { Schema, Document } from "mongoose";

export interface IDevice extends Document {
  userId: mongoose.Types.ObjectId;
  fingerprint: string;
  name?: string;
  type?: string;
  os?: string;
  browser?: string;
  isTrusted: boolean;
  lastUsed?: Date;
  firstUsed?: Date;
}

const deviceSchema = new Schema<IDevice>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fingerprint: { type: String, required: true },
    name: { type: String },
    type: { type: String },
    os: { type: String },
    browser: { type: String },
    isTrusted: { type: Boolean, default: false },
    lastUsed: { type: Date },
    firstUsed: { type: Date },
  },
  { timestamps: true }
);

deviceSchema.index({ userId: 1, fingerprint: 1 }, { unique: true });

export default mongoose.model<IDevice>("Device", deviceSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
  type: "login" | "transfer" | "funding" | "profile" | "settings";
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  location?: {
    city?: string;
    region?: string;
    country?: string;
    lat?: number;
    lon?: number;
  };
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["login", "transfer", "funding", "profile", "settings"],
      required: true,
    },
    metadata: { type: Schema.Types.Mixed },
    ip: { type: String },
    userAgent: { type: String },
    location: {
      city: { type: String },
      region: { type: String },
      country: { type: String },
      lat: { type: Number },
      lon: { type: Number },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IActivityLog>("ActivityLog", activityLogSchema);

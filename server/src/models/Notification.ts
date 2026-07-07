import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: "email" | "in_app" | "push";
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  channel?: string;
  status: "pending" | "sent" | "failed";
  sentAt?: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["email", "in_app", "push"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: Schema.Types.Mixed },
    isRead: { type: Boolean, default: false },
    channel: { type: String },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    sentAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model<INotification>("Notification", notificationSchema);

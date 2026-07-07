import mongoose, { Schema, Document } from "mongoose";

export interface IKYC extends Document {
  userId: mongoose.Types.ObjectId;
  level: number;
  status: "pending" | "approved" | "rejected";
  idType?: string;
  idNumber?: string;
  idFrontImage?: string;
  idBackImage?: string;
  selfieImage?: string;
  addressDocument?: string;
  addressProofType?: string;
  rejectionReason?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  submittedAt?: Date;
}

const kycSchema = new Schema<IKYC>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    level: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    idType: { type: String },
    idNumber: { type: String },
    idFrontImage: { type: String },
    idBackImage: { type: String },
    selfieImage: { type: String },
    addressDocument: { type: String },
    addressProofType: { type: String },
    rejectionReason: { type: String },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    submittedAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model<IKYC>("KYC", kycSchema);

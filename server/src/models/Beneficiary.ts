import mongoose, { Schema, Document } from "mongoose";

export interface IBeneficiary extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  bank: string;
  accountNumber: string;
  bankCode: string;
  isFavorite: boolean;
  isInternal: boolean;
  internalUserId?: mongoose.Types.ObjectId;
}

const beneficiarySchema = new Schema<IBeneficiary>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    bank: { type: String, required: true },
    accountNumber: { type: String, required: true },
    bankCode: { type: String, required: true },
    isFavorite: { type: Boolean, default: false },
    isInternal: { type: Boolean, default: false },
    internalUserId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model<IBeneficiary>("Beneficiary", beneficiarySchema);

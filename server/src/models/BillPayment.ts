import mongoose, { Schema, Document } from "mongoose";

export interface IBillPayment extends Document {
  userId: mongoose.Types.ObjectId;
  type: "electricity" | "cable" | "airtime" | "data";
  provider: string;
  amount: number;
  meterNumber?: string;
  smartCardNumber?: string;
  phoneNumber?: string;
  dataPlan?: string;
  transactionId?: mongoose.Types.ObjectId;
  status: "pending" | "completed" | "failed";
  providerReference?: string;
}

const billPaymentSchema = new Schema<IBillPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["electricity", "cable", "airtime", "data"],
      required: true,
    },
    provider: { type: String, required: true },
    amount: { type: Number, required: true },
    meterNumber: { type: String },
    smartCardNumber: { type: String },
    phoneNumber: { type: String },
    dataPlan: { type: String },
    transactionId: { type: Schema.Types.ObjectId, ref: "Transaction" },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    providerReference: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IBillPayment>("BillPayment", billPaymentSchema);

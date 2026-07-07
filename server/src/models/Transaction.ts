import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  reference: string;
  userId: mongoose.Types.ObjectId;
  type:
    | "credit"
    | "debit"
    | "transfer_in"
    | "transfer_out"
    | "funding"
    | "withdrawal"
    | "bill_payment"
    | "airtime"
    | "data"
    | "savings_deposit"
    | "savings_withdrawal"
    | "fee"
    | "reversal";
  amount: number;
  fee: number;
  balanceBefore: number;
  balanceAfter: number;
  status: "pending" | "completed" | "failed" | "reversed";
  description?: string;
  metadata?: {
    paymentMethod?: string;
    senderId?: mongoose.Types.ObjectId;
    recipientId?: mongoose.Types.ObjectId;
    recipientAccountName?: string;
    recipientAccountNumber?: string;
    recipientBank?: string;
    billType?: string;
    billProvider?: string;
    billMeterNumber?: string;
    savingsPlanId?: mongoose.Types.ObjectId;
    paystackReference?: string;
    failureReason?: string;
  };
  ipAddress?: string;
  deviceId?: string;
}

const transactionSchema = new Schema<ITransaction>(
  {
    reference: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "credit",
        "debit",
        "transfer_in",
        "transfer_out",
        "funding",
        "withdrawal",
        "bill_payment",
        "airtime",
        "data",
        "savings_deposit",
        "savings_withdrawal",
        "fee",
        "reversal",
      ],
      required: true,
    },
    amount: { type: Number, required: true },
    fee: { type: Number, default: 0 },
    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "reversed"],
      default: "pending",
    },
    description: { type: String },
    metadata: {
      paymentMethod: { type: String },
      senderId: { type: Schema.Types.ObjectId },
      recipientId: { type: Schema.Types.ObjectId },
      recipientAccountName: { type: String },
      recipientAccountNumber: { type: String },
      recipientBank: { type: String },
      billType: { type: String },
      billProvider: { type: String },
      billMeterNumber: { type: String },
      savingsPlanId: { type: Schema.Types.ObjectId },
      paystackReference: { type: String },
      failureReason: { type: String },
    },
    ipAddress: { type: String },
    deviceId: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model<ITransaction>("Transaction", transactionSchema);

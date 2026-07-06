import mongoose, { Schema, Document } from "mongoose";

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  balance: number;
  ledgerBalance: number;
  pendingBalance: number;
  currency: string;
  isFrozen: boolean;
  freezeReason?: string;
  dailyLimit?: number;
  monthlyLimit?: number;
  dailySpent: number;
  monthlySpent: number;
  lastDailyReset?: Date;
  lastMonthlyReset?: Date;
  pinSetAt?: Date;
}

const walletSchema = new Schema<IWallet>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    balance: { type: Number, default: 0 },
    ledgerBalance: { type: Number, default: 0 },
    pendingBalance: { type: Number, default: 0 },
    currency: { type: String, default: "NGN" },
    isFrozen: { type: Boolean, default: false },
    freezeReason: { type: String },
    dailyLimit: { type: Number },
    monthlyLimit: { type: Number },
    dailySpent: { type: Number, default: 0 },
    monthlySpent: { type: Number, default: 0 },
    lastDailyReset: { type: Date },
    lastMonthlyReset: { type: Date },
    pinSetAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IWallet>("Wallet", walletSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface ISavingsPlan extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  targetAmount: number;
  currentAmount: number;
  frequency: "daily" | "weekly" | "monthly";
  amountPerCycle: number;
  nextDeduction?: Date;
  autoDeduct: boolean;
  sourceWalletId: mongoose.Types.ObjectId;
  status: "active" | "paused" | "completed" | "cancelled";
  completedAt?: Date;
}

const savingsPlanSchema = new Schema<ISavingsPlan>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      required: true,
    },
    amountPerCycle: { type: Number, required: true },
    nextDeduction: { type: Date },
    autoDeduct: { type: Boolean, default: true },
    sourceWalletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    status: {
      type: String,
      enum: ["active", "paused", "completed", "cancelled"],
      default: "active",
    },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<ISavingsPlan>("SavingsPlan", savingsPlanSchema);

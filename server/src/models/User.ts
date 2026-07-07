import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  pin?: string;
  role: "customer" | "manage";
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isTwoFactorEnabled: boolean;
  twoFactorSecret?: string;
  isActive: boolean;
  isLocked: boolean;
  lockedUntil?: Date;
  failedLoginAttempts: number;
  profile: {
    photo?: string;
    address?: string;
    dateOfBirth?: Date;
  };
  kycLevel: number;
  lastLogin?: Date;
  lastLoginIP?: string;
  refreshTokens: string[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pin: { type: String },
    role: { type: String, enum: ["customer", "manage"], default: "customer" },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isTwoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
    isActive: { type: Boolean, default: true },
    isLocked: { type: Boolean, default: false },
    lockedUntil: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
    profile: {
      photo: { type: String },
      address: { type: String },
      dateOfBirth: { type: Date },
    },
    kycLevel: { type: Number, default: 0 },
    lastLogin: { type: Date },
    lastLoginIP: { type: String },
    refreshTokens: [{ type: String }],
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);

import crypto from "crypto";
import User from "../../models/User";
import Session from "../../models/Session";
import OTP, { IOTP } from "../../models/OTP";
import RefreshToken from "../../models/RefreshToken";
import { signAccessToken, signRefreshToken, verifyRefreshToken, JwtPayload } from "../../utils/jwt";
import { generateOtp, hashOtp, verifyOtpHash, generateTokenFamily } from "./auth.utils";
import { ApiError } from "../../utils/apiError";

const ACCESS_TOKEN_EXPIRY_MS = 15 * 60 * 1000;
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;
const OTP_LENGTH = 6;
const OTP_EXPIRY_MS = 10 * 60 * 1000;

const createTokenPair = async (user: any, family?: string) => {
  const payload: JwtPayload = { userId: user._id.toString(), role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  const tokenFamily = family || generateTokenFamily();
  const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

  await RefreshToken.create({
    userId: user._id,
    tokenHash,
    family: tokenFamily,
    isRevoked: false,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
  });

  return { accessToken, refreshToken, tokenFamily };
};

const sendOtp = async (userId: string, type: IOTP["type"]) => {
  const code = generateOtp(OTP_LENGTH);
  const hashed = hashOtp(code);
  await OTP.create({
    userId,
    type,
    code: hashed,
    attempts: 0,
    maxAttempts: 5,
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
  });
  return code;
};

export const register = async (body: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}) => {
  const existing = await User.findOne({ $or: [{ email: body.email }, { phone: body.phone }] });
  if (existing) {
    const field = existing.email === body.email ? "email" : "phone";
    throw ApiError.badRequest(`A user with this ${field} already exists`);
  }

  const user = await User.create(body);

  const otpCode = await sendOtp(user._id.toString(), "email_verification");

  return { userId: user._id, otpCode };
};

export const login = async (body: { email: string; password: string }, deviceInfo?: any, ip?: string) => {
  const user = await User.findOne({ email: body.email });
  if (!user) throw ApiError.badRequest("Invalid email or password");

  if (!user.isActive) throw ApiError.badRequest("Account is deactivated");

  if (user.isLocked && user.lockedUntil && user.lockedUntil > new Date()) {
    throw ApiError.tooMany("Account is temporarily locked. Try again later.");
  }

  const isPasswordValid = await user.comparePassword(body.password);
  if (!isPasswordValid) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.isLocked = true;
      user.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
    }
    await user.save();
    throw ApiError.badRequest("Invalid email or password");
  }

  user.failedLoginAttempts = 0;
  user.isLocked = false;
  user.lockedUntil = undefined;
  user.lastLogin = new Date();
  user.lastLoginIP = ip;

  const tokens = await createTokenPair(user);
  user.refreshTokens.push(tokens.refreshToken);
  await user.save();

  await Session.create({
    userId: user._id,
    token: tokens.refreshToken,
    deviceInfo,
    ip,
    isActive: true,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
  });
  const userObj = user.toObject();
  const { password, pin, twoFactorSecret, refreshTokens, ...safeUser } = userObj;
  return { ...tokens, user: safeUser };
};

export const logout = async (refreshToken: string) => {
  const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
  await RefreshToken.updateOne({ tokenHash }, { isRevoked: true });
  await Session.updateOne({ token: refreshToken }, { isActive: false });
};

export const refreshTokenPair = async (oldRefreshToken: string) => {
  let payload: JwtPayload;
  try {
    payload = verifyRefreshToken(oldRefreshToken);
  } catch {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  const tokenHash = crypto.createHash("sha256").update(oldRefreshToken).digest("hex");
  const stored = await RefreshToken.findOne({ tokenHash, isRevoked: false });
  if (!stored) throw ApiError.unauthorized("Refresh token has been revoked");

  if (stored.expiresAt < new Date()) {
    throw ApiError.unauthorized("Refresh token expired");
  }

  await RefreshToken.updateOne({ _id: stored._id }, { isRevoked: true });

  const user = await User.findById(payload.userId);
  if (!user || !user.isActive) throw ApiError.unauthorized("User not found or inactive");

  const tokens = await createTokenPair(user, stored.family);
  return tokens;
};

export const verifyEmail = async (body: { email: string; code: string }) => {
  const user = await User.findOne({ email: body.email });
  if (!user) throw ApiError.badRequest("User not found");
  if (user.isEmailVerified) throw ApiError.badRequest("Email already verified");

  const otpRecord = await OTP.findOne({
    userId: user._id,
    type: "email_verification",
    isUsed: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (!otpRecord) throw ApiError.badRequest("No valid OTP found. Request a new one.");

  if (!verifyOtpHash(body.code, otpRecord.code)) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      otpRecord.isUsed = true;
      await otpRecord.save();
    }
    throw ApiError.badRequest("Invalid OTP code");
  }

  otpRecord.isUsed = true;
  await otpRecord.save();
  user.isEmailVerified = true;
  await user.save();
};

export const verifyPhone = async (body: { phone: string; code: string }) => {
  const user = await User.findOne({ phone: body.phone });
  if (!user) throw ApiError.badRequest("User not found");
  if (user.isPhoneVerified) throw ApiError.badRequest("Phone already verified");

  const otpRecord = await OTP.findOne({
    userId: user._id,
    type: "phone_verification",
    isUsed: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (!otpRecord) throw ApiError.badRequest("No valid OTP found. Request a new one.");

  if (!verifyOtpHash(body.code, otpRecord.code)) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      otpRecord.isUsed = true;
      await otpRecord.save();
    }
    throw ApiError.badRequest("Invalid OTP code");
  }

  otpRecord.isUsed = true;
  await otpRecord.save();
  user.isPhoneVerified = true;
  await user.save();
};

export const forgotPassword = async (body: { email: string }) => {
  const user = await User.findOne({ email: body.email });
  if (!user) return;

  const otpCode = await sendOtp(user._id.toString(), "password_reset");
  return otpCode;
};

export const resetPassword = async (body: { email: string; code: string; password: string }) => {
  const user = await User.findOne({ email: body.email });
  if (!user) throw ApiError.badRequest("User not found");

  const otpRecord = await OTP.findOne({
    userId: user._id,
    type: "password_reset",
    isUsed: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (!otpRecord) throw ApiError.badRequest("No valid OTP found. Request a new one.");

  if (!verifyOtpHash(body.code, otpRecord.code)) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw ApiError.badRequest("Invalid OTP code");
  }

  otpRecord.isUsed = true;
  await otpRecord.save();
  user.password = body.password;
  await user.save();

  await RefreshToken.updateMany({ userId: user._id }, { isRevoked: true });
  await Session.updateMany({ userId: user._id }, { isActive: false });
};

export const enable2FA = async (userId: string, password: string) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.badRequest("User not found");

  const isValid = await user.comparePassword(password);
  if (!isValid) throw ApiError.badRequest("Invalid password");

  const secret = crypto.randomBytes(20).toString("hex");
  user.twoFactorSecret = secret;
  user.isTwoFactorEnabled = true;
  await user.save();
};

export const verify2FA = async (userId: string, code: string) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.badRequest("User not found");
  if (!user.isTwoFactorEnabled || !user.twoFactorSecret) throw ApiError.badRequest("2FA is not enabled");

  const expected = crypto.createHmac("sha1", user.twoFactorSecret)
    .update(Math.floor(Date.now() / 30000).toString())
    .digest("hex")
    .slice(0, 6);

  if (code !== expected) throw ApiError.badRequest("Invalid 2FA code");
};

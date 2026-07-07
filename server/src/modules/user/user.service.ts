import Session from "../../models/Session";
import User from "../../models/User";
import { ApiError } from "../../utils/apiError";
import { decryptPin, encryptPin } from "../../utils/encryption";

export const getProfile = async (userId: string) => {
  const user = await User.findById(userId).select("-password -pin -twoFactorSecret -refreshTokens");
  if (!user) throw ApiError.notFound("User not found");
  return user;
};

export const updateProfile = async (
  userId: string,
  body: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    profile?: { address?: string; dateOfBirth?: string };
  },
) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");

  if (body.firstName) user.firstName = body.firstName;
  if (body.lastName) user.lastName = body.lastName;
  if (body.phone) user.phone = body.phone;
  if (body.profile) {
    if (body.profile.address !== undefined) user.profile.address = body.profile.address;
    if (body.profile.dateOfBirth !== undefined) user.profile.dateOfBirth = new Date(body.profile.dateOfBirth);
  }

  await user.save();
  const userObj = user.toObject() as Record<string, any>;
  delete userObj.password;
  delete userObj.pin;
  delete userObj.twoFactorSecret;
  delete userObj.refreshTokens;
  return userObj;
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");

  const isValid = await user.comparePassword(currentPassword);
  if (!isValid) throw ApiError.badRequest("Current password is incorrect");

  user.password = newPassword;
  await user.save();

  await Session.updateMany({ userId: user._id, isActive: true }, { isActive: false });
};

export const changePin = async (userId: string, currentPin: string | undefined, newPin: string) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");

  if (user.pin) {
    if (!currentPin) throw ApiError.badRequest("Current PIN is required to change PIN");
    const decrypted = decryptPin(user.pin);
    if (decrypted !== currentPin) throw ApiError.badRequest("Current PIN is incorrect");
  }

  user.pin = encryptPin(newPin);
  await user.save();
};

export const getSessions = async (userId: string) => {
  const sessions = await Session.find({ userId, isActive: true }).sort({ lastActivity: -1 }).lean();
  return sessions;
};

export const revokeSession = async (userId: string, sessionId: string) => {
  const session = await Session.findOne({ _id: sessionId, userId });
  if (!session) throw ApiError.notFound("Session not found");

  session.isActive = false;
  await session.save();
};

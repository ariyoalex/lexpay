import KYC from "../../models/KYC";
import User from "../../models/User";
import { ApiError } from "../../utils/apiError";
import { uploadPhoto } from "../../utils/cloudinary";

export const getKycStatus = async (userId: string) => {
  const user = await User.findById(userId).select("kycLevel isEmailVerified isPhoneVerified").lean();
  if (!user) throw ApiError.notFound("User not found");

  const kyc = await KYC.findOne({ userId }).sort({ createdAt: -1 }).lean();

  return {
    kycLevel: user.kycLevel,
    isEmailVerified: user.isEmailVerified,
    isPhoneVerified: user.isPhoneVerified,
    kycSubmission: kyc || null,
    canUpgrade: user.isEmailVerified && user.isPhoneVerified && user.kycLevel < 2,
  };
};

export const submitKyc = async (
  userId: string,
  data: { level: number; idType: string; idNumber: string; addressProofType?: string },
  files: {
    idFront?: Express.Multer.File;
    idBack?: Express.Multer.File;
    selfie?: Express.Multer.File;
    addressDocument?: Express.Multer.File;
  },
) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");

  if (!user.isEmailVerified || !user.isPhoneVerified) {
    throw ApiError.badRequest("Verify email and phone before submitting KYC");
  }

  if (user.kycLevel >= 2) {
    throw ApiError.badRequest("KYC Level 2 already completed");
  }

  const existing = await KYC.findOne({ userId, status: "pending" });
  if (existing) {
    throw ApiError.badRequest("You already have a pending KYC submission");
  }

  const uploads: Record<string, string> = {};
  if (files.idFront) {
    const result = await uploadPhoto(files.idFront.buffer, "kyc", `${userId}-id-front`);
    uploads.idFrontImage = result.url;
  }
  if (files.idBack) {
    const result = await uploadPhoto(files.idBack.buffer, "kyc", `${userId}-id-back`);
    uploads.idBackImage = result.url;
  }
  if (files.selfie) {
    const result = await uploadPhoto(files.selfie.buffer, "kyc", `${userId}-selfie`);
    uploads.selfieImage = result.url;
  }
  if (files.addressDocument) {
    const result = await uploadPhoto(files.addressDocument.buffer, "kyc", `${userId}-address`);
    uploads.addressDocument = result.url;
  }

  const kyc = await KYC.create({
    userId,
    level: data.level,
    status: "pending",
    idType: data.idType,
    idNumber: data.idNumber,
    addressProofType: data.addressProofType,
    ...uploads,
    submittedAt: new Date(),
  });

  return kyc;
};

export const reviewKyc = async (
  kycId: string,
  reviewerId: string,
  status: "approved" | "rejected",
  rejectionReason?: string,
) => {
  const kyc = await KYC.findById(kycId);
  if (!kyc) throw ApiError.notFound("KYC submission not found");

  if (kyc.status !== "pending") {
    throw ApiError.badRequest("KYC submission already reviewed");
  }

  kyc.status = status;
  kyc.reviewedBy = reviewerId as any;
  kyc.reviewedAt = new Date();

  if (status === "rejected") {
    kyc.rejectionReason = rejectionReason || "No reason provided";
  } else {
    const user = await User.findById(kyc.userId);
    if (user) {
      user.kycLevel = 2;
      await user.save();
    }
  }

  await kyc.save();
  return kyc;
};

export const listPendingKyc = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    KYC.find({ status: "pending" })
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "firstName lastName email phone")
      .lean(),
    KYC.countDocuments({ status: "pending" }),
  ]);

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

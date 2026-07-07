import Beneficiary from "../../models/Beneficiary";
import { ApiError } from "../../utils/apiError";

export const listBeneficiaries = async (userId: string, search?: string) => {
  const filter: Record<string, any> = { userId };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { accountNumber: { $regex: search, $options: "i" } },
      { bank: { $regex: search, $options: "i" } },
    ];
  }
  return Beneficiary.find(filter).sort({ isFavorite: -1, createdAt: -1 }).lean();
};

export const createBeneficiary = async (
  userId: string,
  data: { name: string; bank: string; accountNumber: string; bankCode: string },
) => {
  const existing = await Beneficiary.findOne({ userId, accountNumber: data.accountNumber });
  if (existing) throw ApiError.conflict("Beneficiary with this account number already exists");

  return Beneficiary.create({ userId, ...data });
};

export const updateBeneficiary = async (userId: string, id: string, data: any) => {
  const beneficiary = await Beneficiary.findOne({ _id: id, userId });
  if (!beneficiary) throw ApiError.notFound("Beneficiary not found");

  if (data.name !== undefined) beneficiary.name = data.name;
  if (data.bank !== undefined) beneficiary.bank = data.bank;
  if (data.accountNumber !== undefined) beneficiary.accountNumber = data.accountNumber;
  if (data.bankCode !== undefined) beneficiary.bankCode = data.bankCode;

  await beneficiary.save();
  return beneficiary;
};

export const deleteBeneficiary = async (userId: string, id: string) => {
  const beneficiary = await Beneficiary.findOneAndDelete({ _id: id, userId });
  if (!beneficiary) throw ApiError.notFound("Beneficiary not found");
};

export const toggleFavorite = async (userId: string, id: string, isFavorite: boolean) => {
  const beneficiary = await Beneficiary.findOneAndUpdate({ _id: id, userId }, { isFavorite }, { new: true });
  if (!beneficiary) throw ApiError.notFound("Beneficiary not found");
  return beneficiary;
};

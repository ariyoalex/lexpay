import { z } from "zod";

export const createBeneficiarySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    bank: z.string().min(2).max(100),
    accountNumber: z.string().min(10).max(10),
    bankCode: z.string().min(1).max(10),
  }),
});

export const updateBeneficiarySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    bank: z.string().min(2).max(100).optional(),
    accountNumber: z.string().min(10).max(10).optional(),
    bankCode: z.string().min(1).max(10).optional(),
  }),
});

export const favoriteBeneficiarySchema = z.object({
  body: z.object({
    isFavorite: z.boolean(),
  }),
});

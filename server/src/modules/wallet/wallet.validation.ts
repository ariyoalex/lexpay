import { z } from "zod";

export const updateLimitsSchema = z.object({
  body: z.object({
    dailyLimit: z.number().min(0).optional(),
    monthlyLimit: z.number().min(0).optional(),
  }),
});

export const freezeWalletSchema = z.object({
  body: z.object({
    reason: z.string().min(1).max(200),
  }),
});

export const unfreezeWalletSchema = z.object({
  body: z.object({
    reason: z.string().max(200).optional(),
  }),
});

export const walletSchemas = {
  updateLimits: updateLimitsSchema,
  freezeWallet: freezeWalletSchema,
  unfreezeWallet: unfreezeWalletSchema,
};

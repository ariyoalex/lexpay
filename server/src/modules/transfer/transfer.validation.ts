import { z } from "zod";

export const internalTransferSchema = z.object({
  body: z.object({
    recipientEmail: z.string().email().optional(),
    recipientPhone: z.string().optional(),
    amount: z.number().positive().min(100),
    description: z.string().max(200).optional(),
    pin: z.string().length(4),
    otpCode: z.string().length(6).optional(),
  }),
});

export const externalTransferSchema = z.object({
  body: z.object({
    beneficiaryId: z.string().min(1),
    amount: z.number().positive().min(100),
    description: z.string().max(200).optional(),
    pin: z.string().length(4),
    otpCode: z.string().length(6).optional(),
  }),
});

import { z } from "zod";

export const submitKycSchema = z.object({
  body: z.object({
    level: z.literal(2),
    idType: z.enum(["national_id", "driver_license", "passport", "voter_card"]),
    idNumber: z.string().min(3).max(50),
    addressProofType: z.enum(["utility_bill", "bank_statement", "rent_agreement"]).optional(),
  }),
});

export const reviewKycSchema = z.object({
  body: z.object({
    status: z.enum(["approved", "rejected"]),
    rejectionReason: z.string().optional(),
  }),
});

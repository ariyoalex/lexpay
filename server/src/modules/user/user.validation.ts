import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).max(50).trim().optional(),
    lastName: z.string().min(1).max(50).trim().optional(),
    phone: z.string().min(10).max(15).trim().optional(),
    profile: z
      .object({
        address: z.string().max(200).optional(),
        dateOfBirth: z.string().optional(),
      })
      .optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).max(128),
  }),
});

export const changePinSchema = z.object({
  body: z.object({
    currentPin: z.string().length(4).optional(),
    newPin: z.string().length(4),
  }),
});

export const userSchemas = {
  updateProfile: updateProfileSchema,
  changePassword: changePasswordSchema,
  changePin: changePinSchema,
};

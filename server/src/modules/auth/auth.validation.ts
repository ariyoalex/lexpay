import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).max(50).trim(),
    lastName: z.string().min(1).max(50).trim(),
    email: z.string().email().toLowerCase().trim(),
    phone: z.string().min(10).max(15).trim(),
    password: z.string().min(8).max(128),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email().toLowerCase().trim(),
    password: z.string().min(1),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    email: z.string().email().toLowerCase().trim(),
    code: z.string().length(6),
  }),
});

export const verifyPhoneSchema = z.object({
  body: z.object({
    phone: z.string().min(10).max(15).trim(),
    code: z.string().length(6),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email().toLowerCase().trim(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email().toLowerCase().trim(),
    code: z.string().length(6),
    password: z.string().min(8).max(128),
  }),
});

export const enable2FASchema = z.object({
  body: z.object({
    password: z.string().min(1),
  }),
});

export const verify2FASchema = z.object({
  body: z.object({
    code: z.string().min(6).max(6),
  }),
});

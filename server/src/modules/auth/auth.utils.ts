import crypto from "crypto";

export const generateOtp = (length: number = 6): string => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[crypto.randomInt(0, digits.length)];
  }
  return otp;
};

export const hashOtp = (otp: string): string => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

export const verifyOtpHash = (otp: string, hash: string): boolean => {
  const computedHash = hashOtp(otp);
  return crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(hash));
};

export const generateTokenFamily = (): string => {
  return crypto.randomUUID();
};

export const generateTokenId = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

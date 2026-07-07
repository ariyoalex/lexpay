import jwt, { SignOptions } from "jsonwebtoken";
import config from "../config/index";

export interface JwtPayload {
  userId: string;
  role: string;
}

export const signAccessToken = (payload: JwtPayload): string => {
  const options: SignOptions = { expiresIn: config.jwt.accessExpiresIn as unknown as number };
  return jwt.sign(payload, config.jwt.accessSecret, options);
};

export const signRefreshToken = (payload: JwtPayload): string => {
  const options: SignOptions = { expiresIn: config.jwt.refreshExpiresIn as unknown as number };
  return jwt.sign(payload, config.jwt.refreshSecret, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
};

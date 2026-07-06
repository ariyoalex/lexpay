import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

export const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    next();
  };
};

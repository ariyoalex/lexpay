import { AuthRequest } from "../../middleware/authenticate";
import { sendSuccess } from "../../utils/apiResponse";
import * as beneficiaryService from "./beneficiary.service";
import { NextFunction, Response } from "express";

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const search = req.query.search as string | undefined;
    const beneficiaries = await beneficiaryService.listBeneficiaries(req.user!.userId, search);
    sendSuccess(res, beneficiaries, "Beneficiaries retrieved");
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const beneficiary = await beneficiaryService.createBeneficiary(req.user!.userId, req.body);
    sendSuccess(res, beneficiary, "Beneficiary created", undefined, 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const beneficiary = await beneficiaryService.updateBeneficiary(req.user!.userId, req.params.id as string, req.body);
    sendSuccess(res, beneficiary, "Beneficiary updated");
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await beneficiaryService.deleteBeneficiary(req.user!.userId, req.params.id as string);
    sendSuccess(res, null, "Beneficiary deleted");
  } catch (error) {
    next(error);
  }
};

export const favorite = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const beneficiary = await beneficiaryService.toggleFavorite(
      req.user!.userId,
      req.params.id as string,
      req.body.isFavorite,
    );
    sendSuccess(res, beneficiary, "Favorite status updated");
  } catch (error) {
    next(error);
  }
};

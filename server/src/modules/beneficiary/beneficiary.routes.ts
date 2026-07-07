import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import * as beneficiaryController from "./beneficiary.controller";
import { createBeneficiarySchema, favoriteBeneficiarySchema, updateBeneficiarySchema } from "./beneficiary.validation";
import { Router } from "express";

const router = Router();

router.use(authenticate);

router.get("/", beneficiaryController.list);
router.post("/", validate(createBeneficiarySchema), beneficiaryController.create);
router.put("/:id", validate(updateBeneficiarySchema), beneficiaryController.update);
router.delete("/:id", beneficiaryController.remove);
router.put("/:id/favorite", validate(favoriteBeneficiarySchema), beneficiaryController.favorite);

export default router;

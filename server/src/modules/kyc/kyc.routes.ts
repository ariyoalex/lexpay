import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { uploadDocuments } from "../../middleware/multerUpload";
import { validate } from "../../middleware/validate";
import * as kycController from "./kyc.controller";
import { reviewKycSchema, submitKycSchema } from "./kyc.validation";
import { Router } from "express";

const router = Router();

router.use(authenticate);

router.get("/status", kycController.getStatus);
router.post("/submit", uploadDocuments, validate(submitKycSchema), kycController.submit);

router.get("/pending", authorize("manage"), kycController.pending);
router.put("/:id/review", authorize("manage"), validate(reviewKycSchema), kycController.review);

export default router;

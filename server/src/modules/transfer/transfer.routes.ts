import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import * as transferController from "./transfer.controller";
import { externalTransferSchema, internalTransferSchema } from "./transfer.validation";
import { Router } from "express";

const router = Router();

router.use(authenticate);

router.post("/internal", validate(internalTransferSchema), transferController.internalTransfer);
router.post("/external", validate(externalTransferSchema), transferController.externalTransfer);
router.get("/fees", transferController.fees);
router.post("/otp", transferController.requestOtp);

export default router;

import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import * as walletController from "./wallet.controller";
import { freezeWalletSchema, unfreezeWalletSchema, updateLimitsSchema } from "./wallet.validation";
import { Router } from "express";

const router = Router();

router.use(authenticate);

router.get("/balance", walletController.getBalance);
router.get("/summary", walletController.getSummary);
router.get("/status", walletController.getStatus);
router.put("/limits", validate(updateLimitsSchema), walletController.updateLimits);
router.post("/freeze", validate(freezeWalletSchema), walletController.freeze);
router.post("/unfreeze", validate(unfreezeWalletSchema), walletController.unfreeze);

export default router;

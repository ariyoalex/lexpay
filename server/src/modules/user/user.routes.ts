import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import * as userController from "./user.controller";
import { changePasswordSchema, changePinSchema, updateProfileSchema } from "./user.validation";
import { Router } from "express";

const router = Router();

router.use(authenticate);

router.get("/profile", userController.getProfile);
router.put("/profile", validate(updateProfileSchema), userController.updateProfile);
router.put("/password", validate(changePasswordSchema), userController.changePassword);
router.put("/pin", validate(changePinSchema), userController.changePin);
router.get("/sessions", userController.getSessions);
router.delete("/sessions/:id", userController.revokeSession);

export default router;

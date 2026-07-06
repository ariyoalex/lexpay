import { Router } from "express";
const router = Router();

router.post("/register");
router.post("/login");
router.post("/logout");
router.post("/refresh-token");
router.post("/verify-email");
router.post("/verify-phone");
router.post("/forgot-password");
router.post("/reset-password");
router.post("/enable-2fa");
router.post("/verify-2fa");

export default router;

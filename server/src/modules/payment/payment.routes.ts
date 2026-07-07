import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import * as paymentController from "./payment.controller";
import { Router } from "express";
import { z } from "zod";

const router = Router();

export const initializeSchema = z.object({
  body: z.object({
    amount: z.number().positive().min(100).max(10000000),
  }),
});

export const verifySchema = z.object({
  body: z.object({
    reference: z.string().min(1),
  }),
});

router.post("/initialize", authenticate, validate(initializeSchema), paymentController.initialize);
router.post("/verify", authenticate, validate(verifySchema), paymentController.verify);
router.post("/webhook", paymentController.webhook);
router.get("/methods", authenticate, paymentController.getMethods);

export default router;

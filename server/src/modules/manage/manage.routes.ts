import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import * as manageController from "./manage.controller";
import { Router } from "express";
import { z } from "zod";

const router = Router();

router.use(authenticate);
router.use(authorize("manage"));

router.get("/dashboard", manageController.dashboard);

router.get("/users", manageController.users);
router.put("/users/:id/toggle-status", manageController.toggleStatus);

router.get("/transactions", manageController.transactions);

router.post(
  "/wallets/:userId/freeze",
  validate(z.object({ body: z.object({ reason: z.string().min(1) }) })),
  manageController.freezeWallet,
);
router.post("/wallets/:userId/unfreeze", manageController.unfreezeWallet);

router.get("/audit-logs", manageController.auditLogs);
router.get("/analytics", manageController.analytics);
router.post(
  "/broadcast",
  validate(
    z.object({
      body: z.object({ title: z.string().min(1), message: z.string().min(1), target: z.enum(["all", "manage"]) }),
    }),
  ),
  manageController.broadcast,
);

export default router;

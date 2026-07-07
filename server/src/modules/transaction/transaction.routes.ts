import { authenticate } from "../../middleware/authenticate";
import * as transactionController from "./transaction.controller";
import { Router } from "express";

const router = Router();

router.use(authenticate);

router.get("/", transactionController.list);
router.get("/:id", transactionController.getById);

export default router;

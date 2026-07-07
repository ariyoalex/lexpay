import { authenticate } from "../../middleware/authenticate";
import * as transactionController from "./transaction.controller";
import { Router } from "express";

const router = Router();

router.use(authenticate);

router.get("/", transactionController.list);
router.get("/export/csv", transactionController.exportCsv);
router.get("/export/pdf", transactionController.exportPdf);
router.get("/statement", transactionController.statement);
router.get("/:id", transactionController.getById);

export default router;

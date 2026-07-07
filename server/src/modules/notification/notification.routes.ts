import { authenticate } from "../../middleware/authenticate";
import * as notificationController from "./notification.controller";
import { Router } from "express";

const router = Router();

router.use(authenticate);

router.get("/", notificationController.list);
router.get("/unread-count", notificationController.unreadCount);
router.put("/:id/read", notificationController.markRead);
router.put("/read-all", notificationController.markAllRead);

export default router;

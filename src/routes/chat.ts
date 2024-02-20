import { Router } from "express";
import ChatController from "../controllers/chat";

const router = Router();
const controller = new ChatController();

router.post("/openAiStream", (req, res) => controller.streamResponse(req, res));
router.post("/loadMessages", (req, res) => controller.getMessages(req, res));
router.post("/loadOldMessages", (req, res) =>
  controller.getOldMessages(req, res)
);

export default router;

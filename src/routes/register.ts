import { Router } from "express";
import RegisterController from "../controllers/register";

const router = Router();
const controller = new RegisterController ()
router.post('/', (req, res) => controller.handleNewUser(req, res))

export default router
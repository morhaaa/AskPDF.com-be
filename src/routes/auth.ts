import express from 'express';
import AuthController from '../controllers/auth';

const router = express.Router();
const controller = new AuthController()

router.post('/', (req, res) => controller.handleLogin(req, res));

export default router;

import { Router }from 'express';
import AuthController from '../controllers/auth';

const router = Router();
const controller = new AuthController()

router.post('/', (req, res) => controller.handleLogin(req, res));

export default router;

import { Router }from 'express';
import AuthController from '../controllers/auth';

const router = Router();
const controller = new AuthController()

router.post('/login', (req, res) => controller.handleLogin(req, res));
router.get('/', (req, res) => controller.getUserByToken(req, res));

export default router;

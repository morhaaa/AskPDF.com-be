import { Router } from 'express';
import LogoutController from '../controllers/logout';

const router = Router();
const controller = new LogoutController

router.get('/', (req, res) => controller.handleLogout(req, res));

module.exports = router;
import { Router } from 'express';
import { getUser, createUser, updateUser, deleteUser } from '../controllers/user';

const router = Router();


router.get('/:userId', async (req, res, next) => {
    try {
        await getUser(req, res, next);
    } catch (error) {
        next(error);
    }
});


router.post('/', async (req, res, next) => {
    try {
        await createUser(req, res, next);
    } catch (error) {
        next(error);
    }
});


router.put('/:userId', async (req, res, next) => {
    try {
        await updateUser(req, res, next);
    } catch (error) {
        next(error);
    }
});


router.delete('/:userId', async (req, res, next) => {
    try {
        await deleteUser(req, res, next);
    } catch (error) {
        next(error);
    }
});

export default router;

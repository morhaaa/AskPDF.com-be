import { Request, Response, NextFunction } from 'express';
import { UserService } from '../service/user';

const userService = new UserService();

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getUser(req.params.userId);

        if (user !== null) {
            res.status(200).send({
                success: true,
                data: user,
            });
        } else {
            res.status(404).send({
                success: false,
                message: `No user found`,
            });
        }
    } catch (err) {
        next(err);
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser = await userService.createUser(req.body);

        res.status(201).send({
            success: true,
            data: newUser,
        });
    } catch (err) {
        next(err);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedUser = await userService.updateUser(req.params.userId, req.body);

        if (updatedUser !== null) {
            res.status(200).send({
                success: true,
                data: updatedUser,
            });
        } else {
            res.status(404).send({
                success: false,
                message: `No user found`,
            });
        }
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await userService.deleteUser(req.params.userId);

        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

import { Request, Response } from "express";

class LogoutController {

    public handleLogout (req: Request, res: Response) {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(204); //No content

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
        res.sendStatus(204);

    }

}

export default LogoutController
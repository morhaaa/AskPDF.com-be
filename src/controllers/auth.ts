import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { AuthService } from "../service/auth";

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public handleLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required." });
        return;
      }

      const authenticatedUser = await this.authService.getUser(email, password);

      if (authenticatedUser) {
        const token = jwt.sign(
          { user_id: authenticatedUser._id },
          process.env.JWT_SECRET_KEY || ""
        );

        //JWT as Cookie
        res.cookie("jwt_token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
          status: 200,
          success: true,
          message: "login success",
          token: token,
          user: {
            username: authenticatedUser.username,
            email: authenticatedUser.email,
            memberShip: authenticatedUser.memberShip,
            role: authenticatedUser.role,
          },
        });
      } else {
        res.sendStatus(401);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  public getUserByToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.cookies.jwt_token

      console.log(req.cookies.jwt_token)

      if (!token) {
       res.status(401).json({ message: 'Unauthorized' });
       return
      }

      jwt.verify(token, process.env.JWT_SECRET_KEY as string, async (err: any, decoded: any) => {

        if (err) {
          return res.status(401).json({ message: 'Token invalid' });
        }

        const user = await this.authService.getUserById( decoded.user_id);

        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }

        res.status(200).json({
          status: 200,
          success: true,
          message: "login success",
          token: token,
          user: {
            username: user.username,
            email: user.email,
            memberShip: user.memberShip,
            role: user.role,
          },
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}



export default AuthController;

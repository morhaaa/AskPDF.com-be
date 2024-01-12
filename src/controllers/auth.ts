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
          { username: authenticatedUser.username },
          process.env.JWT_SECRET_KEY || "",
          { expiresIn: "1d" }
        );

        //JWT as Cookie
        res.cookie("jwt", token, {
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
}

export default AuthController;

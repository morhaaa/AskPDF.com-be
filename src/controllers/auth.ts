import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { AuthService } from '../service/auth';

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public handleLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required.' });
        return;
      }

      const authenticatedUser = await this.authService.getUser(username, password);

      if (authenticatedUser) {
        const accessToken = jwt.sign(
          { UserInfo: { username: authenticatedUser.username } },
          process.env.ACCESS_TOKEN_SECRET ?? '',
          { expiresIn: '5min' }
        );

        const refreshToken = jwt.sign(
          { username: authenticatedUser.username },
          process.env.REFRESH_TOKEN_SECRET ?? '',
          { expiresIn: '1d' }
        );

        //Save the refresh token
        authenticatedUser.refreshToken = refreshToken;
        const result = await authenticatedUser.save();
        console.log(result);

        //Save a cookie
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });

        res.json({ accessToken });
      } else {
        res.sendStatus(401);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}

export default AuthController;

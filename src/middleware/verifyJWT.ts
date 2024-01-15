import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export default function verifyJWT(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, (process.env as any).JWT_SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: 'Token invalid' });
    }
    (req as any).user = decoded;
    next();
  });
}

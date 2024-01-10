import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export default function verifyJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader) {
    return res.sendStatus(401);
  }

  const token = Array.isArray(authHeader) ? authHeader[0] : authHeader;

  if (!token || !token.startsWith('Bearer ')) {
    return res.sendStatus(401);
  }

  const tokenValue = token.split(' ')[1];

  try {
    const decoded = jwt.verify(tokenValue, (process.env as any).JWT_SECRET_KEY);
    (req as any).user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

}

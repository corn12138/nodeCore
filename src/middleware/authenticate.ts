// jwt 中间件认证  将token的信息解出来
// src/middleware/authenticate.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401); // 未授权
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403); // 禁止访问
    }
    req.user = user; // 将用户信息添加到请求对象中
    next(); // 继续处理请求
  });
};

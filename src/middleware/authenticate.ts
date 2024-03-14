import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // 从Cookie中获取token
//   console.log(req.cookies, '是否存在');
  const token = req.cookies.token;
//   console.log(token, '是否存在');

  if (!token) {
    return res.status(401).json({ successed:false,message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, 'yourSecretKey', (err: any, user: any) => {
    if (err) {
      // 返回更具体的错误信息
      return res.status(403).json({ successed:false,message: "Forbidden access: " + err.message });
    }
    req.user = user; // 将用户信息添加到请求对象中
    console.log(user, '这是JWT的用户信息');
    next(); // 继续处理请求
  });
};

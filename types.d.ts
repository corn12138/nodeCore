// types.d.ts 或者其他你创建的 .d.ts 文件
import express from 'express';
import { IUser } from './src/controllers/authController'; // 更新为您模型的实际路径
declare global {
  namespace Express {
    interface User extends IUser { } // IUser
    interface Request {
      user?: any;
    }
  }
}


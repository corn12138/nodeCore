// src/controllers/authController.ts
import { Request, Response } from 'express';
import User from '../models/user';
import LogoutRecord from '../models/logoutRecord'
import bcrypt from 'bcryptjs';
import passport from 'passport'; // 确保已经初始化了Passport
import jwt from 'jsonwebtoken';
// 定义一个接口
export interface IUser {
    username: string;
    email: string;
    last_login: string;
    id: string;
    // ...其他字段...
}
// 登录接口
export const loginUser = async (req: Request, res: Response) => {
    try {
        // Find the user by username
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).json({ success: false, status: 400, message: 'User not found' });
        }
        // Check if password is correct
        // 这个是bcrypt加密的哈希密码的比对的
        // const isMatch = await bcrypt.compare(req.body.password, user.password);
        // if (!isMatch) {
        //     return res.status(400).json({ message: 'Invalid credentials' });
        // }
        // 由于密码是明文存储，直接比较字符串
        if (req.body.password !== user.password) {
            return res.status(400).json({ success: false, status: 400, message: 'Invalid credentials' });
        }
        const userForResponse: IUser = {
            username: user.username,
            email: user.email,
            last_login: user.last_login,
            id: user.id,
            // ...其他需要返回的字段...
        };

        // User matched, create JWT Payload 签发jwt
        const payload = {
            user: {
                id: user.id
            }
        };

        // Sign token
        jwt.sign(payload, 'yourSecretKey', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ success: true, status: 200, token: token, user: userForResponse });
        });
        // passport的中间件
        // passport.authenticate('local', ( user, info,err) => {
        //     if (err) { return next(err); }
        //     if (!user) { return res.status(400).json(info); }
        // })(req, res, next);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
export const logoutUser = async (req: Request, res: Response) => {
    try {
        // 假设你的用户信息存储在req.user中，如果使用了如passport这样的中间件
        // const username = req.user?.username;
        const username = (req as any).user?.username;

        // 创建一条退出记录
        const logoutRecord = new LogoutRecord({
            username: username,
            logoutTime: new Date() // 或者使用 Date.now()
        });

        // 保存记录到数据库
        await logoutRecord.save();

        // 发送响应到客户端
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).send('Server error during logout');
    }
};

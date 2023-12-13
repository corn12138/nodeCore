// src/controllers/authController.ts
import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// 定义一个接口
interface IUser {
    username: string;
    email: string;
    last_login: string;
    // ...其他字段...
}
export const loginUser = async (req: Request, res: Response) => {
    try {
        // Find the user by username
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        // Check if password is correct
        // 这个是bcrypt加密的哈希密码的比对的
        // const isMatch = await bcrypt.compare(req.body.password, user.password);
        // if (!isMatch) {
        //     return res.status(400).json({ message: 'Invalid credentials' });
        // }
        // 由于密码是明文存储，直接比较字符串
        if (req.body.password !== user.password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const userForResponse: IUser = {
            username: user.username,
            email: user.email,
            last_login: user.last_login
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
            res.json({ token: token, user: userForResponse });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

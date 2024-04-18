// src/controllers/authController.ts
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import User from '../models/user';
import LogoutRecord from '../models/logoutRecord'  //退出登录信息 记录到MongoDB
import reportRecord from "../models/reportRecord"; //上报信息
import { KLineData } from "../models/chartData" //获取k线图的 MongoDB的连接
import bcrypt from 'bcryptjs';
import * as passport from 'passport';// 确保已经初始化了Passport
import jwt from 'jsonwebtoken';
import { getKLineChartData } from '../services/chartService';
import UploadSessionService from '../services/UploadSessionService'; //关于文件上传的会话储存

// 定义一个接口
export interface IUser {
    [x: string]: any;
    username: string;
    email: string;
    last_login: string;
    id: string;
    // ...其他字段...
}
// 扩展Express的Request接口
declare global {
    namespace Express {
        interface Request {
            user?: IUser; // 或者更具体的类型，如果您知道的话
            timestamp?: Date,
            userAgent?: any
        }
    }
}
// 登录接口
export const loginUser = async (req: Request, res: Response) => {
    try {
        // Find the user by username
        // const user = await User.findOne({ username: req.body.username });
        // if (!user) {
        //     return res.status(400).json({ success: false, status: 400, message: 'User not found' });
        // }
        // 假设通过Passport认证的用户已存储在req.user中
        const user = req.user as IUser;
        console.log(user, 'userssssss')
        if (!user) {
            return res.status(400).json({ success: false, status: 401, message: 'Authentication failed' });
        }
        // Check if password is correct
        // 这个是bcrypt加密的哈希密码的比对的
        // const isMatch = await bcrypt.compare(req.body.password, user.password);
        // if (!isMatch) {
        //     return res.status(400).json({ message: 'Invalid credentials' });
        // }
        // 由于密码是明文存储，直接比较字符串
        // if (req.body.password !== user.password) {
        //     return res.status(400).json({ success: false, status: 400, message: 'Invalid credentials' });

        // }
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
                id: user.id,
                username: user.username,
                email: user.email,
                last_login: user.last_login,
            }
        };

        // Sign token
        jwt.sign(payload, 'yourSecretKey', { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            // 设置 HttpOnly Cookie
            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000 });
            // 成功后 返回 token和user 用户信息
            res.json({ success: true, status: 200, token: token, user: userForResponse, msg: '用户成功登录！！' });
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
// 退出登录
export const logoutUser = async (req: Request, res: Response) => {
    try {
        // 假设你的用户信息存储在req.user中，如果使用了如passport这样的中间件
        // const username = req.user?.username; 
        // const user = req.user as IUser;
        const username = req.user.user.username
        console.log(username, '请求数据')
        // 记录用户的 IP 和当前时间
        const userIp = req.ip;
        const logoutTime = new Date();
        // 创建一条退出记录
        const logoutRecords = new LogoutRecord({
            username: username,
            logoutTime: logoutTime, // 或者使用 Date.now()
            userIp: userIp // 

        });

        // 保存记录到数据库
        await logoutRecords.save();
        // 清除会话信息（如果适用）
        req.session.destroy(); // 如果您使用了会话
        res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
        // 发送响应到客户端
        res.status(200).json({ message: 'Logged out successfully', successed: true });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error during logout', successed: false });
    }
};
// 上报的接口
export const reportUser = async (req: Request, res: Response) => {
    try {
        console.log(req, '上报信息')
        // 
        const reportData = req.body;
        const user = req.user as IUser;
        const username = user.user.username
        const timestamp = req.body ? req.body.timestamp : req.timestamp
        const userAgent = req.body ? req.body.userAgent : req.userAgent
        // 创建一条退出记录
        const reportDatas = new reportRecord({
            username: username,
            timestamp: timestamp,
            userAgent: userAgent
        });

        // 保存记录到数据库
        await reportDatas.save();
        // 发送响应到客户端
        res.status(200).json({ reportDataBool: true, message: '上报信息成功' });
        // console.log(reportData, '上报信息')

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ reportDataBool: true, message: 'Server error during report' });
    }
};

// 首次加载页面的时候便请求 csrf token 放在cookie里 以便后续使用
export const csrfToken = async (req: Request, res: Response) => {
    try {
        // csrf令牌 放在cookie里边
        res.cookie('XSRF-TOKEN', req.csrfToken());
        res.status(200).json({ successed: true, message: 'csrf token set is success' })
    } catch (error) {
        res.status(500).json({ successed: false, message: `error:${error}` });
    }

};
// 获取图表的接口
export const getChartData = async (req: Request, res: Response) => {
    try {
        const items = await getKLineChartData();
        res.status(200).json({ successed: true, items: items, status: 200 });
    } catch (error) {
        res.status(500).json({ successed: false, message: error.message, status: 500 });
    }
}
// 处理上传文件的
export const uploadFiles = async (req: Request, res: Response) => {
    // UploadSessionService
    try {
        const { chunkIndex, totalChunks, fileId } = req.body;
        // 存储每个文件块到临时的目录里边
        const tempDir = path.join(__dirname, '..', 'temp', fileId);
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        const chunkPath = path.join(tempDir, chunkIndex.toString());
        fs.writeFileSync(chunkPath, req.file.buffer);
        // 更新上传会话状态
        const session = await UploadSessionService.updateSession(fileId, chunkIndex, totalChunks);
        // 若是所有块都上传了，进行文件的合并
        if (session.completedChunks.length === totalChunks) {
            const finalFilePath = path.join(__dirname, '..', 'uploads', fileId);
            for (let i = 0; i < totalChunks; i++) {
                const chunk = fs.readFileSync(path.join(tempDir, i.toString()))
                fs.appendFileSync(finalFilePath, chunk);
                fs.unlinkSync(path.join(tempDir, i.toString())); //删除已合并的块
            }
            fs.rmdirSync(tempDir);//清理临时的目录
            await UploadSessionService.clearSession(fileId); //清除会话
            res.status(200).json({ succcessed: true, fileId: fileId, status: 200 })
        }
    } catch (error) {
        res.status(500).json({ successed: false, message: error.message, status: 500 });
    }
}
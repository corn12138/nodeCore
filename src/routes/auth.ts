// src/routes/auth.ts
import express from 'express';
import passport from '../config/passportConfig'
import { loginUser, logoutUser, reportUser, csrfToken, getChartData, uploadFiles } from '../controllers/authController';
import { authenticateToken } from "../middleware/authenticate";
import multer from "multer";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); //存储
// 登录
router.post('/login', passport.authenticate('local', {
    // successRedirect: loginUser, //成功后重定向
    // failureRedirect: '/login', //失败后重定向
    failureFlash: true
}), loginUser);
// 退出登录
router.post('/logout', authenticateToken, logoutUser);
// 上报信息
router.post('/report', authenticateToken, reportUser)
// 获取csrf 
router.get('/csrfs', csrfToken);
//获取 k线图的接口
router.post('/getChartData', authenticateToken, getChartData)
router.post('/upload/chunk', upload.single('chunk'),authenticateToken, uploadFiles);
export default router;

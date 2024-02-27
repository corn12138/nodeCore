// src/routes/auth.ts
import express from 'express';
import passport from '../config/passportConfig'
import { loginUser, logoutUser ,reportUser} from '../controllers/authController';
import { authenticateToken } from "../middleware/authenticate";

const router = express.Router();
// 登录
router.post('/login', passport.authenticate('local', {
    // successRedirect: loginUser, //成功后重定向
    // failureRedirect: '/login', //失败后重定向
    failureFlash: true
}), loginUser);
// 退出登录
router.post('/logout',authenticateToken,logoutUser);
// 上报信息
router.post('/report',authenticateToken,reportUser)
export default router;

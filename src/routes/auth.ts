// src/routes/auth.ts
import express from 'express';
import passport from '../config/passportConfig'
import { loginUser, logoutUser } from '../controllers/authController';

const router = express.Router();

router.post('/login', passport.authenticate('local', {
    // successRedirect: loginUser, //成功后重定向
    // failureRedirect: '/login', //失败后重定向
    failureFlash: true
}), loginUser);
router.post('/logout',logoutUser);

export default router;

// src/routes/auth.ts
import express from 'express';
import passport from 'passport';
import { loginUser, logoutUser } from '../controllers/authController';

const router = express.Router();

router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;

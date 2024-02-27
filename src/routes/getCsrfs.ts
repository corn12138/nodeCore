// src/routes/auth.ts
import express from 'express';
import {csrfToken} from '../controllers/authController';
const router = express.Router();

// 获取csrf 
router.get('/csrfs',csrfToken)
export default router;

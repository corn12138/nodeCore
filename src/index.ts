// src/index.ts
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import './config/database'; // 这里导入 database.ts 来初始化数据库连接
import passport from 'passport';
import passportConfig from './config/passportConfig'; // 更新为正确的路径
const app = express();

// Enable CORS for all requests
app.use(cors());
// 初始化Passport
passportConfig(passport);
app.use(passport.initialize()); // 初始化Passport
// app.use(passport.session()); // 初始化Passport
app.use(express.json()); // Body parser middleware 解析JSON格式的请求体
app.use('/api/auth', authRoutes); // 使用auth路由

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

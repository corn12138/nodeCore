// src/index.ts
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import getCsrfs from "./routes/getCsrfs";
import menuItem from './routes/menu';
import './config/database'; // 这里导入 database.ts 来初始化数据库连接
import session, { Session, SessionData } from 'express-session'; //这是session会话的中间件
import passport from 'passport';  //passport中间件
import cookieParser from "cookie-parser";
import csrf from "csurf";  //csrf 增加安全性

// 创建类型声明文件 否则 csrfToken()、session报错
declare module 'express-serve-static-core' {
  interface Request {
    csrfToken(): string;
    session: Session & Partial<SessionData> & { destroy: () => void };
  }
}
// import passportConfig from './config/passportConfig'; // 更新为正确的路径
const app = express();
const corsOptions = {
  origin: 'http://localhost:3000', // 替换为您的前端域名
  credentials: true, // 允许跨域请求携带凭证（允许发送cookies）
};
// 这个appuse 在所有的use之前
app.use(cors(corsOptions)) //这个设置只接受来自前端 http://localhost:3000的访问
// 设置express-session中间件
app.use(session({
  secret: 'yourSecretKey', // 替换为一个随机密钥（）
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 设置cookie的过期时间，例如，1天
  },
  httpOnly: true, //防止客户端脚本访问cookie，增加安全性
  secure: false, //设置secure: true，这样cookie只会通过HTTPS传输

}));

// 初始化Passport--一般在 上边的session之后立即调用
app.use(passport.initialize());
app.use(passport.session()); // 如果您使用会话
app.use(express.json()); // Body parser middleware 解析JSON格式的请求体 --所以应在路由之前调用
// 配置 cookie-parser
app.use(cookieParser());

// // 配置CSRF 保护
const csrfProtection = csrf({ cookie: true });  //cookie中读取这个 csrf
// // 应用csrf去保护所有的路由
// app.use(csrfProtection);
// app.use((req, res, next) => {
//   res.setHeader('X-CSRF-Token', req.csrfToken());
//   next();
// });

app.use('/api/auth', authRoutes, menuItem); // 使用auth menu路由
app.use('/api/auth',csrfProtection, getCsrfs); 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

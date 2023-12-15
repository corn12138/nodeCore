import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import User from '../models/user'; // 确保路径正确

/* 本地策略（改为Promise或async await 因为原来的findOne ,Model.findOne() no longer accepts a callback at Function.findOne ）*/
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username: username }).exec();
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }

        // 由于密码是明文存储，直接比较字符串
        if (password === user.password) {
            // 密码匹配，返回用户
            return done(null, user);
        } else {
            // 密码不匹配
            return done(null, false, { message: 'Incorrect password.' });
        }
    } catch (err) {
        return done(err);
    }
}));

// JWT策略
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'yourSecretKey' // 替换为你的密钥
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.sub).exec();
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
}));

// 序列化用户
passport.serializeUser((user, done) => {
    console.log(user, '序列化用户');
    done(null, user.id);
});

// 反序列化用户
passport.deserializeUser(async (id, done) => {
    try {
        console.log(id, '反序列化用户');
        // 使用 findOne 和自定义 id 字段来获取用户
        const user = await User.findOne({ id: id }).exec();  //findOne是根据数据库的自定义的id来查，如果是根据 findById  那就是根据 MongoDB的自动的_id格式去查找的
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport;

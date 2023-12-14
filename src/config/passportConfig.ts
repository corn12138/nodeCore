import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import User from '../models/user'; // 更新为正确的路径
export default function initialize(passport: passport.PassportStatic) {
    // 本地策略
    passport.use(new LocalStrategy((username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
            // 这个是bcrypt加密的哈希密码的比对的
            // bcrypt.compare(password, user.password, (err, res) => {
            //   if (res) {
            //     // 密码匹配，返回用户
            //     return done(null, user);
            //   } else {
            //     // 密码不匹配
            //     return done(null, false, { message: 'Incorrect password.' });
            //   }
            // });
            // 由于密码是明文存储，直接比较字符串
            if (password == user.password) {
                // 密码匹配，返回用户
                return done(null, user);
            } else {
                // 密码不匹配
                return done(null, false, { message: 'Incorrect password.' });
            }
        });
    }));

    // JWT策略
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'yourSecretKey' // 替换为你的密钥
    };

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.sub, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));
    // 序列化用户
    passport.serializeUser(function (user, done) {
        console.log(user, '序列化用户')
        done(null, user.id);
    });

    // 反序列化用户
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            console.log(user, '反序列化用户')
            done(err, user);
        });
    });
}
// export default passport;

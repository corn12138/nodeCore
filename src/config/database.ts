// import mongoose from 'mongoose';

// const mongoURI: string = 'mongodb://127.0.0.1:27017/user_accounts'; // 使用您的数据库名称

// mongoose.connect(mongoURI)
//   .then(() => console.log('MongoDB 连接成功...'))
//   .catch(err => console.error('MongoDB 连接错误:', err));

// mongoose.connection.on('connected', () => {
//   console.log('Mongoose 已连接到 MongoDB。');
// });

import mongoose from 'mongoose';
import fs from 'fs'
import path from 'path';
// 这里有一个超级大坑 一定要把对应的 安全证书就是.pem文件放到项目里来引入认证 否则 从电脑其他盘引入 一直报错 （服务器上显示是 tls握手过程未收到来自 客户端的ssl证书）
const certPath = path.join(__dirname, 'CAfile', 'mongodb.pem');
// const cert = fs.readFileSync(certPath);

// 替换为你的云服务器的IP地址或域名
const mongoHost = '8.137.90.227';

// 如果你的数据库需要认证，包括用户名和密码
const mongoUser = 'myAdminUser';
const mongoPass = 'myAdminPassword';
const mongoDBName = 'user_accounts';


const mongoURI = `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:27017/${mongoDBName}?authSource=admin&tls=true`;


const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsCAFile: certPath,
  tlsCertificateKeyFile: certPath,
  tlsAllowInvalidCertificates: true, // 只有在自签名证书时设为 true
  // 其他选项...
};

mongoose.connect(mongoURI, options)
  .then(() => console.log('MongoDB 连接成功...'))
  .catch(err => console.error('MongoDB 连接错误:', err));

mongoose.connection.on('connected', () => {
  console.log('Mongoose 已连接到 MongoDB。');
});


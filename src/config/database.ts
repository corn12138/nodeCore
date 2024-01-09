import mongoose from 'mongoose';

const mongoURI: string = 'mongodb://localhost:27017/user_accounts'; // 使用您的数据库名称

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB 连接成功...'))
  .catch(err => console.error('MongoDB 连接错误:', err));

mongoose.connection.on('connected', () => {
  console.log('Mongoose 已连接到 MongoDB。');
});

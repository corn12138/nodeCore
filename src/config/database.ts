import mongoose from 'mongoose';

const mongoURI: string = 'mongodb://localhost:27017/user_accounts'; // 使用你的数据库名称

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
  });
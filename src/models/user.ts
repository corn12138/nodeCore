// src/models/user.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  last_login: { type: String, required: true },
  id: { type: String, required: true },
  // ...其他字段...
});

// const User = mongoose.model('User', userSchema);
const User = mongoose.model('User', userSchema, 'user_logins');


export default User;

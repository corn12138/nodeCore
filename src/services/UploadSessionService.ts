// 上传文件的-- 文件上传会话
// services/UploadSessionService.ts
import mongoose from 'mongoose';

// 定义 MongoDB 文档模型
const uploadSessionSchema = new mongoose.Schema({
  fileId: { type: String, unique: true },
  totalChunks: Number,
  completedChunks: { type: [Number], default: [] },
});

const UploadSession = mongoose.model('UploadSession', uploadSessionSchema);

class UploadSessionService {
  // 创建新的上传会话（如果没有对应的fileid 就会自动创建）
  static async createSession(fileId: string, totalChunks: number) {
    try {
      const session = new UploadSession({ fileId, totalChunks });
      await session.save();
      return session;
    } catch (error) {
      console.error('Error creating upload session:', error);
      throw error;
    }
  }

  // 更新已上传的文件块信息
  static async updateSession(fileId: string, chunkIndex: number, totalChunks: number) {
    try {
      let session = await UploadSession.findOne({ fileId });
      if (!session) {
        session = await this.createSession(fileId, totalChunks);
      }
      
      if (!session.completedChunks.includes(chunkIndex)) {
        session.completedChunks.push(chunkIndex);
        await session.save();
      }

      return session;
    } catch (error) {
      console.error('Error updating upload session:', error);
      throw error;
    }
  }

  // 获取特定的上传会话
  static async getSession(fileId: string) {
    try {
      return await UploadSession.findOne({ fileId });
    } catch (error) {
      console.error('Error getting upload session:', error);
      throw error;
    }
  }

  // 检查文件上传是否完成
  static isUploadComplete(session) {
    return session && session.totalChunks === session.completedChunks.length;
  }

  // 清理上传会话
  static async clearSession(fileId: string) {
    try {
      await UploadSession.deleteOne({ fileId });
    } catch (error) {
      console.error('Error clearing upload session:', error);
      throw error;
    }
  }
}

export default UploadSessionService;

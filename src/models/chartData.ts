// models/KLineData.ts  
import mongoose, { Schema, Document } from 'mongoose';

// 定义 KLineData 接口
interface IKLineData extends Document {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

// 创建 KLineData 的 Mongoose 模式
const kLineDataSchema = new Schema<IKLineData>({
  date: { type: Date, required: true },
  open: { type: Number, required: true },
  high: { type: Number, required: true },
  low: { type: Number, required: true },
  close: { type: Number, required: true },
});

// 创建并导出 Mongoose 模型
export const KLineData = mongoose.model<IKLineData>('chart_data', kLineDataSchema, 'chart_data');

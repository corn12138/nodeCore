// 上报记录到数据库里
import mongoose, { Schema, Document } from "mongoose";

export interface Ireport extends Document {
    username: string,
    timestamp: Date,
    userAgent: string
}
const ReportRecordSchema: Schema = new Schema({
    username: { type: String, required: true },
    timestamp: { type: Date, require: true },
    userAgent: { type: String, require: false }
});
export default mongoose.model<Ireport>("user_record", ReportRecordSchema)
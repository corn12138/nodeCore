// 退出登录记载到数据库里
import mongoose,{Schema,Document} from "mongoose";
export interface ILogoutRecord extends Document {
username:string,
logoutTime:Date,
userIp:string|any
}
const LogoutRecordSchema:Schema = new Schema({
username:{type:String,required:true},
logoutTime:{type:Date,required:true,default:Date.now()},
userIp:{type:String,require:false}
})

export default mongoose.model<ILogoutRecord>('user_logout',LogoutRecordSchema)

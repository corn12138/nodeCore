import mongoose,{Schema,Document} from "mongoose";
export interface ILogoutRecord extends Document {
username:string,
logoutTime:Date
}
const LogoutRecordSchema:Schema = new Schema({
username:{type:String,required:true},
logoutTime:{type:Date,required:true,default:Date.now()}
})

export default mongoose.model<ILogoutRecord>('user_logout',LogoutRecordSchema)

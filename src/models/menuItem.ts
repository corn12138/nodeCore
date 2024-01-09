// models/menuItem.ts
import mongoose, { Schema } from 'mongoose';

interface IMenuItem {
  label: string;
  key: string;
  icon?: string;
  children?: IMenuItem[];
  type?: string;
}

const menuItemSchema = new Schema<IMenuItem>({
  label: { type: String, required: true },
  key: { type: String, required: true },
  icon: String,
  children: [{ type: Schema.Types.ObjectId, ref: 'MenuItem' }],
  type: String,
}, {
  timestamps: true,
});

// Specify the collection name if it does not follow the Mongoose default naming convention
export const MenuItem = mongoose.model<IMenuItem>('MenuItem', menuItemSchema, 'menuList');

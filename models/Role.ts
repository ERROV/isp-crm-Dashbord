import mongoose, { Schema, models, model, Document } from 'mongoose';
import { Permission, Role as IRole } from '../types';

const RoleSchema = new Schema<IRole>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  permissions: [{
    type: String,
    enum: Object.values(Permission),
  }],
}, { timestamps: true });

export default models.Role || model<IRole>('Role', RoleSchema);

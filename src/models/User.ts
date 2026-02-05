import { createId } from '@paralleldrive/cuid2'
import { Schema, Types, model } from 'mongoose'

export interface IUser extends Document {
    _id: Types.ObjectId
    name: string
    email: string
    publicId: string
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    publicId: { 
        type: String,
        default: () => createId(),
        unique: true
    }
})

// create index for fast lookups
UserSchema.index({ publicId: 1 })

export const User = model<IUser>('User', UserSchema)
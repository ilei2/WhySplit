import { createId } from '@paralleldrive/cuid2'
import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    publicId: { 
        type: String,
        default: () => createId(),
        unique: true
    }
})

export const User = model('User', UserSchema)
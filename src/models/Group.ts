import { createId } from '@paralleldrive/cuid2'
import { Schema, Types, model } from 'mongoose'
import { IUser } from './User'

export interface IGroup extends Document {
    groupName: string,
    groupId: string,
    participants: IUser[]
}

const GroupSchema = new Schema<IGroup>({
    groupName: { type: String, required: true},
    groupId: { 
        type: String,
        default: () => createId(),
        unique: true
    },
    participants: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        validate: {
            validator: function(participants: Types.ObjectId[] | IUser[]) {
                return participants.length > 1
            },
            message: 'A group must have at least two participants.'
        },
        required: true
    }
}, { timestamps: true })

// create index for fast lookups
GroupSchema.index({ groupId: 1 })

export const Group = model<IGroup>('Group', GroupSchema)
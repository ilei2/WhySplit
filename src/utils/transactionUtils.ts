import { Types } from "mongoose"
import { Group, IGroup } from "../models/Group"
import { IUser } from "../models/User"

/**
 * Verifies that involved participants are valid members of the group
 * @param involvedParticipants 
 * @param groupParticipants 
 * @returns 
 */
export function verifyParticipants(involvedParticipants: string[], groupParticipants: Types.ObjectId[] | IUser[]) {
    console.log('group participants: ', groupParticipants)
    const participants = groupParticipants as IUser[]
    const groupMemberIds = participants.map(p => p._id.toString())
    const isValid = involvedParticipants.every((id: string) => 
        groupMemberIds.includes(id)
    )
    if (isValid) {
        return involvedParticipants
    } else {
        throw new Error(`Invalid participants to split expenses with: ${involvedParticipants}`)
    }
}

/**
 * Verifies that group exists
 * @param groupId 
 * @returns 
 */
export async function verifyGroup(groupId: string): Promise<IGroup> {
    const group = await Group.findOne({ groupId }).populate('participants')
    if (!group) {
        throw new Error(`Group not found ${groupId}`)
    }
    return group
}
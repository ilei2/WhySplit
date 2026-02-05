import { Types } from "mongoose"
import { IUser } from "../models/User"

/**
 * This method will calculate how much each person owes for a given expense.
 * 
 * The person who paid is owed (amount they paid - one share)
 * People who owe money will owe (-share)
 * People not involved will owe 0.
 */
export function calculateExpenses(groupParticipants: IUser[], data: any) {
    // get data variables
    let { payer, totalAmount, involvedParticipants } = data
    // convert cost into cents
    totalAmount *= 100
    // const involvedMembers = participants.map(id => id.toString())
    const numberOfUsers = involvedParticipants.length
    const share = Math.floor(totalAmount / numberOfUsers)
    const remainder = totalAmount % numberOfUsers
    const randomizer = Math.floor(Math.random() * numberOfUsers)

    const participants = groupParticipants as IUser[]
    const splitDetails = participants.map((user: IUser, index: number) => {
        const userId = user._id.toString()
        const cost = index === randomizer ? share + remainder: share
        let netCost = 0
        const amountPaid = userId === payer ? totalAmount : 0
        if (involvedParticipants.includes(userId)) {
            netCost = amountPaid - cost
        }
        return {
            userId: user._id,
            amount: netCost
        }
    })
    const expense = {
        ...data,
        totalAmount,
        splits: splitDetails
    }
    return expense
}


/**
 *       const totalAmount = data.totalAmount * 100
         const splitDetails = MathUtils.calculateSplits(group.participants, participants, totalAmount, data.payer)
         const expense = {
             ...data,
             totalAmount,
             splits: splitDetails
         }
 */
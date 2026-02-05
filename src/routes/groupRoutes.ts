import express, { NextFunction, Request, Response } from "express"
import { z, ZodError } from "zod"
import { GroupSchema } from "../schemas/group.zod"
import { Group } from "../models/Group"
import { Transaction } from "../models/transaction"
import { IUser, User } from "../models/User"
import * as TransactionUtils from "../utils/transactionUtils"
import { stringify } from 'csv-stringify'
import * as CsvUtils from '../utils/csvUtils'

// global config
export const router = express.Router()

const validateGroupBody = (req: Request, res: Response, next: NextFunction) => {
    try {
        GroupSchema.parse(req.body)
        next()
    } catch (err: unknown) {
        if (err instanceof ZodError) {
            const tree = z.treeifyError(err)
            res.status(400).json({message: "Validation failed", errors: tree})
        } else {
            res.status(500).json({message: "Internal server error"})
        }
    }
}

// POST new group
router.post("/", validateGroupBody, async (req, res) => {
    try {
        // save new group
        const { groupName, participants: publicIds } = req.body
        
        // search for users
        const users = await User.find(
            { publicId: { $in: publicIds } }, 
            { _id: 1 } 
        )
        // 2. Check if we found all participants (optional but recommended)
        if (users.length !== publicIds.length) {
            return res.status(400).json({ 
                message: "One or more participants could not be found." 
            });
        }

        const newGroup = new Group({ groupName, participants: users })
        console.log('new group: ', newGroup)
        const savedGroup = newGroup.save()

        res.status(201).json(savedGroup)
    } catch (error) {
        res.status(400).json({message: "Group creation failed", error})
    }
})

// GET group summary
router.get('/:id/balances', async (req, res) => {
    try {
        const groupId = req.params.id
        // get valid groupId
        const group = await TransactionUtils.verifyGroup(groupId)

        // aggregate amounts and calculate balances
        const balances = await Transaction.aggregate([
            { $match: { groupId } },
            { $unwind: "$splits" },
            {
                $group: {
                    _id: "$splits.userId",
                    totalBalance: { $sum: "$splits.amount" }
                }
            }
        ])

        // return json body of a summary
        console.log('balance: ', balances)
        res.status(200).json(balances)
    } catch (error ) {
        res.status(500).send(`Unable to process request: ${error}`)
    }
})

// GET CSV file of all balances
router.get('/:id/export', async (req, res) => {
    const groupId = req.params.id

    try {
        // get valid group
        const group = await TransactionUtils.verifyGroup(groupId)
    
        // map participants to user friendly names
        const participants = group.participants
        const participantNames = participants.map(p => p.name)

        // Columns matching Example2.csv: Date, Description, Category, Cost, Currency, [Names...]
        const columns = ['Date', 'Description', 'Category', 'Cost', 'Currency', ...participantNames]
        
        
        // set up CSV Stream
        const csv = CsvUtils.initializeCSVStream(res, { 
            filename: `${group.groupName}_Report`, 
            columns 
        })

        // Track running totals for the final row
        const totals: Record<string, number> = {}
        participants.forEach(p => totals[p._id.toString()] = 0)

        // get all transactions
        const transactions = await Transaction.find({ groupId }).sort({ date: 1 })

        // 4. Transform each transaction into a row
        transactions.forEach(tx => {
            const row: any = CsvUtils.createRow(tx)

            // Map each participant's split balance into their specific column
            participants.forEach(p => {
                const userIdStr = p._id.toString()
                // Find the split record for this user in this transaction
                const userSplit = tx.splits.find(s => s.userId.toString() === userIdStr)
                const netAmount = userSplit ? userSplit.amount / 100 : 0

                row[p.name] = netAmount
                totals[userIdStr] += netAmount
            })

            csv.write(row)
        })

        // 5. Add footer: Total Balance 
        csv.write([]) // Spacer row

        const totalRow: any = { 
            Description: 'Total Balance', 
            Currency: 'USD' 
        };
        
        participants.forEach(p => {
            totalRow[p.name] = totals[p._id.toString()]
        });

        csv.write(totalRow);
        csv.end()
    } catch (error ){
        console.error("Export Error:", error)
        res.status(500).send("Internal Server Error")
    }

})

// update Group
router.post("/:id", async (req, res) => {
    try {
        // save updated group
        const groupId = req.params.id
        const group = await Group.findOne({groupId})
        if (group) {
            const { participants } = req.body
            const updatedGroup = Group.findOneAndUpdate(
                {groupId},
                {
                    participants
                },
                { new: true }
            )
            res.status(200).json(updatedGroup)
        } else {
            res.status(404).send(`Unable to find group by id ${groupId}`)
        }
    } catch (error) {
        res.status(400).json({message: "Group creation failed", error})
    }
})

export default router
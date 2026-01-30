import express, { NextFunction, Request, Response } from "express"
import { ObjectId } from "mongodb"
import { Transaction } from "../models/transaction"
import { ExpenseSchema } from "../schemas/expense.zod"
import { z, ZodError } from "zod"

const validateTransactionBody = (req: Request, res: Response, next: NextFunction) => {
    try {
        ExpenseSchema.parse(req.body)
        next()
    } catch (err: unknown) {
        if (err instanceof ZodError) {
            const tree = z.treeifyError(err)
            res.status(400).json({ message: "Validation failed", errors: tree });
        } else {
            res.status(500).json({message: "Internal server error"})
        }
    }
}

// global config
export const router = express.Router()

// TO DO: update transactionRoutes to conform with Mongoose queries
// GET
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const transactionId = req.params.id 
        const transaction = await Transaction.findOne({transactionId})
        if (transaction) {
            res.status(200).send(transaction)
        } else {
            res.status(404).send(`Unable to find matching transaction with id ${req.params.id}`)
        }
    } catch (error) {
        res.status(500).send(`Error fetching transaction: ${error}`)
    }
})

/**
 * TO DO: validate that the sums of amounts match total amount
 * .refine((data) => {
    const sum = data.splits.reduce((acc, split) => acc + split.amount, 0)
    return Math.abs(sum - data.totalAmount) < 0.01
}, { 
    message: "The sum of splits must equal the total amount", 
    path: ["splits"] 
})
 */
function calculateSplits(participants: string[], totalAmount: number) {
    const numberOfUsers = participants.length
    const share = Math.floor(totalAmount / numberOfUsers)
    const remainder = totalAmount % numberOfUsers
    const randomizer = Math.floor(Math.random() * numberOfUsers)

    const splitDetails = participants.map((userId: string, index: number) => {
        return {
            publicId: userId,
            amount: index === randomizer ? share + remainder: share
        }
    })
    return splitDetails
}

// POST transaction
router.post("/", validateTransactionBody, async (req: Request, res: Response) => {
    try {
        const data = req.body
        const totalAmount = data.totalAmount * 100
        const splitDetails = calculateSplits(data.participants, totalAmount)
        const expense = {
            ...data,
            totalAmount,
            splits: splitDetails
        }

        // attempt to create transaction
        console.log('saving transaction: ', expense)
        const transaction = new Transaction(expense)
        const savedTransaction = await transaction.save()
        return res.status(201).json(savedTransaction)
    } catch (error) {
        console.log(error)
        res.status(500).send(`Failed to create a new transaction: ${error}`)
    }
})

// PUT
router.put("/:transactionId", async (req: Request, res: Response) => {
    try {
        const transactionId = req.params.id 
        const transaction = await Transaction.findOne({transactionId})
        if (transaction) {
            console.log('Found transaction! ', transaction)
            // modify transaction
            const { description, category, totalAmount } = req.body
            let splitDetails
            const participants = transaction.splits.map(s => s.publicId)
            if (totalAmount) {
                splitDetails = calculateSplits(participants, totalAmount)
            }
            const updatedDoc = Transaction.findOneAndUpdate(
                {transactionId},
                {
                    description,
                    category,
                    splits: splitDetails
                },
                { new: true, runValidators: true }
            )
            res.status(200).json(updatedDoc)
        } else {
            res.status(404).send('transaction not found')
        }
    } catch (error) {
        res.status(500).send(`Unable to update transaction: ${error}`)
    }


    // try {
    //     // const updatedTransaction: Transaction = req.body as Transaction
    //     // const query = { _id: new ObjectId(id)}

    //     // const result = await collections.transaction?.updateOne(query, { $set: updatedTransaction})
    //     // result
    //     //     ? res.status(200).send(`Successfully updated transaction with id ${id}`)
    //     //     : res.status(304).send(`Transaction with id: ${id} not updated`);
    // } catch (error) {
    //     console.error(error);
    //     res.status(400).send(error);
    // }
})

// DELETE
// router.delete("/:id", async (req: Request, res: Response) => {
//     const id = req?.params?.id 
//     try {
//         const query = { _id: new ObjectId(id)}
//         const result = await collections.transaction?.deleteOne(query)
//         if (result && result.deletedCount) {
//             res.status(202).send(`Successfully removed transaction with id ${id}`)
//         } else if (!result) {
//             res.status(400).send(`Failed to remove game with id ${id}`)
//         } else if (!result.deletedCount) {
//             res.status(404).send(`Transaction with id ${id} does not exist`)
//         }
//     } catch (error) {
//         console.log(error)
//         res.status(400).send(error)
//     }
// })

export default router
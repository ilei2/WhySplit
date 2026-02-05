import express, { Request, Response } from "express"
import { Transaction } from "../models/transaction"
import { validateTransactionBody } from "../schemas/transaction.zod"
import * as MathUtils from "../utils/mathUtils"
import * as TransactionUtils from "../utils/transactionUtils"

// global config
export const router = express.Router()

// GET transaction by ID
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const transactionId = req.params.id 
        const transaction = await Transaction.findOne({transactionId})
        if (transaction) {
            return res.status(200).send(transaction)
        } else {
            return res.status(404).send(`Unable to find matching transaction with id ${req.params.id}`)
        }
    } catch (error) {
        return res.status(500).send(`Error fetching transaction: ${error}`)
    }
})

// POST transaction
router.post("/", validateTransactionBody, async (req: Request, res: Response) => {
    try {
        const data = req.body
        // validate group and participants
        const group = await TransactionUtils.verifyGroup(data.groupId)
        TransactionUtils.verifyParticipants(data.involvedParticipants, group.participants)

        // calculate
        const expense = MathUtils.calculateExpenses(group.participants, data)

        // attempt to create transaction
        console.log('saving transaction: ', expense)
        const transaction = new Transaction(expense)
        const savedTransaction = await transaction.save()
        return res.status(201).json(savedTransaction)
    } catch (error) {
        console.log(error)
        return res.status(500).send(`Failed to create a new transaction: ${error}`)
    }
})

// PUT
router.put("/:id", validateTransactionBody, async (req: Request, res: Response) => {
    try {
        const transactionId = req.params.id
        const transaction = await Transaction.findOne({transactionId})
        if (transaction) {
            const data = req.body
            // validate group and participants
            const group = await TransactionUtils.verifyGroup(data.groupId)
            TransactionUtils.verifyParticipants(data.involvedParticipants, group.participants)
            const expense = MathUtils.calculateExpenses(group.participants, data)
            console.log('expense result: ', expense)
            const updatedDoc = await Transaction.findOneAndUpdate(
                { transactionId },
                { $set: expense },
                { new: true, runValidators: true }
            )
            return res.status(200).json(updatedDoc)
        } else {
            res.status(404).send('transaction not found')
        }
    } catch (error) {
        return res.status(500).send(`Unable to update transaction: ${error}`)
    }
})

// DELETE
router.delete("/:id", async (req: Request, res, Response) => {
    try {
        const transactionId = req.params.id 
        const transaction = await Transaction.findOne({transactionId})
        if (transaction) {
            await Transaction.deleteOne({transactionId})
            return res.status(202).send(transaction)
        } else {
            return res.status(404).send(`Unable to find transaction with id ${req.params.id}`)
        }
    } catch (error) {
        return res.status(500).send(`Unable to process transaction ${error}`)
    }
})

export default router
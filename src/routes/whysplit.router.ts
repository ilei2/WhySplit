import express, { NextFunction, Request, Response } from "express"
import { ObjectId } from "mongodb"
import { collections } from "../services/database.service"
import Transaction from "../models/transaction"
import { ExpenseSchema } from "../schemas/schemas"
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
router.use(express.json())


// GET
router.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id
    try {
        const query = { _id: new ObjectId(id) }
        const transaction = await collections.transaction?.findOne(query)
        if (transaction) {
            res.status(200).send(transaction)
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id ${req.params.id}`)
    }
})

// POST
router.post("/", validateTransactionBody, async (req: Request, res: Response) => {
    try {
        const newTransaction = req.body
        const result = await collections.transaction?.insertOne(newTransaction)
        result 
            ? res.status(201).send(`Successfully created a new transaction with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new transaction.")
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

// PUT
router.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id 

    try {
        const updatedTransaction: Transaction = req.body as Transaction
        const query = { _id: new ObjectId(id)}

        const result = await collections.transaction?.updateOne(query, { $set: updatedTransaction})
        result
            ? res.status(200).send(`Successfully updated transaction with id ${id}`)
            : res.status(304).send(`Transaction with id: ${id} not updated`);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
})

// DELETE
router.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id 
    try {
        const query = { _id: new ObjectId(id)}
        const result = await collections.transaction?.deleteOne(query)
        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed transaction with id ${id}`)
        } else if (!result) {
            res.status(400).send(`Failed to remove game with id ${id}`)
        } else if (!result.deletedCount) {
            res.status(404).send(`Transaction with id ${id} does not exist`)
        }
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})
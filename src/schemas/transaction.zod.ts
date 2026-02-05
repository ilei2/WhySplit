import { z, ZodError } from "zod"
import { NextFunction, Request, Response } from "express"
import { isCuid } from '@paralleldrive/cuid2'
import { Types } from "mongoose"

const publicId = z.string().refine((val) => isCuid(val), { message: "Invalid CUID2" })

// Validate user _id
const userId = z.string().refine((val) => Types.ObjectId.isValid(val), {message: "Invalid User ID"})

export const validateTransactionBody = (req: Request, res: Response, next: NextFunction) => {
    try {
        TransactionSchema.parse(req.body)
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

const TransactionSchema = z.object({
    description: z.string().min(1).max(100),
    category: z.string().default('General'),
    totalAmount: z.number().positive(),
    currency: z.string().length(3).default('USD'),
    date: z.string().optional(),
    payer: userId,
    participants: z.array(publicId).optional(), // this is now replaced by groupId
    involvedParticipants: z.array(userId),
    groupId: z.string().optional()
}).strict()
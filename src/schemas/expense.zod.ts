import { z } from "zod"
import { isCuid } from '@paralleldrive/cuid2'


// const SplitMemberSchema = z.object({
//     // userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID"),
//     publicId: z.string().refine((val) => isCuid(val), { message: "Invalid CUID2" }),
//     // amount: z.number()
// })

const publicId = z.string().refine((val) => isCuid(val), { message: "Invalid CUID2" })

export const ExpenseSchema = z.object({
    description: z.string().min(1).max(100),
    category: z.string().default('General'),
    totalAmount: z.number().positive(),
    currency: z.string().length(3).default('USD'),
    date: z.string().optional(),
    payer: z.string().refine((val) => isCuid(val), { message: "Invalid CUID2" }),
    participants: z.array(publicId).min(1),
}).strict()
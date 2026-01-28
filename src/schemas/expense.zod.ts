import { z } from "zod"
import { isCuid } from '@paralleldrive/cuid2'


const SplitMemberSchema = z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Internal ID"),
    publicId: z.string().refine((val) => isCuid(val), { message: "Invalid CUID2" }),
    amount: z.number()
})

export const ExpenseSchema = z.object({
    description: z.string().min(1).max(100).optional(),
    category: z.string().optional(),
    totalAmount: z.number().positive(),
    currency: z.string().length(3).default('USD'),
    paidBy: z.string(), // UserID
    splits: z.array(SplitMemberSchema).min(1),
}).refine((data) => {
    const sum = data.splits.reduce((acc, split) => acc + split.amount, 0)
    return Math.abs(sum - data.totalAmount) < 0.01
}, { 
    message: "The sum of splits must equal the total amount", 
    path: ["splits"] 
}).strict()

// export const UserSchema = z.object({
//     name: z.string().min(1, "Name is required."),
//     publicId: z.string().refine((val) => isCuid(val), { message: "Invalid CUID2" }),
//     email: z.string().min(8, "Email is required."),
//     currency: z.string()
// })


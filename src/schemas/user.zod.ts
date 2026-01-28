import { z } from "zod"
// import { isCuid } from '@paralleldrive/cuid2'

export const UserSchema = z.object({
    name: z.string().min(1, "Name is required."),
    // publicId: z.string().refine((val) => isCuid(val), { message: "Invalid CUID2" }),
    email: z.string().min(6, "Email is required.")
})
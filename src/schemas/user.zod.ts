import { z, ZodError } from "zod"
import { NextFunction, Request, Response } from "express"

export const UserSchema = z.object({
    name: z.string().min(1, "Name is required."),
    email: z.string().min(6, "Email is required.")
})

export const validateUserBody = (req: Request, res: Response, next: NextFunction) => {
    try {
        UserSchema.parse(req.body)
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
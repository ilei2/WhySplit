import express, { NextFunction, Request, Response } from "express"
// import { UserSchema } from "../schemas/user.zod"
// import { z, ZodError } from "zod"
// import { User } from "../models/User"

// const validateUserBody = (req: Request, res: Response, next: NextFunction) => {
//     try {
//         console.log('Validating user body')
//         UserSchema.parse(req.body)
//         console.log('user validation passed!')
//         next()
//     } catch (err: unknown) {
//         if (err instanceof ZodError) {
//             const tree = z.treeifyError(err)
//             res.status(400).json({message: "Validation failed", errors: tree})
//         } else {
//             res.status(500).json({message: "Internal server error"})
//         }
//     }
// }

// global config
export const router = express.Router()


// POST new user
// to do: add validation later, validateUserBody
// router.post("/", async (req, res) => {
//     try {
//         console.log('DEBUG START')
//         console.log('body: ', req.body)
//         // save new user
//         const { name, email } = req.body
//         const newUser = new User({ name, email })
//         console.log('new user: ', newUser)
//         const savedUser = newUser.save()

//         res.status(201).json(savedUser)
//     } catch (error) {
//         res.status(400).json({message: "User creation failed", error})
//     }
// })

// this is a test
router.get('/ping', (req, res) => {
    res.send('User router is reachable!')
})

// this is another test
router.post('/', (req, res) => {
    res.json({ message: "post is working!", body: req.body})
})

export default router

import express from "express"
import { validateUserBody } from "../schemas/user.zod"
import { User } from "../models/User"

// global config
export const router = express.Router()

// POST new user
router.post("/", validateUserBody, async (req, res) => {
    try {
        // check if user already exists
        const { name, email } = req.body
        const existingUser = await User.findOne({ email: email.toLowerCase()})
        if (existingUser) {
            return res.status(409).json({
                message: 'A user with this email is already registered.'
            })
        }
        
        // save new user
        const newUser = new User({ name, email })
        console.log('new user: ', newUser)
        const savedUser = newUser.save()

        res.status(201).json(savedUser)
    } catch (error) {
        res.status(400).json({message: "User creation failed", error})
    }
})

// GET user
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findOne({ publicId: req.params.id})
        if (user) {
            res.status(200).json(user)
        } else {
            res.status(404).json({message: "Unable to find user"})
        }
    } catch (error) {
        res.status(400).json({message: "GET User failed", error})
    }
})

export default router
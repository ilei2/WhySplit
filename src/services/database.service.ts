import * as mongoDB from "mongodb"
import dotenv from "dotenv"
import mongoose from "mongoose"
import { envSchema } from "../schemas/env.zod"

export const collections: { 
    transaction?: mongoDB.Collection,
    users?: mongoDB.Collection 
} = {}

dotenv.config()
// This will throw an error immediately if validation fails
export const env = envSchema.parse(process.env)

export async function connectToDataBase() {
    try {
        await mongoose.connect(env.DB_CONN_STRING, {
            dbName: env.DB_NAME,
            serverSelectionTimeoutMS: 5000
        })
        console.log(`===========================================`)
        console.log(`Mongoose connected to ${mongoose.connection.name}`)
        console.log(`===========================================`)
    } catch (error) {
        console.log(`DB CONNECTION ERROR: `, error)
        process.exit(1)
    }
}
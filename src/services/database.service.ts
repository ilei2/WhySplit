import * as mongoDB from "mongodb"
import dotenv from "dotenv"
import mongoose from "mongoose"

export const collections: { 
    transaction?: mongoDB.Collection,
    users?: mongoDB.Collection 
} = {}

export async function connectToDatabase() {
    const env = dotenv.config().parsed
    try {
        await mongoose.connect(env.DB_CONN_STRING, {
            dbName: env.DB_NAME
        })
        
        console.log(`===========================================`)
        console.log(`Mongoose connected to ${mongoose.connection.name}`)
        console.log(`===========================================`)
    } catch (error) {
        console.log(`===========================================`)
        console.log(`DB connection error: `, error)
        console.log(`===========================================`)
        process.exit(1)
    }
}
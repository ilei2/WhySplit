import express from "express"
import { connectToDatabase } from "./src/services/database.service"
import { router } from "./src/routes/whysplit.router"

const app = express()
const port = '0000' // fill out with custom port

connectToDatabase()
    .then(() => {
        app.use("/transaction", router)
        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`)
        })
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error)
        process.exit()
    })
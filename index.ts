import express from "express"
import { connectToDataBase } from "./src/services/database.service"
import transactionRouter from "./src/routes/transactionRoutes"
import userRouter from "./src/routes/userRoutes"
import dotenv from "dotenv";

const app = express()
app.use(express.json())

// test and see every request made
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} received.`)
    next()
})

// mount routers
app.use("/transaction", transactionRouter)
app.use("/users", userRouter)
const env = dotenv.config().parsed
const port = env?.PORT

connectToDataBase()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`)
        })
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error)
        process.exit()
    })
import express from 'express'
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase, disconectFromDB } from './utils/database';
import userRoute from './modules/user/user.route';
import cookieParser from "cookie-parser";
import { prRoute } from './modules/pullRequest/pullRequest.route';

dotenv.config()
const app = express()

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://46.183.113.13";

app.use(cors(
    {
        origin: FRONTEND_ORIGIN.replace(/\/$/, ""), // Remove trailing slash
        credentials: true,               // ✅ allow cookies
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        optionsSuccessStatus: 200,
    }
))
app.use(express.json())
app.use(cookieParser())


app.use("/login/oauth2/code", userRoute)
app.use("/pullRequest", prRoute)


connectToDatabase()

const server = app.listen(4000, async () => {
    await connectToDatabase()
    console.log(`server listening at http://127.0.0.1:4000`)
})



function gracefulShutdown(signal: string) {
    process.on(signal, async () => {
        console.log("Goodbye, got signal " + signal);

        server.close();
        server
        // disconects from the db

        await disconectFromDB()

        console.log("My work here is done")

        process.exit(0)
    })
}

const signals: string[] = ["SIGTERM", "SIGINT"]


for (let i = 0; i < signals.length; i++) {
    gracefulShutdown(signals[i] as string)
}
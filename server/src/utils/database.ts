import mongoose, { mongo } from "mongoose"

const DB_URI = process.env.DB_URI || "mongodb://127.0.0.1:27017/pr-review?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.10"

export async function connectToDatabase() {
    try {
        mongoose.connect(DB_URI)
        console.log('connect to database')
    } catch (e) {
        console.log(e, "Failed to connect to database. Goodbye")
        process.exit(1)
    }
}

export async function disconectFromDB() {
    await mongoose.connection.close()


    console.log("Disconnected from DB")
}
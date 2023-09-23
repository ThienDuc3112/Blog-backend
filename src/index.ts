import express from "express"
import cors from "cors"
import postRouter from "./Routes/post"
import mongoose from "mongoose";
import env from "dotenv"
env.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: "20mb" }))

mongoose.connect(process.env.DATABASE_URL as string)

const db = mongoose.connection
db.on("error", (err) => {
    console.error(err)
})
db.once("open", () => {
    console.log("Connected to db")
})


app.listen(6969, () => {
    console.log("Server listen on port 6969")
})


app.get("/", (req, res) => {
    console.log("requested")
    res.json({
        success: true
    })
})

app.use("/post", postRouter)



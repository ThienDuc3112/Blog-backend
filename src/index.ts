import express from "express"
import cors from "cors"
import postRouter from "./Routes/post"

const app = express()
app.use(cors())
app.use(express.json({ limit: "20mb" }))


app.listen(6969)


app.get("/", (req, res) => {
    console.log("requested")
    res.json({
        success: true
    })
})

app.use("/post", postRouter)



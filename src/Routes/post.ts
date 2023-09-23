import { Router } from "express";
import fs from "fs"

const postRouter = Router()

const getDatabase = () => {
    return JSON.parse(fs.readFileSync("./database.json", "utf-8"))
}

const pushDatabase = (data: object) => {
    const currData = getDatabase()
    currData.push(data)
    fs.writeFileSync("./database.json", JSON.stringify(currData, null, 2))
    return currData
}

postRouter.get("/getpost/:id", (req, res) => {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
        res.status(400).json({
            success: false,
        })
        return;
    }
    const post = getDatabase().find((o: any) => o.id == id)
    if (!post) {
        res.status(404).json({
            success: false
        })
        return
    }
    res.json({
        success: true,
        data: post
    })
})

postRouter.get("/allPreview", (req, res) => {
    let data = getDatabase()
    for (let i = 0; i < data.length; i++) {
        data[i].post = undefined
    }
    res.json({
        success: true,
        data: data
    })
})


postRouter.post("/newpost", (req, res) => {
    const post = req.body
    post.time = new Date()
    const database = getDatabase()
    post.id = database.length == 0 ? 0 : database[database.length - 1].id + 1
    pushDatabase(post)
    res.json({
        success: true,
        id: post.id,
        data: post
    })
})

export default postRouter
import { NextFunction, Request, Response, Router } from "express";
import jwt from "jsonwebtoken";

const authRouter = Router()

let validRefreshToken: string[] = []

// Login
authRouter.post("/login", (req, res) => {
    const username = req.body.username
    const user = { username }

    const accessToken = jwt.sign(user, process.env.AUTH_TOKEN as string, { expiresIn: "15s" })
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN as string)
    validRefreshToken.push(refreshToken)

    res.status(200).json({ success: true, data: { accessToken, refreshToken } })
})

// Refresh
authRouter.post("/refresh", (req, res) => {
    const token: string | null = req.body.token
    if (token === null) return res.status(401).json({ success: false, message: "Please provide a token" })
    if (!validRefreshToken.includes(token)) return res.status(401).json({ success: false, message: "Invalid token" })
    jwt.verify(token, process.env.REFRESH_TOKEN as string, (err, data: any) => {
        if (err) return res.status(401).json({ success: false, message: "Invalid token" })
        const accessToken = jwt.sign({ username: data.username }, process.env.AUTH_TOKEN as string, { expiresIn: "15s" })
        res.json({ success: true, data: { accessToken } })
    })
})

// Logout
authRouter.post("/logout", (req, res) => {
    validRefreshToken = validRefreshToken.filter((token) => token != req.body.token)
    res.json({ success: true })
})

interface IAuthRequest extends Request {
    user?: {
        username: string
        iat: number
    }
}

const authenticate = (req: IAuthRequest, res: Response, next: NextFunction) => {
    const authHeader = (req.headers as any)["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if (!token) return res.status(401).json({ success: false, message: "Please provide a authorization token" })
    jwt.verify(token, process.env.AUTH_TOKEN as string, (err: any, user: any) => {
        if (err) return res.status(403).json({ success: false, message: "Invalid token" })
        req.user = user
        next()
    })
}

export { authRouter, authenticate, IAuthRequest }
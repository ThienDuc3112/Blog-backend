import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { IAuthRequest } from "../interface/auth"
import { compare, genSalt, hash } from "bcrypt"
import UserModel from "../models/user"

// const refresh = (req: Request, res: Response) => {
//     const token: string | null = req.cookies?.refreshToken
//     if (token === null) return res.status(401).json({ success: false, message: "You are not logged in" })
//     jwt.verify(token, process.env.REFRESH_TOKEN as string, (err, data: any) => {
//         if (err) return res.status(403).json({ success: false, message: "Invalid refresh token" })
//         const accessToken = jwt.sign({ username: data.username }, process.env.AUTH_TOKEN as string, { expiresIn: "15m" })
//         res.cookie("token", accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 }).json({ success: true })
//     })
// }

const authenticateMiddleware = (req: IAuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.token
    if (!token) return res.status(401).json({ success: false, message: "You are not logged in" })
    jwt.verify(token, process.env.AUTH_TOKEN as string, (err: any, user: any) => {
        if (err) return res.status(403).json({ success: false, message: "Invalid token" })
        req.user = user
        next()
    })
}

const authenticate = (req: IAuthRequest, res: Response) => {
    res.status(200).json({ success: true, data: req.user })
}

const register = async (req: Request, res: Response) => {
    const { username, password, email } = req.body
    if (!username || !password || !email) {
        return res.status(400).json({ success: false, message: "Incomplete user data" })
    }

    const salt = await genSalt(10)
    const hashedPassword = await hash(password, salt)

    const user = new UserModel({
        username, email,
        password: hashedPassword
    })

    user.save()
        .then(() => { res.status(201).json({ success: true }) })
        .catch((err) => { res.status(500).json({ success: false, message: err.message }) })
}

const login = async (req: Request, res: Response) => {
    if (!req.body.password) return res.status(400).json({ success: false, message: "Please provide a password" })

    const username = req.body.username
    const user = await UserModel.findOne({ username })

    if (user == null) return res.status(404).json({ success: false, message: "User not found" })

    if (!(await compare(req.body.password, user.password))) return res.status(401).json({ success: false, message: "Invalid password" })

    const accessToken = jwt.sign(
        { username: user.username },
        process.env.AUTH_TOKEN as string,
        { expiresIn: "6h" }
    )
    // const refreshToken = jwt.sign(
    //     { username: user.username },
    //     process.env.REFRESH_TOKEN as string,
    //     { expiresIn: '1d' }
    // )

    res.status(200)
        .cookie("token", accessToken, {
            // maxAge: 15 * 60 * 1000,
            maxAge: 6 * 3600 * 1000,
            httpOnly: true,
            sameSite: "none"
        })
        // .cookie("refreshToken", refreshToken, {
        //     maxAge: 24 * 3600 * 1000,
        //     httpOnly: true
        // })
        .json({ success: true })
}

const logout = (req: Request, res: Response) => {
    res
        .cookie("token", "", { httpOnly: true, maxAge: 0 })
        .cookie("refreshToken", "", { httpOnly: true, maxAge: 0 })
        .json({ success: true })
}

export { /**refresh, */authenticateMiddleware, register, login, logout, authenticate }

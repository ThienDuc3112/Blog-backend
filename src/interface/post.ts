import { Response } from "express"
import { Document } from "mongoose"

interface IResponse extends Response {
    post?: Document
}

export { IResponse }
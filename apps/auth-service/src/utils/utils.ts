import crypto from "crypto"
import bcrypt from "bcryptjs"
import { PASSWORD_SALT } from "../constants/constants"

// bcrypt
export const hashPassword = async(password:string): Promise<string> => 
    await bcrypt.hash(password, PASSWORD_SALT)

export const comparePasswordHashes = async(password:string, hash:string): Promise<boolean> => 
    await bcrypt.compare(password, hash)

// crypto
export const createToken = () =>
    crypto.randomBytes(32).toString("hex")

export const createHash = (token:string) => 
    crypto.createHash("sha256").update(token).digest("hex")

export const createRandomPassword = () =>
    crypto.randomBytes(16).toString("hex")

// nonce
export const createNonce = () => 
    crypto.randomBytes(16).toString("hex")

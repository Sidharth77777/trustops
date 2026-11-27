import crypto from "crypto"
import argon2 from "argon2"
// import bcrypt from "bcryptjs"
// import { PASSWORD_SALT } from "../constants/constants"

// bcrypt
// export const hashPassword = async(password:string): Promise<string> => 
//     await bcrypt.hash(password, PASSWORD_SALT)

// export const comparePasswordHashes = async(password:string, hash:string): Promise<boolean> => 
//     await bcrypt.compare(password, hash)


// argon2
export const hashPassword = async(password:string): Promise<string> => 
    argon2.hash(password, {
        type: argon2.argon2id,
    })

export const comparePasswordHashes = async(password:string, hash:string): Promise<boolean> =>
    argon2.verify(hash, password)

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

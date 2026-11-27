import { SiweMessage } from "siwe"

export const verifySiwe = async(message:string, signature:string): Promise<boolean> => {
    const siweMessage = new SiweMessage(message)

    const result = await siweMessage.verify({
        signature
    })

    return result.success

}
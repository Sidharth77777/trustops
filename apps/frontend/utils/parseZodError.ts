
import { AxiosError } from "axios"

export const parseZodError = (
    err: AxiosError<any>,
    fallback = "Request failed"
): string => {
    const data = err.response?.data
    const details = data?.details

    if (
        details &&
        typeof details === "object" &&
        !Array.isArray(details)
    ) {
        return Object.entries(details)
            .filter((entry): entry is [string, string] =>
                typeof entry[1] === "string"
            )
            .map(([field, message]) => {
                const formattedField =
                    field.charAt(0).toUpperCase() + field.slice(1)

                return `${formattedField}: ${message}`
            })
            .join("\n")
    }

    return data?.message || err.message || fallback
}

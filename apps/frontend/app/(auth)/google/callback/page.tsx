"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"
import { refreshToken } from "@/lib/api/auth.api"

export default function GoogleCallbackPage() {
    const router = useRouter()
    const hasExecuted = useRef(false)
    const [error, setError] = useState<string | null>(null)

    const setAccessToken = useAuthStore((state) => state.setAccessToken)

    useEffect(() => {
        if (hasExecuted.current) return

        hasExecuted.current = true

        refreshToken(setAccessToken, router, setError)
    }, [router, setAccessToken])

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center">
                {error ? (
                    <>
                        <p className="text-red-500">{error}</p>

                        <button
                            onClick={() => router.replace("/login")}
                            className="rounded-md bg-primary px-5 py-2 text-white"
                        >
                            Back to Login
                        </button>
                    </>
                ) : (
                    <>
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary" />

                        <p className="text-sm text-muted-foreground">
                            Completing Google authentication...
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}
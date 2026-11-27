"use client"

import { useEffect, useRef } from "react"
import { refreshSession } from "@/lib/api/axios"
import { GetMeApi } from "@/lib/api/auth.api"
import { useAuthStore } from "@/store/auth.store"

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const initialized = useRef(false)

    const setUser = useAuthStore((state) => state.setUser)
    const clearAuth = useAuthStore((state) => state.clearAuth)
    const setAuthInitialized = useAuthStore((state) => state.setAuthInitialized)

    useEffect(() => {
        if (initialized.current) return

        initialized.current = true

        const restoreSession = async () => {
            try {
                await refreshSession()

                const userResponse = await GetMeApi()

                setUser(userResponse.data.user)
            } catch (error) {
                clearAuth()
            } finally {
                setAuthInitialized(true)
            }
        }

        restoreSession()
    }, [setUser, clearAuth, setAuthInitialized])

    return <>{children}</>
}

export default AuthProvider

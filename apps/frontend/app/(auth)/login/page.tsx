"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Loader } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginSchemaType } from "@/schemas/auth"
import { useAuthGoogleRedirect, useAuthLogin } from "@/hooks/auth.hooks"

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [isGoogleRedirecting, setIsGoogleRedirecting] = useState(false)

    const login = useAuthLogin()
    const googleRedirect = useAuthGoogleRedirect()

    const handleGoogleRedirect = () => {
        if (isGoogleRedirecting) return

        setIsGoogleRedirecting(true)
        googleRedirect.mutate()
    }

    const { register, handleSubmit, formState: { isValid, isDirty, errors }} = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
    })

    const onSubmit = (data: LoginSchemaType) => {
        login.mutate(data)
    }

    return (
        <div className="min-h-screen p-2 flex items-center justify-center bg-background text-foreground">
            <div className="w-full max-w-md space-y-6 rounded-xl bg-card p-8 shadow-lg border border-border">

                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-muted-foreground">
                        Sign in to your TrustOps account
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="space-y-4">

                        {/* EMAIL */}
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                autoComplete="email"
                                {...register("email")}
                                className="w-full rounded-md bg-input border border-border px-4 py-2 text-white placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-ring"
                            />

                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    autoComplete="current-password"
                                    {...register("password")}
                                    className="w-full rounded-md bg-input border border-border px-4 py-2 pr-10 text-white placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-ring"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 cursor-pointer top-1/2 -translate-y-1/2 text-placeholder hover:text-foreground"
                                >
                                    {showPassword
                                        ? <EyeOff size={18} />
                                        : <Eye size={18} />
                                    }
                                </button>
                            </div>

                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between py-4 text-sm">
                        <Link
                            href="/forgot-password"
                            className="text-accent hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={!isValid || !isDirty || login.isPending}
                        className="w-full cursor-pointer rounded-md bg-primary py-2 text-primary-foreground font-medium hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 flex justify-center items-center"
                    >
                        <span className="invisible">Sign In</span>
                        <span className="absolute">
                            {login.isPending
                                ? <Loader size={15} className="animate-spin" />
                                : "Sign In"
                            }
                        </span>
                    </button>

                </form>

                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">OR</span>
                    <div className="flex-1 h-px bg-border" />
                </div>

                <div className="space-y-3">
                    <div className="relative w-full">
                        <div className="w-full">
                            <button
                                onClick={handleGoogleRedirect}
                                type="button"
                                disabled={isGoogleRedirecting}
                                className="flex w-full items-center justify-center gap-3 rounded-md bg-secondary py-2 hover:opacity-90 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isGoogleRedirecting
                                    ? <Loader size={16} className="animate-spin" />
                                    : <FcGoogle className="h-5 w-5" />
                                }
                                <span className="text-white">
                                    {isGoogleRedirecting
                                        ? "Redirecting..."
                                        : "Continue with Google"
                                    }
                                </span>
                            </button>
                        </div>

                        {/* <button className="flex w-full items-center justify-center gap-3 rounded-md bg-accent py-2 text-accent-foreground hover:opacity-90">
                        <Wallet className="h-5 w-5" />
                          <span>Connect Wallet</span>
                        </button> */}

                      {/* <ConnectWallet /> */}
                    </div>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-accent hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}

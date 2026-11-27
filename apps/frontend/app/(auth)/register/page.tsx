
"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Loader, Wallet } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegisterFormSchemaType, registerFormSchema } from "@/schemas/auth"
import { useAuthGoogleRedirect, useAuthRegister } from "@/hooks/auth.hooks"

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)
    const [isGoogleRedirecting, setIsGoogleRedirecting] = useState(false)

    const registerMutation = useAuthRegister()
    const googleRedirect = useAuthGoogleRedirect()

    const { register, handleSubmit, formState: { isValid, isDirty, errors }} = useForm<RegisterFormSchemaType>({
        resolver: zodResolver(registerFormSchema),
        mode: "onChange",
    })

    const onSubmit = (data: RegisterFormSchemaType) => {
        const { confirmPassword, ...credentials } = data

        registerMutation.mutate(credentials)
    }

    const handleGoogleRedirect = () => {
        if (isGoogleRedirecting) return

        setIsGoogleRedirecting(true)
        googleRedirect.mutate()
    }

    return (
        <div className="min-h-screen p-2 flex items-center justify-center bg-background text-foreground">
            <div className="w-full max-w-md space-y-6 rounded-xl bg-card p-8 shadow-lg border border-border">

                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold">Create account</h1>
                    <p className="text-muted-foreground">
                        Join TrustOps in seconds
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="space-y-4">

                        {/* FULL NAME */}
                        <div>
                            <input
                                type="text"
                                placeholder="Full Name"
                                autoComplete="name"
                                {...register("name")}
                                className="w-full rounded-md bg-input border border-border px-4 py-2 text-white placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-ring"
                            />

                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

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
                                    autoComplete="new-password"
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

                        {/* CONFIRM PASSWORD */}
                        <div>
                            <div className="relative">
                                <input
                                    type={showPassword2 ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    autoComplete="new-password"
                                    {...register("confirmPassword")}
                                    className="w-full rounded-md bg-input border border-border px-4 py-2 pr-10 text-white placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-ring"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword2(!showPassword2)}
                                    className="absolute right-2 cursor-pointer top-1/2 -translate-y-1/2 text-placeholder hover:text-foreground"
                                >
                                    {showPassword2
                                        ? <EyeOff size={18} />
                                        : <Eye size={18} />
                                    }
                                </button>
                            </div>

                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                    </div>

                    <button
                        type="submit"
                        disabled={!isValid || !isDirty || registerMutation.isPending}
                        className="relative mt-5 w-full cursor-pointer rounded-md bg-primary py-2 text-primary-foreground font-medium hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:opacity-50 flex justify-center items-center"
                    >
                        <span className="invisible">Create Account</span>
                        <span className="absolute">
                            {registerMutation.isPending
                                ? <Loader size={15} className="animate-spin" />
                                : "Create Account"
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
                    </div>

                    {/* <button className="flex w-full items-center justify-center gap-3 rounded-md bg-accent py-2 text-accent-foreground hover:opacity-90">
                        <Wallet className="h-5 w-5" />
                        <span>Signup with Wallet</span>
                    </button> */}

                    {/* <ConnectWallet /> */}

                </div>

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-accent hover:underline">
                        Log in
                    </Link>
                </p>

            </div>
        </div>
    )
}

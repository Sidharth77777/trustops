"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Eye, EyeOff, Loader } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    resetPasswordFormSchema,
    ResetPasswordFormSchemaType
} from "@/schemas/auth"
import { useAuthResetPassword } from "@/hooks/auth.hooks"

export default function ResetPasswordPage() {

    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [showPassword, setShowPassword] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)

    const resetPassword = useAuthResetPassword()

    const { register, handleSubmit, formState: { errors, isValid, isDirty }} = useForm<ResetPasswordFormSchemaType>({
        resolver: zodResolver(resetPasswordFormSchema),
        mode: "onChange",
    })

    const onSubmit = (data: ResetPasswordFormSchemaType) => {
        if (!token) return

        resetPassword.mutate({
            token,
            newPassword: data.newPassword,
        })
    }

    if (!token) {
        return (
            <div className="min-h-screen p-2 flex items-center justify-center bg-background text-foreground">
                <div className="w-full max-w-md space-y-4 rounded-xl bg-card p-8 shadow-lg border border-border text-center">

                    <h1 className="text-2xl font-bold">Invalid Reset Link</h1>

                    <p className="text-sm text-muted-foreground">
                        This password reset link is missing its token.
                        Please request a new reset link.
                    </p>

                    <Link
                        href="/forgot-password"
                        className="inline-block text-accent hover:underline"
                    >
                        Request a new reset link
                    </Link>

                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-2 flex items-center justify-center bg-background text-foreground">
            <div className="w-full max-w-md space-y-6 rounded-xl bg-card p-8 shadow-lg border border-border">

                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold">Reset Password</h1>
                    <p className="text-muted-foreground">
                        Enter your new password below
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="space-y-4">

                        {/* NEW PASSWORD */}
                        <div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    autoComplete="new-password"
                                    {...register("newPassword")}
                                    className="w-full rounded-md bg-input border border-border px-4 py-2 pr-10 text-white placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-ring"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-placeholder hover:text-foreground"
                                >
                                    {showPassword
                                        ? <EyeOff size={18} />
                                        : <Eye size={18} />
                                    }
                                </button>
                            </div>

                            {errors.newPassword && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.newPassword.message}
                                </p>
                            )}
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div>
                            <div className="relative">
                                <input
                                    type={showPassword2 ? "text" : "password"}
                                    placeholder="Confirm New Password"
                                    autoComplete="new-password"
                                    {...register("confirmNewPassword")}
                                    className="w-full rounded-md bg-input border border-border px-4 py-2 pr-10 text-white placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-ring"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword2(!showPassword2)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-placeholder hover:text-foreground"
                                >
                                    {showPassword2
                                        ? <EyeOff size={18} />
                                        : <Eye size={18} />
                                    }
                                </button>
                            </div>

                            {errors.confirmNewPassword && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.confirmNewPassword.message}
                                </p>
                            )}
                        </div>

                    </div>

                    <button
                        type="submit"
                        disabled={!isValid || !isDirty || resetPassword.isPending}
                        className="relative mt-5 w-full cursor-pointer rounded-md bg-primary py-2 text-primary-foreground font-medium hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:opacity-50 flex justify-center items-center"
                    >
                        <span className="invisible">Reset Password</span>

                        <span className="absolute">
                            {resetPassword.isPending
                                ? <Loader size={15} className="animate-spin" />
                                : "Reset Password"
                            }
                        </span>
                    </button>

                </form>

                <p className="text-center text-sm text-muted-foreground">
                    Remembered your password?{" "}
                    <Link href="/login" className="text-accent hover:underline">
                        Back to login
                    </Link>
                </p>

            </div>
        </div>
    )
}

"use client"

import Link from "next/link"
import { Loader } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordSchema, ForgotPasswordSchemaType } from "@/schemas/auth"
import { useAuthForgotPassword } from "@/hooks/auth.hooks"

export default function ForgotPasswordPage() {

    const forgotPassword = useAuthForgotPassword()

    const { register, handleSubmit, formState: { errors, isValid, isDirty }} = useForm<ForgotPasswordSchemaType>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onChange",
    })

    const onSubmit = (data: ForgotPasswordSchemaType) => {
        forgotPassword.mutate(data)
    }

    return (
        <div className="min-h-screen p-2 flex items-center justify-center bg-background text-foreground">
            <div className="w-full max-w-md space-y-6 rounded-xl bg-card p-8 shadow-lg border border-border">

                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold">Forgot Password</h1>
                    <p className="text-muted-foreground">
                        Enter your registered email to receive a password reset link
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

                    </div>

                    <button
                        type="submit"
                        disabled={!isValid || !isDirty || forgotPassword.isPending}
                        className="relative mt-5 w-full cursor-pointer rounded-md bg-primary py-2 text-primary-foreground font-medium hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:opacity-50 flex justify-center items-center"
                    >
                        <span className="invisible">Send Reset Link</span>

                        <span className="absolute">
                            {forgotPassword.isPending
                                ? <Loader size={15} className="animate-spin" />
                                : "Send Reset Link"
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

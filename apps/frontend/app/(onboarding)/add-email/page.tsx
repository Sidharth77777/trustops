
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader, Mail, CheckCircle2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { addEmailSchema, AddEmailSchemaType } from "@/schemas/auth"
import { useAuthAddEmail } from "@/hooks/auth.hooks"

export default function AddEmailPage() {
    const router = useRouter()
    const addEmail = useAuthAddEmail()

    const [emailSent, setEmailSent] = useState(false)

    const {register, handleSubmit, formState: { isValid, isDirty, errors }} = useForm<AddEmailSchemaType>({
        resolver: zodResolver(addEmailSchema),
        mode: "onChange",
    })

    const onSubmit = (data: AddEmailSchemaType) => {
        addEmail.mutate(data, {
            onSuccess: () => {
                setEmailSent(true)
            }
        })
    }

    return (
        <div className="min-h-screen p-2 flex items-center justify-center bg-background text-foreground">
            <div className="w-full max-w-md space-y-6 rounded-xl bg-card p-8 shadow-lg border border-border">

                {!emailSent ? (
                    <>
                        <div className="text-center space-y-3">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                                <Mail className="h-7 w-7 text-primary" />
                            </div>

                            <h1 className="text-2xl font-bold">
                                One last step!
                            </h1>

                            <p className="text-sm text-muted-foreground">
                                Since you're signing in with your wallet, please add an email
                                address to complete your account setup...
                            </p>

                            <p className="text-sm text-muted-foreground">
                                This is only a one-time step !<br /> Your email will help us keep you
                                informed about important account updates and communications
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <div className="space-y-4">

                                <div>
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
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

                                <button
                                    type="submit"
                                    disabled={!isValid || !isDirty || addEmail.isPending}
                                    className="w-full cursor-pointer rounded-md bg-primary py-2 text-primary-foreground font-medium hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 flex justify-center items-center"
                                >
                                    <span className="invisible">
                                        Send Verification Email
                                    </span>

                                    <span className="absolute flex items-center gap-2">
                                        {addEmail.isPending ? (
                                            <>
                                                <Loader size={16} className="animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            "Send Verification Email"
                                        )}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="text-center space-y-5">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold">
                                Check your inbox
                            </h1>

                            <p className="text-sm text-muted-foreground">
                                We've sent a verification link to your email.
                                Please check your inbox and verify your email
                                address to complete your account setup.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => router.replace("/dashboard")}
                            className="w-full rounded-md bg-primary py-2 text-primary-foreground font-medium hover:opacity-90"
                        >
                            Continue to Dashboard
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}

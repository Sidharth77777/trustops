"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, UserRound, Settings } from "lucide-react"
import { useAuthStore } from "@/store/auth.store"
import { useWebStore } from "@/store/web.store"

export default function Sidebar() {
    const pathname = usePathname()

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const sidebarCollapse = useWebStore((state) => state.sidebarCollapse)
    const setSidebarCollapse = useWebStore((state) => state.setSidebarCollapse)
    
    const closeSidebar = () => setSidebarCollapse(true)

    return (
        <>
            {/* Mobile backdrop */}
            {!sidebarCollapse && (
                <button
                    type="button"
                    onClick={closeSidebar}
                    aria-label="Close sidebar"
                    className="fixed inset-0 top-14 z-40 bg-black/50 md:hidden"
                />
            )}

            {/* Mobile sidebar */}
            <aside
                aria-hidden={sidebarCollapse}
                className={`
                    fixed left-0 top-14 z-40
                    flex h-[calc(100vh-3.5rem)] w-72 flex-col
                    border-r border-border
                    bg-background text-foreground
                    shadow-xl
                    transition-transform duration-300 ease-in-out
                    md:hidden
                    ${sidebarCollapse
                        ? "-translate-x-full"
                        : "translate-x-0"
                    }
                `}
            >
                {/* Sidebar header */}
                <div className="flex items-center justify-between border-b border-border px-4 py-4">
                    <span className="text-sm font-semibold">
                        Menu
                    </span>

                    <button
                        type="button"
                        onClick={closeSidebar}
                        aria-label="Close menu"
                        className="rounded-md p-2 transition hover:bg-muted"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Sidebar content */}
                <div className="flex flex-1 flex-col p-4">

                    {isAuthenticated ? (
                        <nav className="flex flex-col gap-2">
                            <Link
                                href="/profile"
                                onClick={closeSidebar}
                                className={`
                                    flex items-center gap-3 rounded-md px-3 py-2.5
                                    text-sm transition
                                    ${pathname === "/profile"
                                        ? "bg-accent text-accent-foreground"
                                        : "hover:bg-muted"
                                    }
                                `}
                            >
                                <UserRound className="h-5 w-5" />
                                Profile
                            </Link>

                            <Link
                                href="/settings"
                                onClick={closeSidebar}
                                className={`
                                    flex items-center gap-3 rounded-md px-3 py-2.5
                                    text-sm transition
                                    ${pathname === "/settings"
                                        ? "bg-accent text-accent-foreground"
                                        : "hover:bg-muted"
                                    }
                                `}
                            >
                                <Settings className="h-5 w-5" />
                                Settings
                            </Link>
                        </nav>
                    ) : (
                        <div className="mt-auto flex flex-col gap-3">
                            <Link
                                href="/login"
                                onClick={closeSidebar}
                                className="
                                    flex w-full items-center justify-center
                                    rounded-md border border-border
                                    bg-secondary py-2.5
                                    text-sm font-medium text-white
                                    transition hover:opacity-90
                                "
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                onClick={closeSidebar}
                                className="
                                    flex w-full items-center justify-center
                                    rounded-md bg-primary py-2.5
                                    text-sm font-medium text-primary-foreground
                                    transition hover:opacity-90
                                "
                            >
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </aside>
        </>
    )
}

"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, LogOut, UserRound, Settings } from "lucide-react"
import { useAuthStore } from "@/store/auth.store"
import { useWebStore } from "@/store/web.store"
import { useAuthGetMe, useAuthLogout } from "@/hooks/auth.hooks"
import { ThemeToggle } from "@/app/components/common/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import { dropdownVariants } from "@/config/config"

export default function Header() {
    const user = useAuthStore((state) => state.user)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const toggleSidebar = useWebStore((state) => state.toggleSidebar)

    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement | null>(null)
    const hasRequestedMe = useRef(false)

    const logout = useAuthLogout()
    const getMe = useAuthGetMe()

    const isAuthInitialized = useAuthStore(
  (state) => state.isAuthInitialized
)

useEffect(() => {
  if (!isAuthInitialized) return

  if (!isAuthenticated) {
    hasRequestedMe.current = false
    return
  }

  if (!user && !hasRequestedMe.current) {
    hasRequestedMe.current = true
    getMe.mutate()
  }
}, [isAuthInitialized, isAuthenticated, user, getMe.mutate])


    useEffect(() => {
        if (!menuOpen) return

        const handleOutsideClick = (event: PointerEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false)
            }
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setMenuOpen(false)
            }
        }

        document.addEventListener("pointerdown", handleOutsideClick)
        document.addEventListener("keydown", handleEscape)

        return () => {
            document.removeEventListener("pointerdown", handleOutsideClick)
            document.removeEventListener("keydown", handleEscape)
        }

    }, [menuOpen])

    const handleLogout = () => {
        if (logout.isPending) return

        setMenuOpen(false)
        logout.mutate()
    }

    const letter =
        user?.name?.[0]?.toUpperCase() ||
        user?.email?.[0]?.toUpperCase() ||
        "U"

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border bg-background">

            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-4">

                {/* LEFT SECTION */}

                <div className="flex min-w-0 items-center gap-2">

                    {/* MOBILE SIDEBAR */}

                    <button
                        type="button"
                        onClick={toggleSidebar}
                        className="rounded-md p-2 transition hover:bg-muted md:hidden"
                        aria-label="Toggle sidebar"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    {/* BRAND */}

                    <Link
                        href="/"
                        className="flex min-w-0 items-center gap-2"
                    >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground">
                            T
                        </div>

                        <span className="whitespace-nowrap text-lg font-bold tracking-wide">
                            TrustOps
                        </span>
                    </Link>


                </div>

                {/* RIGHT SECTION */}

                <div className="flex shrink-0 items-center gap-2 sm:gap-4">

                    <ThemeToggle />

                    {/* UNAUTHENTICATED */}

                    {!isAuthenticated ? (

                        <>
                            {/* DESKTOP LOGIN / SIGNUP */}

                            <div className="hidden items-center gap-2 sm:flex">

                                <Link
                                    href="/login"
                                    className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition hover:bg-muted"
                                >
                                    Login
                                </Link>

                                <Link
                                    href="/register"
                                    className="whitespace-nowrap rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground transition hover:opacity-90"
                                >
                                    Sign up
                                </Link>

                            </div>
                        </>

                    ) : (

                        /* AUTHENTICATED */

                        <div className="relative" ref={menuRef}>

                            <button
                                type="button"
                                onClick={() => setMenuOpen((prev) => !prev)}
                                className="rounded-full outline-none transition hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background"
                                aria-label="User menu"
                                aria-haspopup="menu"
                                aria-expanded={menuOpen}
                            >
                                <Avatar className="h-8 w-8 cursor-pointer">

                                    <AvatarImage
                                        src={user?.image || ""}
                                        alt={user?.name || "User"}
                                    />

                                    <AvatarFallback className="bg-primary font-bold text-primary-foreground">
                                        {letter}
                                    </AvatarFallback>

                                </Avatar>
                            </button>

                            {/* USER DROPDOWN */}

                            <AnimatePresence>
                                {menuOpen && (

                                    <motion.div
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={dropdownVariants}
                                        className="absolute right-0 top-11 z-50 w-56 origin-top-right rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg"
                                    >

                                        {/* USER INFO */}

                                        <div className="px-3 py-2">

                                            <p className="truncate text-sm font-medium">
                                                {user?.name || "Account"}
                                            </p>

                                            <p className="truncate text-xs text-muted-foreground">
                                                {user?.email || "Connected account"}
                                            </p>

                                        </div>

                                        <div className="my-1 h-px bg-border" />

                                        {/* PROFILE */}

                                        <Link
                                            href="/profile"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm transition hover:bg-accent hover:text-accent-foreground"
                                        >
                                            <UserRound className="h-4 w-4" />
                                            Profile
                                        </Link>

                                        {/* SETTINGS */}

                                        <Link
                                            href="/settings"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm transition hover:bg-accent hover:text-accent-foreground"
                                        >
                                            <Settings className="h-4 w-4" />
                                            Settings
                                        </Link>

                                        <div className="my-1 h-px bg-border" />

                                        {/* LOGOUT */}

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            disabled={logout.isPending}
                                            className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <LogOut className="h-4 w-4" />

                                            {logout.isPending
                                                ? "Logging out..."
                                                : "Logout"
                                            }
                                        </button>

                                        

                                    </motion.div>

                                )}
                            </AnimatePresence>

                        </div>

                    )}

                </div>

            </div>

        </header>
    )
}

"use client"

import Header from "@/app/components/layout/header"
import Sidebar from "@/app/components/layout/sidebar"
import Footer from "@/app/components/layout/footer"
import { ThemeProvider } from "./ThemeProvider"
import QueryProvider from "@/providers/QueryProvider"
import AuthProvider from "@/providers/AuthProvider"
import { Toaster } from "react-hot-toast"

export const LayoutProvider = ({children,}: {children: React.ReactNode}) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <QueryProvider>
                <AuthProvider>

                    <Header />
                    <Sidebar />
                        {children}
                    <Footer />

                    <Toaster position="top-right" />
                </AuthProvider>
            </QueryProvider>
        </ThemeProvider>
    )
}

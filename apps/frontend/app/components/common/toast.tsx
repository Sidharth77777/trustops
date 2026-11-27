import { toastTheme } from "@/config/toast-theme"
import toast from "react-hot-toast"

function getTheme() {
  if (typeof window === "undefined") return "light"
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

export const toastSuccess = (message: string) => {
  const t = toastTheme[getTheme()]

  toast.success(message, {
    style: {
      background: t.background,
      color: t.foreground,
      border: `2px solid ${t.success}`,
      borderRadius: "0.75rem",
    },
    iconTheme: {
      primary: t.success,
      secondary: "#ffffff",
    },
  })
}

export const toastError = (message: string) => {
  const t = toastTheme[getTheme()]

  toast.error(message, {
    style: {
      background: t.background,
      color: t.foreground,
      border: `2px solid ${t.error}`,
      borderRadius: "0.75rem",
    },
    iconTheme: {
      primary: t.error,
      secondary: "#ffffff",
    },
  })
}

export const toastInfo = (message: string) => {
  const t = toastTheme[getTheme()]

  toast(message, {
    style: {
      background: t.background,
      color: t.foreground,
      border: `2px solid ${t.info}`,
      borderRadius: "0.75rem",
    },
    iconTheme: {
      primary: t.info,
      secondary: "#000000",
    },
  })
}

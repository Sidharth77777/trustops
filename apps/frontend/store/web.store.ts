import {create} from "zustand"
import { WebStore } from "@/types/types"

export const useWebStore = create<WebStore>((set) => ({
    sidebarCollapse: true,

    setSidebarCollapse: (value) => 
        set({ sidebarCollapse:value }),
    
    toggleSidebar: () => 
        set((state) => ({
            sidebarCollapse: !state.sidebarCollapse
        })),
}))
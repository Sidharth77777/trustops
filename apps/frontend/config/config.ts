export const dropdownVariants = {
        hidden: {
            opacity: 0,
            y: -8,
            scale: 0.96
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.18,
                ease: "easeOut" as const
            }
        },
        exit: {
            opacity: 0,
            y: -8,
            scale: 0.96,
            transition: {
                duration: 0.12,
                ease: "easeIn" as const
            }
        }
    }
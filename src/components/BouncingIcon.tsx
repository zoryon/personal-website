"use client"

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const BouncingIcon = ({ 
    iconName, 
    className,
}: {
    iconName: string,
    className?: string,
}) => {
    return (
        <motion.i
            className={cn(
                iconName,
                className,
            )}
            style={{ rotate: "-60deg" }}
            animate={{
                scale: [1, 1.2, 1],
            }}
            transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 1,
                ease: "easeInOut",
            }}
        />
    );
};

export default BouncingIcon;
"use client";

import { BASE_COMMAND_LINE } from "@/constants/animation.constant";
import { Character } from "@/lib/character";
import { cn, stopAnimation } from "@/lib/utils";
import {
    LoadingAnimationProps,
    TerminalLineProps,
    TerminalProps
} from "@/types/animation.type";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ terminalLines }) => {
    const [lines, setLines] = useState<string[]>([]);
    const [isAnimating, setIsAnimating] = useState<boolean>(true);

    useEffect(() => {
        // Function to process the terminal commands and responses
        const processEntries = async () => {
            for (const entry of terminalLines) {
                if (entry.command?.toLowerCase() === "clear") {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    // display "clear" command
                    setLines((prev) => [
                        ...prev,
                        `${BASE_COMMAND_LINE}${entry.path}${Character.getSpace()}clear`
                    ]);

                    await new Promise((resolve) => setTimeout(resolve, 1200));
                    setLines([]); // clear terminal
                } else {
                    // display the command
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    setLines((prev) => [
                        ...prev,
                        `${BASE_COMMAND_LINE}${entry.path}${Character.getSpace()}${entry.command}`
                    ]);

                    // display each response line
                    for (let i = 0; i < entry.response.length; i++) {
                        await new Promise((resolve) => setTimeout(
                            resolve,
                            i === entry.response.length - 1 ? 1000 : 500
                        ));
                        setLines((prev) => [...prev, entry.response[i]]);
                    }
                }
            }

            setIsAnimating(false);

            // cleanup and remove the animation element after completion
            setTimeout(() => {
                stopAnimation();
            }, 2000);
        };

        processEntries();
    }, [terminalLines]);

    return (
        <div
            id="loading-animation"
            className="w-screen h-screen flex justify-center items-center bg-green-950"
        >
            <Terminal
                lines={lines}
                isAnimating={isAnimating}
                lastLineIndex={lines.length - 1}
            />
        </div>
    );
};

const Terminal: React.FC<TerminalProps> = ({ lines, isAnimating, lastLineIndex }) => {
    return (
        <div
            className="w-full h-full p-4 bg-green-950 flex flex-col
            justify-start items-start"
        >
            <div 
                className="whitespace-nowrap text-green-400 font-mono
                text-xs sm:text-sm mb-5 hover:cursor-pointer"
                onClick={() => stopAnimation()}
            >
                # stop animation
            </div>
            <AnimatePresence>
                {lines.map((line, index) => (
                    <TerminalLine
                        key={index}
                        text={line}
                        isLastLine={index === lastLineIndex}
                        isAnimating={
                            isAnimating &&
                            index === lastLineIndex &&
                            line.startsWith(BASE_COMMAND_LINE)
                        }
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

const TerminalLine: React.FC<TerminalLineProps> = ({
    text,
    isLastLine = false,
    isAnimating = false
}) => {
    const textRef = useRef<HTMLSpanElement>(null);
    const [charWidth, setCharWidth] = useState<number>(8);

    useEffect(() => {
        if (isLastLine && isAnimating && textRef.current) {
            const span = document.createElement("span");
            span.style.visibility = "hidden";
            span.style.position = "absolute";
            span.style.fontSize = window.getComputedStyle(textRef.current).fontSize;
            span.style.fontFamily = window.getComputedStyle(textRef.current).fontFamily;
            span.textContent = "x";
            document.body.appendChild(span);

            setCharWidth(span.offsetWidth);
            document.body.removeChild(span);
        }
    }, [text, isLastLine, isAnimating]);

    return (
        <motion.div
            initial={{ width: 0 }}
            animate={{ width: "fit-content" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={cn(
                `overflow-hidden whitespace-nowrap text-green-400 font-mono
                text-xs sm:text-sm md:text-xl relative`,
                !text.startsWith(BASE_COMMAND_LINE) && "pl-5",
                text.startsWith(BASE_COMMAND_LINE) && "mt-5"
            )}
        >
            <span ref={textRef}>{text}</span>
            {isLastLine && isAnimating && (
                <motion.span
                    animate={{ opacity: [0, 0.6] }}
                    transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    style={{ width: `${charWidth}px` }}
                    className="absolute right-0 h-4 sm:h-6 bg-green-400"
                />
            )}
        </motion.div>
    );
};

export default LoadingAnimation;

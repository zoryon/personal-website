"use client";

import { BASE_COMMAND_LINE } from "@/constants/animation.constant";
import { Character } from "@/lib/character";
import { cn } from "@/lib/utils";
import { isLastLine, stopAnimation } from "@/lib/animation.lib";
import {
    LoadingAnimationProps,
    TerminalLineProps,
    TerminalProps,
} from "@/types/animation.type";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import BouncingIcon from "./BouncingIcon";

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ terminalLines }) => {
    const [lines, setLines] = useState<string[]>([]);
    const [completedLines, setCompletedLines] = useState<boolean[]>([]);
    const loadingAnimationRef = useRef<HTMLDivElement>(null);

    const promisesPending = useRef<number>(0);

    const incrementPromiseCounter = ({
        resolve,
        time,
    }: {
        resolve: (value?: unknown) => void;
        time: number;
    }) => {
        promisesPending.current++;
        setTimeout(() => {
            resolve();
            promisesPending.current--;
        }, time);
    };

    useEffect(() => {
        const processEntries = async () => {
            for (const entry of terminalLines) {
                if (entry.command.toLowerCase() !== Character.getClear()) {
                    // NOT clear case
                    await new Promise((resolve) => incrementPromiseCounter({ resolve, time: 1000 }));

                    const newCommandLine = `${BASE_COMMAND_LINE}${entry.path}${Character.getSpace()}${entry.command}`;
                    setLines((prev) => [...prev, newCommandLine]);
                    setCompletedLines((prev) => [...prev, false]);

                    for (let i = 0; i < entry.response.length; i++) {
                        const delayTime = i === entry.response.length - 1 ? 1000 : 500;
                        await new Promise((resolve) =>
                            incrementPromiseCounter({ resolve, time: delayTime })
                        );

                        setLines((prev) => [...prev, entry.response[i]]);
                        setCompletedLines((prev) => [...prev, false]);
                    }
                } else {
                    // clear case
                    await new Promise((resolve) => incrementPromiseCounter({ resolve, time: 1000 }));

                    const newClearLine = `${BASE_COMMAND_LINE}${entry.path}${Character.getSpace()}${Character.getClear()}`;
                    setLines((prev) => [...prev, newClearLine]);
                    setCompletedLines((prev) => [...prev, false]);

                    await new Promise((resolve) => incrementPromiseCounter({ resolve, time: 1200 }));

                    setLines([]);
                    setCompletedLines([]);
                }
            }

            if (promisesPending.current === 0) {
                setTimeout(stopAnimation, 2000);
            }
        };

        processEntries();
    }, [terminalLines]);

    const handleLineComplete = (index: number) => {
        setCompletedLines(prev => {
            const newCompletedLines = [...prev];
            newCompletedLines[index] = true;
            return newCompletedLines;
        });
    };

    return (
        <div
            id="loading-animation"
            ref={loadingAnimationRef}
            className="w-screen min-h-screen flex justify-center items-center bg-green-950"
        >
            <Terminal
                lines={lines}
                completedLines={completedLines}
                onLineComplete={handleLineComplete}
                containerRef={loadingAnimationRef}
            />
        </div>
    );
};

const Terminal: React.FC<TerminalProps> = ({
    lines,
    completedLines,
    onLineComplete,
    containerRef
}) => {
    return (
        <div
            className="w-full min-h-screen p-4 bg-green-950 flex flex-col justify-start items-start"
        >
            <div
                className="flex items-center gap-3 whitespace-nowrap text-green-400 font-mono text-xs sm:text-sm mb-5 hover:cursor-pointer"
                onClick={() => stopAnimation()}
            >
                <span># stop animation</span>
                <BouncingIcon iconName="fa-solid fa-hand-pointer" />
            </div>
            <AnimatePresence>
                {lines.map((line, index) => (
                    <TerminalLine
                        key={index}
                        text={line}
                        index={index}
                        isLastLine={isLastLine({ array: lines, index })}
                        isCompleted={completedLines[index]}
                        onLineComplete={onLineComplete}
                        containerRef={containerRef}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

const TerminalLine: React.FC<TerminalLineProps> = ({
    text,
    index,
    isLastLine,
    isCompleted,
    onLineComplete,
    containerRef,
}) => {
    const textRef = useRef<HTMLSpanElement>(null);
    const [shouldWrap, setShouldWrap] = useState(false);
    const [charWidth, setCharWidth] = useState<number>(8);

    useEffect(() => {
        const checkOverflow = () => {
            if (containerRef.current && textRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const textWidth = textRef.current.offsetWidth;

                if (textWidth > containerWidth) {
                    setShouldWrap(true);
                    onLineComplete(index);
                }
            }
        };

        // Measure character width
        if (textRef.current) {
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

        const timeoutId = setTimeout(checkOverflow, 100);

        // Add resize listener
        window.addEventListener('resize', checkOverflow);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', checkOverflow);
        };
    }, [text, index, onLineComplete, containerRef]);

    return (
        <motion.div
            initial={{ width: 0 }}
            animate={{ width: "fit-content" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={cn(
                `overflow-hidden text-green-400 font-mono text-xs sm:text-sm md:text-xl relative`,
                !text.startsWith(BASE_COMMAND_LINE) && "pl-5",
                text.startsWith(BASE_COMMAND_LINE) && "mt-5",
                shouldWrap ? "text-wrap" : "whitespace-nowrap"
            )}
        >
            <span ref={textRef}>{text}</span>
            {!isCompleted && text.startsWith(BASE_COMMAND_LINE) && isLastLine && (
                <motion.span
                    animate={{ opacity: [0, 0.6] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    style={{ width: `${charWidth}px` }}
                    className="absolute right-0 h-4 sm:h-6 bg-green-400"
                />
            )}
        </motion.div>
    );
};

export default LoadingAnimation;
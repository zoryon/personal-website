import { RefObject } from "react";

export interface LoadingAnimationProps {
    terminalLines: TerminalEntry[];
}

export interface TerminalEntry {
    path: string;
    command: string;
    response: string[];
}

export interface TerminalProps {
    lines: string[];
    completedLines: boolean[];
    onLineComplete: (index: number) => void;
    containerRef: RefObject<HTMLDivElement | null>;
}

export interface TerminalLineProps {
    text: string;
    index: number;
    isLastLine: boolean;
    isCompleted: boolean;
    onLineComplete: (index: number) => void;
    containerRef: RefObject<HTMLDivElement | null>;
}
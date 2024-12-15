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
    isAnimating?: boolean;
    lastLineIndex?: number;
}

export interface TerminalLineProps {
    text: string;
    isLastLine?: boolean;
    isAnimating?: boolean;
}
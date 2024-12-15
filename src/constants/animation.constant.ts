import { TerminalEntry } from "@/types/animation.type";

export const BASE_COMMAND_LINE = "zoryon@server:";

export const TERMINAL_LINES: TerminalEntry[] = [
    {
        path: "~$",
        command: "pwd",
        response: [
            "/home/zoryon",
        ],
    },
    {
        path: "~$",
        command: "ls -l",
        response: [
            "total 533248",
            "drwxr-xr-x 2 zoryon root 533248 Nov 20 06:12 zoryon-website",
        ],
    },
    {
        path: "~$",
        command: "cd ./zoryon-website",
        response: [],
    },
    {
        path: "~/zoryon-website$",
        command: "clear",
        response: [],
    },
    {
        path: "~/zoryon-website$",
        command: "npm run dev",
        response: [
            "> personal-website@0.1.0 dev",
            "> next dev --turbopack",
            "▲ Next.js 15.1.0 (Turbopack)",
            "- Local: http://localhost:3000",
            "- Network: http://192.168.1.68:3000",
            "Starting...",
            "✓ Ready in 162ms",
            "○ Compiling / ...",
            "✓ Compiled / in 29ms",
        ],
    },
];
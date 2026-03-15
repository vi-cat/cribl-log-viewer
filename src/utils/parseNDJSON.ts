import type { LogEntry } from "../types/LogEntry";

export function parseNDJSON(
  chunk: string,
  buffer: string,
): { entries: LogEntry[]; remaining: string } {
  const lines = (buffer + chunk).split("\n");
  const remaining = lines.pop() ?? "";

  const entries: LogEntry[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      entries.push(JSON.parse(line) as LogEntry);
    } catch {
      // skip malformed lines
    }
  }

  return { entries, remaining };
}

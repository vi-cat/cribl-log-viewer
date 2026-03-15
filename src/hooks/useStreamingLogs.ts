import { useState, useEffect } from "react";
import type { LogEntry } from "../types/LogEntry";
import { parseNDJSON } from "../utils/parseNDJSON";

interface StreamingLogsResult {
  logs: LogEntry[];
  loading: boolean;
  error: Error | null;
}

export function useStreamingLogs(url: string): StreamingLogsResult {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function stream() {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.body) throw new Error("Response body is null");

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const { entries, remaining } = parseNDJSON(chunk, buffer);
        buffer = remaining;

        if (entries.length > 0) {
          setLogs((prev) => [...prev, ...entries]);
        }
      }

      // flush any remaining buffer after stream ends
      const { entries } = parseNDJSON("", buffer);
      if (entries.length > 0) {
        setLogs((prev) => [...prev, ...entries]);
      }
    }

    stream()
      .catch((e: unknown) => {
        if (e instanceof Error && e.name !== "AbortError") setError(e);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [url]);

  return { logs, loading, error };
}

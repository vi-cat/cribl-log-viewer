import { useReducer, useEffect } from "react";
import type { LogEntry } from "../types/LogEntry";
import { parseNDJSON } from "../utils/parseNDJSON";

interface StreamingLogsResult {
  logs: LogEntry[];
  loading: boolean;
  error: Error | null;
}

type State = StreamingLogsResult;

type Action =
  | { type: "reset" }
  | { type: "append"; entries: LogEntry[] }
  | { type: "done" }
  | { type: "error"; error: Error };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "reset":
      return { logs: [], loading: true, error: null };
    case "append":
      return { ...state, logs: [...state.logs, ...action.entries] };
    case "done":
      return { ...state, loading: false };
    case "error":
      return { ...state, loading: false, error: action.error };
  }
}

const initialState: State = { logs: [], loading: true, error: null };

export function useStreamingLogs(url: string): StreamingLogsResult {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "reset" });
    const controller = new AbortController();

    async function stream() {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.body) throw new Error("Response body is null");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const { entries, remaining } = parseNDJSON(chunk, buffer);
        buffer = remaining;

        if (entries.length > 0) {
          dispatch({ type: "append", entries });
        }
      }

      // flush any remaining buffer after stream ends
      const { entries } = parseNDJSON("", buffer);
      if (entries.length > 0) {
        dispatch({ type: "append", entries });
      }
    }

    stream()
      .catch((e: unknown) => {
        if (e instanceof Error && e.name !== "AbortError") {
          dispatch({ type: "error", error: e });
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) dispatch({ type: "done" });
      });

    return () => controller.abort();
  }, [url]);

  return state;
}

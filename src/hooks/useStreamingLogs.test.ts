import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useStreamingLogs } from "../hooks/useStreamingLogs";

function makeStream(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
}

describe("useStreamingLogs", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("starts with loading=true and empty logs", () => {
    vi.spyOn(global, "fetch").mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useStreamingLogs("http://test"));
    expect(result.current.loading).toBe(true);
    expect(result.current.logs).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("parses streamed NDJSON entries and sets loading=false on completion", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      body: makeStream(['{"_time":1000,"msg":"hello"}\n{"_time":2000,"msg":"world"}\n']),
    } as Response);

    const { result } = renderHook(() => useStreamingLogs("http://test"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.logs).toHaveLength(2);
    expect(result.current.logs[0]).toEqual({ _time: 1000, msg: "hello" });
    expect(result.current.logs[1]).toEqual({ _time: 2000, msg: "world" });
    expect(result.current.error).toBeNull();
  });

  it("handles entries split across multiple chunks", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      body: makeStream(['{"_time":1,"a":', '"b"}\n']),
    } as Response);

    const { result } = renderHook(() => useStreamingLogs("http://test"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.logs).toHaveLength(1);
    expect(result.current.logs[0]).toEqual({ _time: 1, a: "b" });
  });

  it("sets error and loading=false on fetch failure", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useStreamingLogs("http://test"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error?.message).toBe("Network error");
    expect(result.current.logs).toEqual([]);
  });

  it("aborts the fetch on unmount", () => {
    let capturedSignal: AbortSignal | undefined;
    vi.spyOn(global, "fetch").mockImplementation((_url, options) => {
      capturedSignal = options?.signal as AbortSignal;
      return new Promise(() => {});
    });

    const { unmount } = renderHook(() => useStreamingLogs("http://test"));
    unmount();

    expect(capturedSignal?.aborted).toBe(true);
  });

  it("does not dispatch error for AbortError on unmount", async () => {
    vi.spyOn(global, "fetch").mockImplementation((_url, options) => {
      const signal = options?.signal as AbortSignal;
      return new Promise((_, reject) => {
        signal.addEventListener("abort", () => {
          reject(Object.assign(new Error("Aborted"), { name: "AbortError" }));
        });
      });
    });

    const { result, unmount } = renderHook(() =>
      useStreamingLogs("http://test"),
    );
    unmount();

    await waitFor(() => expect(result.current.loading).toBe(true));
    expect(result.current.error).toBeNull();
  });
});

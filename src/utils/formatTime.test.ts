import { describe, it, expect } from "vitest";
import { formatTime } from "../utils/formatTime";

describe("formatTime", () => {
  it("formats a valid millisecond timestamp as ISO 8601", () => {
    expect(formatTime(0)).toBe("1970-01-01T00:00:00.000Z");
    expect(formatTime(1724323612592)).toBe("2024-08-22T10:46:52.592Z");
    expect(formatTime(-1)).toBe("1969-12-31T23:59:59.999Z");
  });

  it("returns — for null", () => {
    expect(formatTime(null as unknown as number)).toBe("—");
  });

  it("returns — for undefined", () => {
    expect(formatTime(undefined as unknown as number)).toBe("—");
  });

  it("returns — for NaN", () => {
    expect(formatTime(NaN)).toBe("—");
  });

  it("returns — for invalid timestamp", () => {
    expect(formatTime(Infinity)).toBe("—");
  });
});

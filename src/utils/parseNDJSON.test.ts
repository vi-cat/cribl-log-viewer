import { describe, it, expect } from "vitest";
import { parseNDJSON } from "../utils/parseNDJSON";

describe("parseNDJSON", () => {
  it("parses a single complete line", () => {
    const { entries, remaining } = parseNDJSON(
      '{"_time":1,"msg":"hello"}\n',
      "",
    );
    expect(entries).toHaveLength(1);
    expect(entries[0]).toEqual({ _time: 1, msg: "hello" });
    expect(remaining).toBe("");
  });

  it("parses multiple lines in one chunk", () => {
    const { entries, remaining } = parseNDJSON(
      '{"_time":1}\n{"_time":2}\n{"_time":3}\n',
      "",
    );
    expect(entries).toHaveLength(3);
    expect(entries.map((e) => e._time)).toEqual([1, 2, 3]);
    expect(remaining).toBe("");
  });

  it("keeps a partial last line in remaining", () => {
    const { entries, remaining } = parseNDJSON(
      '{"_time":1}\n{"_time":2',
      "",
    );
    expect(entries).toHaveLength(1);
    expect(remaining).toBe('{"_time":2');
  });

  it("prepends buffer to chunk before parsing", () => {
    const { entries, remaining } = parseNDJSON(',"msg":"hi"}\n', '{"_time":1');
    expect(entries).toHaveLength(1);
    expect(entries[0]).toEqual({ _time: 1, msg: "hi" });
    expect(remaining).toBe("");
  });

  it("returns empty entries and empty remaining for empty inputs", () => {
    const { entries, remaining } = parseNDJSON("", "");
    expect(entries).toHaveLength(0);
    expect(remaining).toBe("");
  });

  it("flushes buffer with empty chunk", () => {
    const { entries, remaining } = parseNDJSON("", '{"_time":1}\n');
    expect(entries).toHaveLength(1);
    expect(remaining).toBe("");
  });

  it("skips whitespace-only lines", () => {
    const { entries } = parseNDJSON('{"_time":1}\n   \n\n{"_time":2}\n', "");
    expect(entries).toHaveLength(2);
  });

  it("skips malformed JSON without throwing", () => {
    const { entries } = parseNDJSON(
      '{"_time":1}\nnot-json\n{"_time":2}\n',
      "",
    );
    expect(entries).toHaveLength(2);
    expect(entries.map((e) => e._time)).toEqual([1, 2]);
  });
});

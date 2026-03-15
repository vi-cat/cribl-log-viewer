import { useState, useRef, useCallback, useEffect } from "react";
import { VariableSizeList } from "react-window";
import type { LogEntry } from "../../types/LogEntry";
import { LogRow } from "./LogRow";
import styles from "./LogsTable.module.css";

const COLLAPSED_ROW_HEIGHT = 42; // keep in sync with .row height in LogsTable.module.css

// 18px = 0.75rem font-size × 1.5 line-height (keep in sync with .expandedContent pre in LogsTable.module.css)
// 24px = 0.75rem top padding + 0.75rem bottom padding
function getExpandedHeight(log: LogEntry): number {
  const lines = JSON.stringify(log, null, 2).split("\n").length;
  return lines * 18 + 24;
}

type LogsTableProps = {
  logs: LogEntry[];
};

export const LogsTable = ({ logs }: LogsTableProps) => {
  const listRef = useRef<VariableSizeList>(null);
  const listWrapperRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const measuredHeights = useRef<Map<number, number>>(new Map());

  useEffect(() => {
    const el = listWrapperRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setListHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onHeightChange = useCallback((index: number, height: number) => {
    measuredHeights.current.set(index, height);
    listRef.current?.resetAfterIndex(index);
  }, []);

  const toggleRow = useCallback((index: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
        measuredHeights.current.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
    listRef.current?.resetAfterIndex(index);
  }, []);

  const getItemSize = useCallback(
    (index: number) => {
      if (!expandedRows.has(index)) return COLLAPSED_ROW_HEIGHT;
      return (
        measuredHeights.current.get(index) ??
        COLLAPSED_ROW_HEIGHT + getExpandedHeight(logs[index])
      );
    },
    [expandedRows, logs],
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerCell} />
        <div className={styles.headerCell}>Time</div>
        <div className={styles.headerCell}>Event</div>
      </div>
      <div className={styles.listWrapper} ref={listWrapperRef}>
        {listHeight > 0 && (
          <VariableSizeList
            ref={listRef}
            height={listHeight}
            width="100%"
            itemCount={logs.length}
            itemSize={getItemSize}
          >
            {({ index, style }) => (
              <div style={style}>
                <LogRow
                  log={logs[index]}
                  index={index}
                  isExpanded={expandedRows.has(index)}
                  onToggle={toggleRow}
                  onHeightChange={onHeightChange}
                />
              </div>
            )}
          </VariableSizeList>
        )}
      </div>
    </div>
  );
};

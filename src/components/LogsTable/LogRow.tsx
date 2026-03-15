import { useRef, useEffect } from "react";
import type { LogEntry } from "../../types/LogEntry";
import { formatTime } from "../../utils/formatTime";
import styles from "./LogsTable.module.css";

type LogRowProps = {
  log: LogEntry;
  index: number;
  isExpanded: boolean;
  onToggle: (index: number) => void;
  onHeightChange: (index: number, height: number) => void;
};

export const LogRow = ({
  log,
  index,
  isExpanded,
  onToggle,
  onHeightChange,
}: LogRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isExpanded) return;
    const el = rowRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      onHeightChange(index, entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [isExpanded, index, onHeightChange]);

  return (
    <div ref={rowRef}>
      <div
        className={`${styles.row}${index % 2 === 0 ? ` ${styles.rowEven}` : ""}`}
        onClick={() => onToggle(index)}
      >
        <span
          className={`${styles.toggleCell}${isExpanded ? ` ${styles.toggleCellExpanded}` : ""}`}
        >
          ❯
        </span>
        <span className={styles.timeCell}>{formatTime(log._time)}</span>
        <span className={styles.eventCell}>{JSON.stringify(log)}</span>
      </div>
      {isExpanded && (
        <div className={styles.expandedContent} onClick={() => onToggle(index)}>
          <pre>{JSON.stringify(log, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

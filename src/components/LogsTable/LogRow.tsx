import { useState } from "react";
import type { LogEntry } from "../../types/LogEntry";
import { formatTime } from "../../utils/formatTime";
import styles from "./LogsTable.module.css";

export const LogRow = ({ log, index }: { log: LogEntry; index: number }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className={`${styles.row}${index % 2 === 0 ? ` ${styles.rowEven}` : ""}`}
        onClick={() => setExpanded((e) => !e)}
      >
        <td
          className={`${styles.toggleCell}${expanded ? ` ${styles.toggleCellExpanded}` : ""}`}
        >
          ❯
        </td>
        <td className={styles.timeCell}>{formatTime(log._time)}</td>
        <td className={styles.eventCell}>{JSON.stringify(log)}</td>
      </tr>
      {expanded && (
        <tr className={styles.row} onClick={() => setExpanded(false)}>
          <td colSpan={3} className={styles.expandedCell}>
            <pre>{JSON.stringify(log, null, 2)}</pre>
          </td>
        </tr>
      )}
    </>
  );
};

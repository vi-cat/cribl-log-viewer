import type { LogEntry } from "../../types/LogEntry";
import { formatTime } from "../../utils/formatTime";
import styles from "./LogsTable.module.css";

export const LogRow = ({ log }: { log: LogEntry }) => {
  return (
    <tr>
      <td className={styles.toggleCell}>❯</td>
      <td className={styles.timeCell}>{formatTime(log._time)}</td>
      <td className={styles.eventCell}>{JSON.stringify(log)}</td>
    </tr>
  );
};

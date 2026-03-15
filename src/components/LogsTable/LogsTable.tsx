import type { LogEntry } from "../../types/LogEntry";
import { LogRow } from "./LogRow";
import styles from "./LogsTable.module.css";

type LogsTableProps = {
  logs: LogEntry[];
};

export const LogsTable = ({ logs }: LogsTableProps) => {
  return (
    <div className={styles.contained}>
      <table className={styles.table}>
        <colgroup>
          <col style={{ width: "2rem" }} />
          <col style={{ width: "14rem" }} />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th></th>
            <th>Time</th>
            <th>Event</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <LogRow log={log} key={index} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

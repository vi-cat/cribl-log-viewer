export interface LogEntry {
  _time: number;
  [key: string]: unknown; // everything else varies
}

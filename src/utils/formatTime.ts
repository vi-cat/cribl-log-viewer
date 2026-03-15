export function formatTime(timestamp: number): string {
  if (timestamp == null) return "—";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "—";
  return date.toISOString();
}

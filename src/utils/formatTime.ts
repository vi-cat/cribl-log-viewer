export function formatTime(timestamp: number | null | undefined): string {
  if (timestamp == null) return "—";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "—";
  return date.toISOString();
}

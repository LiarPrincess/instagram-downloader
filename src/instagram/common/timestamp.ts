export function parseTimestamp(timestamp: number): Date {
  const milliseconds = timestamp * 1000;
  return new Date(milliseconds);
}

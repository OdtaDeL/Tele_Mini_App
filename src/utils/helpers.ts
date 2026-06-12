export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function isToday(dateStr: string): boolean {
  if (!dateStr) return false;
  try {
    return new Date(dateStr).toDateString() === new Date().toDateString();
  } catch {
    return false;
  }
}

export function isYesterday(dateStr: string): boolean {
  if (!dateStr) return false;
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return new Date(dateStr).toDateString() === yesterday.toDateString();
  } catch {
    return false;
  }
}

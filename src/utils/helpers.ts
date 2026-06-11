import type { LevelThreshold } from '../types';

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { level: 1, xp_required: 0, title: 'Newcomer' },
  { level: 2, xp_required: 100, title: 'Learner' },
  { level: 3, xp_required: 250, title: 'Student' },
  { level: 4, xp_required: 500, title: 'Scholar' },
  { level: 5, xp_required: 1000, title: 'Adept' },
  { level: 6, xp_required: 1750, title: 'Expert' },
  { level: 7, xp_required: 2750, title: 'Specialist' },
  { level: 8, xp_required: 4000, title: 'Master' },
  { level: 9, xp_required: 5500, title: 'Grandmaster' },
  { level: 10, xp_required: 7500, title: 'Legend' },
];

export const XP_REWARDS = {
  DAILY_LOGIN: 10,
  COMPLETE_LESSON: 25,
  COMPLETE_MODULE: 100,
  WEEKLY_STREAK: 200,
};

export const DAILY_REWARD_XP = [10, 20, 30, 40, 50, 75, 150];

export function getLevelFromXP(xp: number): number {
  let level = 1;
  for (const threshold of LEVEL_THRESHOLDS) {
    if (xp >= threshold.xp_required) {
      level = threshold.level;
    } else {
      break;
    }
  }
  return level;
}

export function getLevelTitle(level: number): string {
  const threshold = LEVEL_THRESHOLDS.find((t) => t.level === level);
  return threshold?.title ?? 'Unknown';
}

export function getXPForNextLevel(xp: number): { current: number; next: number; progress: number } {
  const currentLevel = getLevelFromXP(xp);
  const currentThreshold = LEVEL_THRESHOLDS.find((t) => t.level === currentLevel);
  const nextThreshold = LEVEL_THRESHOLDS.find((t) => t.level === currentLevel + 1);

  if (!nextThreshold || !currentThreshold) {
    return { current: xp, next: xp, progress: 100 };
  }

  const xpInLevel = xp - currentThreshold.xp_required;
  const xpNeeded = nextThreshold.xp_required - currentThreshold.xp_required;
  const progress = Math.min((xpInLevel / xpNeeded) * 100, 100);

  return { current: xpInLevel, next: xpNeeded, progress };
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function getDaysSinceDate(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function isToday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function isYesterday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

export function getStreakStatus(lastLogin: string, currentStreak: number): number {
  if (isToday(lastLogin)) return currentStreak;
  if (isYesterday(lastLogin)) return currentStreak;
  return 0; // streak broken
}

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { User, Module, Lesson, LessonProgress, Achievement, UserAchievement, DailyReward, AppNotification } from '../types';
import { MOCK_USER, MOCK_MODULES, MOCK_LESSONS, MOCK_ACHIEVEMENTS, MOCK_LEADERBOARD_USERS } from '../data/mockData';
import { getLevelFromXP, generateId, isToday, isYesterday, DAILY_REWARD_XP, XP_REWARDS } from '../utils/helpers';

// ===== State Shape =====
interface AppState {
  user: User;
  modules: Module[];
  lessons: Lesson[];
  lessonProgress: LessonProgress[];
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  dailyRewards: DailyReward[];
  leaderboardUsers: User[];
  notifications: AppNotification[];
  isLoading: boolean;
}

// ===== Actions =====
type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'ADD_XP'; payload: number }
  | { type: 'COMPLETE_LESSON'; payload: { lessonId: string; xpReward: number } }
  | { type: 'CLAIM_DAILY_REWARD' }
  | { type: 'EARN_ACHIEVEMENT'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: AppNotification }
  | { type: 'DISMISS_NOTIFICATION'; payload: string }
  | { type: 'UPDATE_STREAK' }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> }
  // Admin actions
  | { type: 'ADMIN_ADD_MODULE'; payload: Module }
  | { type: 'ADMIN_UPDATE_MODULE'; payload: Module }
  | { type: 'ADMIN_DELETE_MODULE'; payload: string }
  | { type: 'ADMIN_ADD_LESSON'; payload: Lesson }
  | { type: 'ADMIN_UPDATE_LESSON'; payload: Lesson }
  | { type: 'ADMIN_DELETE_LESSON'; payload: string }
  | { type: 'ADMIN_GRANT_XP'; payload: { userId: string; amount: number } }
  | { type: 'ADMIN_BAN_USER'; payload: string }
  | { type: 'ADMIN_RESET_LEADERBOARD'; payload: 'weekly' | 'monthly' };

// ===== Initial State =====
const initialState: AppState = {
  user: MOCK_USER,
  modules: MOCK_MODULES,
  lessons: MOCK_LESSONS,
  lessonProgress: [],
  achievements: MOCK_ACHIEVEMENTS,
  userAchievements: [],
  dailyRewards: [],
  leaderboardUsers: MOCK_LEADERBOARD_USERS,
  notifications: [],
  isLoading: false,
};

// ===== Reducer =====
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'ADD_XP': {
      const newXP = state.user.xp + action.payload;
      const newLevel = getLevelFromXP(newXP);
      return {
        ...state,
        user: { ...state.user, xp: newXP, level: newLevel },
      };
    }

    case 'COMPLETE_LESSON': {
      const { lessonId, xpReward } = action.payload;
      const existing = state.lessonProgress.find(p => p.lesson_id === lessonId && p.user_id === state.user.id);
      if (existing?.status === 'completed') return state;

      const newProgress: LessonProgress = {
        id: generateId(),
        user_id: state.user.id,
        lesson_id: lessonId,
        status: 'completed',
        completed_at: new Date().toISOString(),
      };

      const updatedProgress = existing
        ? state.lessonProgress.map(p => p.id === existing.id ? newProgress : p)
        : [...state.lessonProgress, newProgress];

      const newXP = state.user.xp + xpReward;

      // Check if module is completed
      const lesson = state.lessons.find(l => l.id === lessonId);
      let moduleBonus = 0;
      if (lesson) {
        const moduleLessons = state.lessons.filter(l => l.module_id === lesson.module_id);
        const completedInModule = updatedProgress.filter(
          p => p.status === 'completed' && moduleLessons.some(ml => ml.id === p.lesson_id)
        );
        if (completedInModule.length === moduleLessons.length) {
          moduleBonus = XP_REWARDS.COMPLETE_MODULE;
        }
      }

      const totalXP = newXP + moduleBonus;
      const finalLevel = getLevelFromXP(totalXP);

      return {
        ...state,
        lessonProgress: updatedProgress,
        user: { ...state.user, xp: totalXP, level: finalLevel },
      };
    }

    case 'CLAIM_DAILY_REWARD': {
      const todayReward = state.dailyRewards.find(
        r => isToday(r.claimed_at)
      );
      if (todayReward) return state;

      const streakRewards = [...state.dailyRewards]
        .sort((a, b) => new Date(b.claimed_at).getTime() - new Date(a.claimed_at).getTime());

      let currentDay = 0;
      if (streakRewards.length > 0) {
        const lastReward = streakRewards[0];
        if (isYesterday(lastReward.claimed_at)) {
          currentDay = (lastReward.day % 7);
        }
      }
      const nextDay = currentDay + 1;
      const xpReward = DAILY_REWARD_XP[nextDay - 1] || 10;

      const newReward: DailyReward = {
        id: generateId(),
        user_id: state.user.id,
        day: nextDay,
        xp_reward: xpReward,
        claimed_at: new Date().toISOString(),
      };

      const newXP = state.user.xp + xpReward;
      const newLevel = getLevelFromXP(newXP);

      return {
        ...state,
        dailyRewards: [...state.dailyRewards, newReward],
        user: { ...state.user, xp: newXP, level: newLevel },
      };
    }

    case 'EARN_ACHIEVEMENT': {
      const achievementId = action.payload;
      const already = state.userAchievements.find(
        ua => ua.achievement_id === achievementId && ua.user_id === state.user.id
      );
      if (already) return state;

      const achievement = state.achievements.find(a => a.id === achievementId);
      if (!achievement) return state;

      const newUA: UserAchievement = {
        id: generateId(),
        user_id: state.user.id,
        achievement_id: achievementId,
        earned_at: new Date().toISOString(),
      };

      const newXP = state.user.xp + achievement.xp_reward;
      const newLevel = getLevelFromXP(newXP);

      return {
        ...state,
        userAchievements: [...state.userAchievements, newUA],
        user: { ...state.user, xp: newXP, level: newLevel },
      };
    }

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case 'DISMISS_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };

    case 'UPDATE_STREAK': {
      const { last_login, streak } = state.user;
      let newStreak = streak;
      if (isToday(last_login)) {
        newStreak = streak;
      } else if (isYesterday(last_login)) {
        newStreak = streak + 1;
      } else {
        newStreak = 1;
      }
      return {
        ...state,
        user: { ...state.user, streak: newStreak, last_login: new Date().toISOString() },
      };
    }

    case 'LOAD_STATE':
      return { ...state, ...action.payload };

    // Admin actions
    case 'ADMIN_ADD_MODULE':
      return { ...state, modules: [...state.modules, action.payload] };

    case 'ADMIN_UPDATE_MODULE':
      return {
        ...state,
        modules: state.modules.map(m => m.id === action.payload.id ? action.payload : m),
      };

    case 'ADMIN_DELETE_MODULE':
      return {
        ...state,
        modules: state.modules.filter(m => m.id !== action.payload),
        lessons: state.lessons.filter(l => l.module_id !== action.payload),
      };

    case 'ADMIN_ADD_LESSON':
      return { ...state, lessons: [...state.lessons, action.payload] };

    case 'ADMIN_UPDATE_LESSON':
      return {
        ...state,
        lessons: state.lessons.map(l => l.id === action.payload.id ? action.payload : l),
      };

    case 'ADMIN_DELETE_LESSON':
      return {
        ...state,
        lessons: state.lessons.filter(l => l.id !== action.payload),
      };

    case 'ADMIN_GRANT_XP': {
      const { userId, amount } = action.payload;
      if (userId === state.user.id) {
        const newXP = Math.max(0, state.user.xp + amount);
        return { ...state, user: { ...state.user, xp: newXP, level: getLevelFromXP(newXP) } };
      }
      return {
        ...state,
        leaderboardUsers: state.leaderboardUsers.map(u =>
          u.id === userId
            ? { ...u, xp: Math.max(0, u.xp + amount), level: getLevelFromXP(Math.max(0, u.xp + amount)) }
            : u
        ),
      };
    }

    case 'ADMIN_BAN_USER':
      return {
        ...state,
        leaderboardUsers: state.leaderboardUsers.map(u =>
          u.id === action.payload ? { ...u, is_banned: !u.is_banned } : u
        ),
      };

    case 'ADMIN_RESET_LEADERBOARD':
      // In a real app, this would reset weekly/monthly XP tracking
      return state;

    default:
      return state;
  }
}

// ===== Context =====
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Derived helpers
  getModuleProgress: (moduleId: string) => number;
  getLessonStatus: (lessonId: string) => 'not_started' | 'in_progress' | 'completed';
  getCompletedLessonsCount: () => number;
  getCompletedModulesCount: () => number;
  hasClaimedToday: () => boolean;
  getCurrentStreak: () => number;
  getDailyRewardDay: () => number;
  checkAndGrantAchievements: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// ===== Provider =====
// Helper to get active storage key based on Telegram user ID
const getStorageKey = (): string => {
  const tg = window.Telegram?.WebApp;
  const tgUserId = tg?.initDataUnsafe?.user?.id?.toString();
  return tgUserId ? `academy_hub_state_tg_${tgUserId}` : 'academy_hub_state_v3';
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (initial) => {
    try {
      const tg = window.Telegram?.WebApp;
      const tgUserId = tg?.initDataUnsafe?.user?.id?.toString();
      const actualKey = tgUserId ? `academy_hub_state_tg_${tgUserId}` : 'academy_hub_state_v3';
      
      const saved = localStorage.getItem(actualKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initial,
          user: parsed.user || initial.user,
          lessonProgress: parsed.lessonProgress || [],
          userAchievements: parsed.userAchievements || [],
          dailyRewards: parsed.dailyRewards || [],
          modules: parsed.modules || initial.modules,
          lessons: parsed.lessons || initial.lessons,
        };
      } else if (tgUserId) {
        // Initialize new Telegram user session
        return {
          ...initial,
          user: {
            ...initial.user,
            id: tgUserId,
            telegram_id: tgUserId,
            first_name: tg?.initDataUnsafe?.user?.first_name || 'Trader',
            username: tg?.initDataUnsafe?.user?.username || 'telegram_user',
          }
        };
      }
    } catch {
      // ignore
    }
    return initial;
  });

  // Persist to localStorage
  useEffect(() => {
    const actualKey = getStorageKey();
    const toSave = {
      user: state.user,
      lessonProgress: state.lessonProgress,
      userAchievements: state.userAchievements,
      dailyRewards: state.dailyRewards,
      modules: state.modules,
      lessons: state.lessons,
    };
    localStorage.setItem(actualKey, JSON.stringify(toSave));
  }, [state.user, state.lessonProgress, state.userAchievements, state.dailyRewards, state.modules, state.lessons]);

  // Update streak on mount
  useEffect(() => {
    dispatch({ type: 'UPDATE_STREAK' });
  }, []);

  // Sync Telegram user and check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      const tg = window.Telegram?.WebApp;
      if (!tg?.initDataUnsafe?.user) return;

      const telegramId = tg.initDataUnsafe.user.id.toString();
      const GROUP_CHAT_ID = '-1003872191165'; // Academy group chat ID

      // Create updated user with telegram details
      const updatedUser = {
        ...state.user,
        id: telegramId,
        telegram_id: telegramId,
        first_name: tg.initDataUnsafe.user.first_name,
        username: tg.initDataUnsafe.user.username || 'telegram_user',
      };

      // Set user immediately
      dispatch({ type: 'SET_USER', payload: updatedUser });

      try {
        const response = await fetch('/api/check-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            telegramId,
            groupId: GROUP_CHAT_ID,
            initData: tg.initData,
          }),
        });

        const data = await response.json();
        if (data && typeof data.isAdmin === 'boolean') {
          dispatch({
            type: 'SET_USER',
            payload: {
              ...updatedUser,
              is_admin: data.isAdmin,
            },
          });
        }
      } catch (err) {
        console.error('Admin verification check failed:', err);
      }
    };

    checkAdminStatus();
  }, []);

  // Helpers
  const getModuleProgress = (moduleId: string): number => {
    const moduleLessons = state.lessons.filter((l: Lesson) => l.module_id === moduleId);
    if (moduleLessons.length === 0) return 0;
    const completed = state.lessonProgress.filter(
      (p: LessonProgress) => p.status === 'completed' && moduleLessons.some((ml: Lesson) => ml.id === p.lesson_id)
    );
    return Math.round((completed.length / moduleLessons.length) * 100);
  };

  const getLessonStatus = (lessonId: string): 'not_started' | 'in_progress' | 'completed' => {
    const progress = state.lessonProgress.find(
      (p: LessonProgress) => p.lesson_id === lessonId && p.user_id === state.user.id
    );
    return progress?.status || 'not_started';
  };

  const getCompletedLessonsCount = (): number => {
    return state.lessonProgress.filter(
      (p: LessonProgress) => p.status === 'completed' && p.user_id === state.user.id
    ).length;
  };

  const getCompletedModulesCount = (): number => {
    let count = 0;
    for (const mod of state.modules) {
      if (getModuleProgress(mod.id) === 100) count++;
    }
    return count;
  };

  const hasClaimedToday = (): boolean => {
    return state.dailyRewards.some(
      (r: DailyReward) => isToday(r.claimed_at)
    );
  };

  const getCurrentStreak = (): number => {
    return state.user.streak;
  };

  const getDailyRewardDay = (): number => {
    const rewards = [...state.dailyRewards]
      .sort((a: DailyReward, b: DailyReward) => new Date(b.claimed_at).getTime() - new Date(a.claimed_at).getTime());

    if (rewards.length === 0) return 0;
    const last = rewards[0];
    if (isToday(last.claimed_at) || isYesterday(last.claimed_at)) {
      return last.day;
    }
    return 0;
  };

  const checkAndGrantAchievements = () => {
    const completedLessons = getCompletedLessonsCount();
    const completedModules = getCompletedModulesCount();
    const streak = getCurrentStreak();
    const xp = state.user.xp;

    for (const achievement of state.achievements) {
      const alreadyEarned = state.userAchievements.some(
        (ua: UserAchievement) => ua.achievement_id === achievement.id && ua.user_id === state.user.id
      );
      if (alreadyEarned) continue;

      let earned = false;
      switch (achievement.condition_type) {
        case 'lessons_completed':
          earned = completedLessons >= achievement.condition_value;
          break;
        case 'modules_completed':
          earned = completedModules >= achievement.condition_value;
          break;
        case 'streak_days':
          earned = streak >= achievement.condition_value;
          break;
        case 'xp_earned':
          earned = xp >= achievement.condition_value;
          break;
      }

      if (earned) {
        dispatch({ type: 'EARN_ACHIEVEMENT', payload: achievement.id });
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: generateId(),
            type: 'achievement',
            message: `Achievement unlocked: ${achievement.name}!`,
            value: achievement.xp_reward,
            timestamp: Date.now(),
          },
        });
      }
    }
  };

  const value: AppContextValue = {
    state,
    dispatch,
    getModuleProgress,
    getLessonStatus,
    getCompletedLessonsCount,
    getCompletedModulesCount,
    hasClaimedToday,
    getCurrentStreak,
    getDailyRewardDay,
    checkAndGrantAchievements,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

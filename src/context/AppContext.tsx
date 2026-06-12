import { createContext, useContext, useReducer, useEffect, useRef, type ReactNode } from 'react';
import type { User, Module, Lesson, LessonProgress, AppNotification } from '../types';
import { MOCK_USER, MOCK_MODULES, MOCK_LESSONS, MOCK_LEADERBOARD_USERS } from '../data/mockData';
import { generateId, isToday, isYesterday } from '../utils/helpers';
import { supabase } from '../services/supabase';

// ===== State =====
interface AppState {
  user: User;
  modules: Module[];
  lessons: Lesson[];
  lessonProgress: LessonProgress[];
  leaderboardUsers: User[];
  notifications: AppNotification[];
  isLoading: boolean;
  isMember: boolean;
  isCheckingMembership: boolean;
}

// ===== Actions =====
type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'COMPLETE_LESSON'; payload: { lessonId: string } }
  | { type: 'ADD_NOTIFICATION'; payload: AppNotification }
  | { type: 'DISMISS_NOTIFICATION'; payload: string }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> }
  // Admin actions
  | { type: 'ADMIN_ADD_MODULE'; payload: Module }
  | { type: 'ADMIN_UPDATE_MODULE'; payload: Module }
  | { type: 'ADMIN_DELETE_MODULE'; payload: string }
  | { type: 'ADMIN_ADD_LESSON'; payload: Lesson }
  | { type: 'ADMIN_UPDATE_LESSON'; payload: Lesson }
  | { type: 'ADMIN_DELETE_LESSON'; payload: string }
  | { type: 'ADMIN_BAN_USER'; payload: string };

// ===== Initial State =====
const initialState: AppState = {
  user: MOCK_USER,
  modules: MOCK_MODULES,
  lessons: MOCK_LESSONS,
  lessonProgress: [],
  leaderboardUsers: MOCK_LEADERBOARD_USERS,
  notifications: [],
  isLoading: false,
  isMember: true,
  isCheckingMembership: false,
};

// ===== Reducer =====
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {

    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'COMPLETE_LESSON': {
      const { lessonId } = action.payload;
      const existing = state.lessonProgress.find(
        p => p.lesson_id === lessonId && p.user_id === state.user.id
      );
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

      return { ...state, lessonProgress: updatedProgress };
    }

    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };

    case 'DISMISS_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };

    case 'LOAD_STATE':
      return { ...state, ...action.payload };

    case 'ADMIN_ADD_MODULE':
      return { ...state, modules: [...state.modules, action.payload] };

    case 'ADMIN_UPDATE_MODULE':
      return { ...state, modules: state.modules.map(m => m.id === action.payload.id ? action.payload : m) };

    case 'ADMIN_DELETE_MODULE':
      return {
        ...state,
        modules: state.modules.filter(m => m.id !== action.payload),
        lessons: state.lessons.filter(l => l.module_id !== action.payload),
      };

    case 'ADMIN_ADD_LESSON':
      return { ...state, lessons: [...state.lessons, action.payload] };

    case 'ADMIN_UPDATE_LESSON':
      return { ...state, lessons: state.lessons.map(l => l.id === action.payload.id ? action.payload : l) };

    case 'ADMIN_DELETE_LESSON':
      return { ...state, lessons: state.lessons.filter(l => l.id !== action.payload) };

    case 'ADMIN_BAN_USER':
      return {
        ...state,
        leaderboardUsers: state.leaderboardUsers.map(u =>
          u.id === action.payload ? { ...u, is_banned: !u.is_banned } : u
        ),
      };

    default:
      return state;
  }
}

// ===== Context =====
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  getModuleProgress: (moduleId: string) => number;
  getLessonStatus: (lessonId: string) => 'not_started' | 'in_progress' | 'completed';
  getCompletedLessonsCount: () => number;
  getCompletedModulesCount: () => number;
}

const AppContext = createContext<AppContextValue | null>(null);

// ===== Storage key =====
const getStorageKey = (): string => {
  const tg = window.Telegram?.WebApp;
  const tgUserId = tg?.initDataUnsafe?.user?.id?.toString();
  return tgUserId ? `academy_hub_v5_${tgUserId}` : 'academy_hub_v5';
};

// ===== Provider =====
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (initial) => {
    const tg = window.Telegram?.WebApp;
    const hasInitData = !!tg?.initData;
    let result = { ...initial };

    try {
      const tgUserId = tg?.initDataUnsafe?.user?.id?.toString();
      const key = tgUserId ? `academy_hub_v5_${tgUserId}` : 'academy_hub_v5';
      const saved = localStorage.getItem(key);

      if (saved) {
        const parsed = JSON.parse(saved);
        result = {
          ...initial,
          user: parsed.user || initial.user,
          lessonProgress: parsed.lessonProgress || [],
          modules: parsed.modules || initial.modules,
          lessons: parsed.lessons || initial.lessons,
        };
      } else if (tgUserId) {
        result = {
          ...initial,
          user: {
            ...initial.user,
            id: tgUserId,
            telegram_id: tgUserId,
            first_name: tg?.initDataUnsafe?.user?.first_name || 'Trader',
            username: tg?.initDataUnsafe?.user?.username || 'telegram_user',
          },
        };
      }
    } catch { /* ignore */ }

    return {
      ...result,
      isMember: !hasInitData,
      isCheckingMembership: hasInitData,
    };
  });

  const isLoadedRef = useRef(false);
  const persistedProgressIds = useRef<Set<string>>(new Set());
  const lastSavedUser = useRef<{ last_login: string; is_admin: boolean } | null>(null);
  const lastSavedLeaderboardUsers = useRef<User[] | null>(null);

  // Persist to localStorage
  useEffect(() => {
    const key = getStorageKey();
    localStorage.setItem(key, JSON.stringify({
      user: state.user,
      lessonProgress: state.lessonProgress,
      modules: state.modules,
      lessons: state.lessons,
    }));
  }, [state.user, state.lessonProgress, state.modules, state.lessons]);

  // Bootstrap from Supabase
  useEffect(() => {
    const bootstrap = async () => {
      const tg = window.Telegram?.WebApp;
      let telegramId = '123456789';
      let firstName = 'Trader';
      let username = 'trader_user';

      if (tg?.initDataUnsafe?.user) {
        telegramId = tg.initDataUnsafe.user.id.toString();
        firstName = tg.initDataUnsafe.user.first_name;
        username = tg.initDataUnsafe.user.username || 'telegram_user';
      }

      const GROUP_CHAT_ID = '-1003872191165';

      try {
        let isAdmin = false;
        let isMember = true;

        if (tg?.initData) {
          try {
            const res = await fetch('/api/check-admin', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ telegramId, groupId: GROUP_CHAT_ID, initData: tg.initData }),
            });
            const data = await res.json();
            isAdmin = data?.isAdmin || false;
            isMember = data?.isMember ?? true;
          } catch (err) {
            console.error('Membership check failed:', err);
          }
        }

        if (!isMember) {
          dispatch({ type: 'LOAD_STATE', payload: { isMember: false, isCheckingMembership: false } });
          isLoadedRef.current = true;
          return;
        }

        // Upsert user in Supabase (no xp/level/streak fields)
        let dbUser = null;
        const { data: existingUsers, error: fetchErr } = await supabase
          .from('users')
          .select('*')
          .eq('telegram_id', telegramId);

        if (fetchErr) throw fetchErr;

        if (existingUsers && existingUsers.length > 0) {
          dbUser = existingUsers[0];
          if (dbUser.is_admin !== isAdmin) {
            const { data: updated } = await supabase
              .from('users')
              .update({ is_admin: isAdmin })
              .eq('id', dbUser.id)
              .select();
            if (updated?.length) dbUser = updated[0];
          }
        } else {
          const { data: inserted, error: insertErr } = await supabase
            .from('users')
            .insert({
              telegram_id: telegramId,
              first_name: firstName,
              username,
              is_admin: isAdmin,
              last_login: new Date().toISOString(),
            })
            .select();
          if (insertErr) throw insertErr;
          if (inserted?.length) dbUser = inserted[0];
        }

        if (!dbUser) throw new Error('Failed to resolve user');

        const [progressRes, usersRes] = await Promise.all([
          supabase.from('lesson_progress').select('*').eq('user_id', dbUser.id),
          supabase.from('users').select('*'),
        ]);

        const lessonProgress = progressRes.data || [];
        const allUsers = usersRes.data || [];
        const leaderboardUsers = allUsers
          .filter(u => u.id !== dbUser.id)
          .map(u => ({
            id: u.id,
            telegram_id: u.telegram_id,
            username: u.username || 'telegram_user',
            first_name: u.first_name || 'Trader',
            avatar: u.avatar || '',
            last_login: u.last_login || new Date().toISOString(),
            created_at: u.created_at || new Date().toISOString(),
            is_admin: u.is_admin || false,
            is_banned: u.is_banned || false,
          }));

        lessonProgress.forEach(p => persistedProgressIds.current.add(p.id));
        lastSavedUser.current = { last_login: dbUser.last_login, is_admin: dbUser.is_admin };
        lastSavedLeaderboardUsers.current = leaderboardUsers.map(u => ({ ...u }));

        dispatch({
          type: 'LOAD_STATE',
          payload: {
            user: {
              id: dbUser.id,
              telegram_id: dbUser.telegram_id,
              first_name: dbUser.first_name,
              username: dbUser.username,
              avatar: dbUser.avatar || '',
              last_login: dbUser.last_login,
              created_at: dbUser.created_at,
              is_admin: dbUser.is_admin,
              is_banned: dbUser.is_banned,
            },
            leaderboardUsers,
            isMember: true,
            isCheckingMembership: false,
            lessonProgress: lessonProgress.map(p => ({
              id: p.id,
              user_id: p.user_id,
              lesson_id: p.lesson_id,
              status: p.status,
              completed_at: p.completed_at,
            })),
          },
        });

        isLoadedRef.current = true;
      } catch (err) {
        console.error('Supabase bootstrap failed:', err);
        dispatch({ type: 'LOAD_STATE', payload: { isCheckingMembership: false } });
        isLoadedRef.current = true;
      }
    };

    bootstrap();
  }, []);

  // Sync changes back to Supabase
  useEffect(() => {
    if (!isLoadedRef.current) return;

    const sync = async () => {
      // Sync new lesson progress
      const newProgress = state.lessonProgress.filter(p => !persistedProgressIds.current.has(p.id));
      for (const progress of newProgress) {
        try {
          const { error } = await supabase.from('lesson_progress').insert({
            id: progress.id,
            user_id: state.user.id,
            lesson_id: progress.lesson_id,
            status: progress.status,
            completed_at: progress.completed_at,
          });
          if (!error) persistedProgressIds.current.add(progress.id);
        } catch (err) {
          console.error('Failed to sync progress:', err);
        }
      }

      // Sync user last_login
      const u = state.user;
      const last = lastSavedUser.current;
      if (last && u.last_login !== last.last_login) {
        try {
          await supabase.from('users').update({ last_login: u.last_login }).eq('id', u.id);
          lastSavedUser.current = { last_login: u.last_login, is_admin: u.is_admin };
        } catch (err) {
          console.error('Failed to sync user:', err);
        }
      }

      // Sync ban status changes from admin panel
      if (lastSavedLeaderboardUsers.current) {
        for (const user of state.leaderboardUsers) {
          const last = lastSavedLeaderboardUsers.current.find(lu => lu.id === user.id);
          if (last && user.is_banned !== last.is_banned) {
            try {
              await supabase.from('users').update({ is_banned: user.is_banned }).eq('id', user.id);
            } catch (err) {
              console.error('Failed to sync ban status:', err);
            }
          }
        }
        lastSavedLeaderboardUsers.current = state.leaderboardUsers.map(u => ({ ...u }));
      }
    };

    sync();
  }, [state.user, state.lessonProgress, state.leaderboardUsers]);

  // ===== Helpers =====
  const getModuleProgress = (moduleId: string): number => {
    const moduleLessons = state.lessons.filter(l => l.module_id === moduleId);
    if (!moduleLessons.length) return 0;
    const completed = state.lessonProgress.filter(
      p => p.status === 'completed' && moduleLessons.some(ml => ml.id === p.lesson_id)
    );
    return Math.round((completed.length / moduleLessons.length) * 100);
  };

  const getLessonStatus = (lessonId: string): 'not_started' | 'in_progress' | 'completed' => {
    const progress = state.lessonProgress.find(
      p => p.lesson_id === lessonId && p.user_id === state.user.id
    );
    return progress?.status || 'not_started';
  };

  const getCompletedLessonsCount = (): number =>
    state.lessonProgress.filter(p => p.status === 'completed' && p.user_id === state.user.id).length;

  const getCompletedModulesCount = (): number => {
    let count = 0;
    for (const mod of state.modules) {
      if (getModuleProgress(mod.id) === 100) count++;
    }
    return count;
  };

  return (
    <AppContext.Provider value={{ state, dispatch, getModuleProgress, getLessonStatus, getCompletedLessonsCount, getCompletedModulesCount }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

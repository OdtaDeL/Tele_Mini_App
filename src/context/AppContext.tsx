import { createContext, useContext, useReducer, useEffect, useRef, type ReactNode } from 'react';
import type { User, Module, Lesson, LessonProgress, AppNotification } from '../types';
import { generateId } from '../utils/helpers';
import * as dbService from '../services/dbService';

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
  | { type: 'UPDATE_LESSON_PROGRESS'; payload: { lessonId: string; lastPosition: number } }
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

const defaultUser: User = {
  id: '',
  telegram_id: '',
  username: '',
  first_name: 'Guest',
  avatar: '',
  last_login: new Date().toISOString(),
  created_at: new Date().toISOString(),
  is_admin: false,
  is_banned: false,
};

// ===== Initial State =====
const initialState: AppState = {
  user: defaultUser,
  modules: [],
  lessons: [],
  lessonProgress: [],
  leaderboardUsers: [],
  notifications: [],
  isLoading: true,
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
        id: existing ? existing.id : generateId(),
        user_id: state.user.id,
        lesson_id: lessonId,
        status: 'completed',
        completed_at: new Date().toISOString(),
        last_position: existing?.last_position || 0,
      };

      const updatedProgress = existing
        ? state.lessonProgress.map(p => p.id === existing.id ? newProgress : p)
        : [...state.lessonProgress, newProgress];

      return { ...state, lessonProgress: updatedProgress };
    }

    case 'UPDATE_LESSON_PROGRESS': {
      const { lessonId, lastPosition } = action.payload;
      const existing = state.lessonProgress.find(
        p => p.lesson_id === lessonId && p.user_id === state.user.id
      );
      
      // Don't trigger state update if position hasn't changed meaningfully
      if (existing && existing.last_position === lastPosition) return state;

      const newProgress: LessonProgress = {
        id: existing ? existing.id : generateId(),
        user_id: state.user.id,
        lesson_id: lessonId,
        status: existing ? existing.status : 'in_progress',
        completed_at: existing ? existing.completed_at : undefined,
        last_position: lastPosition,
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
  const lastSyncedPositions = useRef<Map<string, number>>(new Map());
  const lastSavedUser = useRef<{ last_login: string; is_admin: boolean } | null>(null);
  const lastSavedLeaderboardUsers = useRef<User[] | null>(null);

  // Track last-saved snapshot of modules and lessons for diffing
  const lastSavedModuleIds = useRef<Set<string>>(new Set());
  const lastSavedLessonIds = useRef<Set<string>>(new Set());

  // Persist user progress to localStorage
  useEffect(() => {
    const key = getStorageKey();
    localStorage.setItem(key, JSON.stringify({
      user: state.user,
      lessonProgress: state.lessonProgress,
    }));
  }, [state.user, state.lessonProgress]);

  // ===== Bootstrap from Supabase =====
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

        // ── Upsert current user (via Service Layer) ──
        let dbUser = await dbService.fetchUser(telegramId);

        if (dbUser) {
          if (dbUser.is_admin !== isAdmin) {
            dbUser = await dbService.updateUserAdmin(dbUser.id, isAdmin);
          }
        } else {
          dbUser = await dbService.createUser(telegramId, firstName, username, isAdmin);
        }

        if (!dbUser) throw new Error('Failed to resolve user');

        // ── Fetch all data in parallel (via Service Layer) ──
        const [progressRes, usersRes, modulesRes, lessonsRes] = await Promise.all([
          dbService.fetchLessonProgress(dbUser.id),
          dbService.fetchLeaderboardUsers(),
          dbService.fetchModules(),
          dbService.fetchLessons(),
        ]);

        const lessonProgress = progressRes || [];
        const allUsers = usersRes || [];

        // ── Resolve modules from Supabase ──
        const dbModules: Module[] = modulesRes.map(m => ({
          id: m.id,
          title: m.title,
          description: m.description || '',
          icon: m.icon || '📖',
          order: m.order || 1,
          lessons_count: 0,
        }));

        // ── Resolve lessons from Supabase ──
        const dbLessons: Lesson[] = lessonsRes.map(l => ({
          id: l.id,
          module_id: l.module_id,
          title: l.title,
          description: l.description || '',
          content: l.content || '',
          thumbnail: l.thumbnail || '',
          order: l.order || 1,
          video_url: l.video_url || undefined,
          pdf_url: undefined,
        }));

        // ── Track persisted IDs and positions for diffing ──
        lessonProgress.forEach(p => {
          persistedProgressIds.current.add(p.id);
          if (p.last_position !== undefined) {
            lastSyncedPositions.current.set(p.id, p.last_position);
          }
        });
        dbModules.forEach(m => lastSavedModuleIds.current.add(m.id));
        dbLessons.forEach(l => lastSavedLessonIds.current.add(l.id));
        lastSavedUser.current = { last_login: dbUser.last_login, is_admin: dbUser.is_admin };

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
            modules: dbModules,
            lessons: dbLessons,
            leaderboardUsers,
            isMember: true,
            isCheckingMembership: false,
            isLoading: false,
            lessonProgress: lessonProgress.map(p => ({
              id: p.id,
              user_id: p.user_id,
              lesson_id: p.lesson_id,
              status: p.status,
              completed_at: p.completed_at,
              last_position: p.last_position || 0,
            })),
          },
        });

        isLoadedRef.current = true;
      } catch (err) {
        console.error('Supabase bootstrap failed:', err);
        dispatch({ type: 'LOAD_STATE', payload: { isCheckingMembership: false, isLoading: false } });
        isLoadedRef.current = true;
      }
    };

    bootstrap();
  }, []);

  // ===== Sync user + progress + ban status =====
  useEffect(() => {
    if (!isLoadedRef.current) return;

    const sync = async () => {
      // Sync new/updated lesson progress
      const newProgress = state.lessonProgress.filter(p => {
        const hasId = persistedProgressIds.current.has(p.id);
        const lastPos = lastSyncedPositions.current.get(p.id);
        // Sync if ID is not persisted yet, or if last_position changed
        return !hasId || p.last_position !== lastPos;
      });

      for (const progress of newProgress) {
        try {
          await dbService.syncLessonProgress(state.user.id, progress);
          persistedProgressIds.current.add(progress.id);
          if (progress.last_position !== undefined) {
            lastSyncedPositions.current.set(progress.id, progress.last_position);
          }
        } catch (err) {
          console.error('Failed to sync progress:', err);
        }
      }

      // Sync user last_login
      const u = state.user;
      const last = lastSavedUser.current;
      if (last && u.last_login !== last.last_login) {
        try {
          await dbService.syncUserLastLogin(u.id, u.last_login);
          lastSavedUser.current = { last_login: u.last_login, is_admin: u.is_admin };
        } catch (err) {
          console.error('Failed to sync user:', err);
        }
      }

      // Sync ban changes
      if (lastSavedLeaderboardUsers.current) {
        for (const user of state.leaderboardUsers) {
          const prev = lastSavedLeaderboardUsers.current.find(lu => lu.id === user.id);
          if (prev && user.is_banned !== prev.is_banned) {
            try {
              await dbService.syncUserBanned(user.id, user.is_banned);
            } catch (err) {
              console.error('Failed to sync ban:', err);
            }
          }
        }
        lastSavedLeaderboardUsers.current = state.leaderboardUsers.map(u => ({ ...u }));
      }
    };

    sync();
  }, [state.user, state.lessonProgress, state.leaderboardUsers]);

  // ===== Sync admin changes to modules & lessons → Supabase =====
  useEffect(() => {
    if (!isLoadedRef.current) return;

    const syncContent = async () => {
      const currentModuleIds = new Set(state.modules.map(m => m.id));
      const currentLessonIds = new Set(state.lessons.map(l => l.id));

      // ── Upsert new/updated modules ──
      for (const mod of state.modules) {
        try {
          await dbService.upsertModule(mod);
          lastSavedModuleIds.current.add(mod.id);
        } catch (err) {
          console.error('Failed to upsert module:', err);
        }
      }

      // ── Delete removed modules ──
      for (const savedId of lastSavedModuleIds.current) {
        if (!currentModuleIds.has(savedId)) {
          try {
            await dbService.deleteModule(savedId);
            lastSavedModuleIds.current.delete(savedId);
          } catch (err) {
            console.error('Failed to delete module:', err);
          }
        }
      }

      // ── Upsert new/updated lessons ──
      for (const lesson of state.lessons) {
        try {
          await dbService.upsertLesson(lesson);
          lastSavedLessonIds.current.add(lesson.id);
        } catch (err) {
          console.error('Failed to upsert lesson:', err);
        }
      }

      // ── Delete removed lessons ──
      for (const savedId of lastSavedLessonIds.current) {
        if (!currentLessonIds.has(savedId)) {
          try {
            await dbService.deleteLesson(savedId);
            lastSavedLessonIds.current.delete(savedId);
          } catch (err) {
            console.error('Failed to delete lesson:', err);
          }
        }
      }
    };

    syncContent();
  }, [state.modules, state.lessons]);

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

import type { Module, Lesson, Achievement, User } from '../types';

export const MOCK_USER: User = {
  id: 'user_001',
  telegram_id: '123456789',
  username: 'trader_alex',
  first_name: 'Alex',
  avatar: '',
  level: 1,
  xp: 0,
  streak: 1,
  last_login: new Date().toISOString(),
  created_at: new Date().toISOString(),
  is_admin: false,
  is_banned: false,
};

export const MOCK_MODULES: Module[] = [
  {
    id: 'mod_001',
    title: 'Supply & Demand method',
    description: 'Master the institutional Supply & Demand method to improve your entries and exits.',
    icon: '📈',
    order: 1,
    lessons_count: 4,
  },
];

export const MOCK_LESSONS: Lesson[] = [
  {
    id: 'les_001',
    module_id: 'mod_001',
    title: 'Supply & Demand Lesson 1',
    description: 'Video lesson 1 content',
    content: `
# Supply & Demand Lesson 1

This is the content for Lesson 1. You can edit this text later.
    `,
    thumbnail: '',
    xp_reward: 25,
    order: 1,
    video_url: 'https://player.mediadelivery.net/embed/681508/9b0dec52-756b-402d-b66e-e800cfd09c87?autoplay=true&loop=false&muted=true&preload=true&responsive=true',
  },
  {
    id: 'les_002',
    module_id: 'mod_001',
    title: 'Supply & Demand Lesson 2',
    description: 'Video lesson 2 content',
    content: `
# Supply & Demand Lesson 2

This is the content for Lesson 2. You can edit this text later.
    `,
    thumbnail: '',
    xp_reward: 25,
    order: 2,
    video_url: 'https://player.mediadelivery.net/embed/681508/81bec5ce-43a3-4b42-b3b4-897746dfe490?autoplay=true&loop=false&muted=true&preload=true&responsive=true',
  },
  {
    id: 'les_003',
    module_id: 'mod_001',
    title: 'Supply & Demand Lesson 3',
    description: 'Video lesson 3 content',
    content: `
# Supply & Demand Lesson 3

This is the content for Lesson 3. You can edit this text later.
    `,
    thumbnail: '',
    xp_reward: 25,
    order: 3,
    video_url: 'https://player.mediadelivery.net/embed/681508/8e6b3a47-c021-451f-8f75-ee13aea1805d?autoplay=true&loop=false&muted=true&preload=true&responsive=true',
  },
  {
    id: 'les_004',
    module_id: 'mod_001',
    title: 'Supply & Demand Lesson 4',
    description: 'Video lesson 4 content',
    content: `
# Supply & Demand Lesson 4

This is the content for Lesson 4. You can edit this text later.
    `,
    thumbnail: '',
    xp_reward: 25,
    order: 4,
    video_url: 'https://player.mediadelivery.net/embed/681508/d0638842-616c-4550-8df5-8f53b0835c7d?autoplay=true&loop=false&muted=true&preload=true&responsive=true',
  },
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_001',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    xp_reward: 50,
    condition_type: 'lessons_completed',
    condition_value: 1,
  },
  {
    id: 'ach_002',
    name: 'Knowledge Seeker',
    description: 'Complete all 4 lessons',
    icon: '📖',
    xp_reward: 75,
    condition_type: 'lessons_completed',
    condition_value: 4,
  },
  {
    id: 'ach_003',
    name: 'Dedicated Student',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    xp_reward: 100,
    condition_type: 'streak_days',
    condition_value: 7,
  },
  {
    id: 'ach_004',
    name: 'Module Master',
    description: 'Complete an entire module',
    icon: '🏅',
    xp_reward: 100,
    condition_type: 'modules_completed',
    condition_value: 1,
  },
  {
    id: 'ach_005',
    name: 'Scholar',
    description: 'Earn 500 XP',
    icon: '🎓',
    xp_reward: 75,
    condition_type: 'xp_earned',
    condition_value: 500,
  },
  {
    id: 'ach_006',
    name: 'Academy Elite',
    description: 'Complete all 4 lessons',
    icon: '⭐',
    xp_reward: 150,
    condition_type: 'lessons_completed',
    condition_value: 4,
  },
  {
    id: 'ach_007',
    name: 'Unstoppable',
    description: 'Maintain a 14-day streak',
    icon: '💎',
    xp_reward: 200,
    condition_type: 'streak_days',
    condition_value: 14,
  },
  {
    id: 'ach_008',
    name: 'Academy Legend',
    description: 'Complete all modules',
    icon: '👑',
    xp_reward: 500,
    condition_type: 'modules_completed',
    condition_value: 1,
  },
];

export const MOCK_LEADERBOARD_USERS: User[] = [
  { id: 'lb_001', telegram_id: '111', username: 'crypto_king', first_name: 'Marcus', avatar: '', level: 8, xp: 4200, streak: 21, last_login: new Date().toISOString(), created_at: '2025-01-01', is_admin: false, is_banned: false },
  { id: 'lb_002', telegram_id: '222', username: 'trade_queen', first_name: 'Sarah', avatar: '', level: 7, xp: 3800, streak: 15, last_login: new Date().toISOString(), created_at: '2025-01-05', is_admin: false, is_banned: false },
  { id: 'lb_003', telegram_id: '333', username: 'chart_wizard', first_name: 'Daniel', avatar: '', level: 7, xp: 3200, streak: 12, last_login: new Date().toISOString(), created_at: '2025-01-10', is_admin: false, is_banned: false },
  { id: 'lb_004', telegram_id: '444', username: 'bull_runner', first_name: 'Elena', avatar: '', level: 6, xp: 2800, streak: 9, last_login: new Date().toISOString(), created_at: '2025-02-01', is_admin: false, is_banned: false },
  { id: 'lb_005', telegram_id: '555', username: 'moon_shot', first_name: 'James', avatar: '', level: 5, xp: 1500, streak: 7, last_login: new Date().toISOString(), created_at: '2025-02-15', is_admin: false, is_banned: false },
  { id: 'lb_006', telegram_id: '666', username: 'diamond_hands', first_name: 'Lisa', avatar: '', level: 5, xp: 1200, streak: 5, last_login: new Date().toISOString(), created_at: '2025-03-01', is_admin: false, is_banned: false },
  { id: 'lb_007', telegram_id: '777', username: 'candle_reader', first_name: 'Tom', avatar: '', level: 4, xp: 800, streak: 3, last_login: new Date().toISOString(), created_at: '2025-03-10', is_admin: false, is_banned: false },
  { id: 'lb_008', telegram_id: '888', username: 'trend_follower', first_name: 'Anna', avatar: '', level: 3, xp: 400, streak: 2, last_login: new Date().toISOString(), created_at: '2025-04-01', is_admin: false, is_banned: false },
];

import type { Module, Lesson, User } from '../types';

export const MOCK_USER: User = {
  id: 'user_001',
  telegram_id: '123456789',
  username: 'trader_alex',
  first_name: 'Alex',
  avatar: '',
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

This is the content for Lesson 1. You can edit this text in the admin panel.
    `,
    thumbnail: '',
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

This is the content for Lesson 2. You can edit this text in the admin panel.
    `,
    thumbnail: '',
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

This is the content for Lesson 3. You can edit this text in the admin panel.
    `,
    thumbnail: '',
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

This is the content for Lesson 4. You can edit this text in the admin panel.
    `,
    thumbnail: '',
    order: 4,
    video_url: 'https://player.mediadelivery.net/embed/681508/d0638842-616c-4550-8df5-8f53b0835c7d?autoplay=true&loop=false&muted=true&preload=true&responsive=true',
  },
];

export const MOCK_LEADERBOARD_USERS: User[] = [
  { id: 'lb_001', telegram_id: '111', username: 'crypto_king',    first_name: 'Marcus', avatar: '', last_login: new Date().toISOString(), created_at: '2025-01-01', is_admin: false, is_banned: false },
  { id: 'lb_002', telegram_id: '222', username: 'trade_queen',    first_name: 'Sarah',  avatar: '', last_login: new Date().toISOString(), created_at: '2025-01-05', is_admin: false, is_banned: false },
  { id: 'lb_003', telegram_id: '333', username: 'chart_wizard',   first_name: 'Daniel', avatar: '', last_login: new Date().toISOString(), created_at: '2025-01-10', is_admin: false, is_banned: false },
  { id: 'lb_004', telegram_id: '444', username: 'bull_runner',    first_name: 'Elena',  avatar: '', last_login: new Date().toISOString(), created_at: '2025-02-01', is_admin: false, is_banned: false },
];

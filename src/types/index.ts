export interface User {
  id: string;
  telegram_id: string;
  username: string;
  first_name: string;
  avatar: string;
  last_login: string;
  created_at: string;
  is_admin: boolean;
  is_banned: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  lessons_count: number;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  content: string;
  thumbnail: string;
  order: number;
  video_url?: string;
  pdf_url?: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completed_at?: string;
  last_position?: number;
}

export interface AppNotification {
  id: string;
  type: 'lesson_complete';
  message: string;
  timestamp: number;
}

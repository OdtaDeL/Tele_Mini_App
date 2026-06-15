import { supabase } from './supabase';

export async function fetchUser(telegramId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', telegramId);
  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

export async function updateUserAdmin(userId: string, isAdmin: boolean) {
  const { data, error } = await supabase
    .from('users')
    .update({ is_admin: isAdmin })
    .eq('id', userId)
    .select();
  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

export async function createUser(telegramId: string, firstName: string, username: string, isAdmin: boolean) {
  const { data, error } = await supabase
    .from('users')
    .insert({
      telegram_id: telegramId,
      first_name: firstName,
      username,
      is_admin: isAdmin,
      last_login: new Date().toISOString(),
    })
    .select();
  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

export async function fetchModules() {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .order('order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function fetchLessons() {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .order('order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function fetchLessonProgress(userId: string) {
  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data || [];
}

export async function fetchLeaderboardUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*');
  if (error) throw error;
  return data || [];
}

export async function upsertModule(mod: any) {
  const { data, error } = await supabase.from('modules').upsert({
    id: mod.id,
    title: mod.title,
    description: mod.description,
    icon: mod.icon,
    order: mod.order,
  }).select();
  if (error) throw error;
  return data;
}

export async function deleteModule(moduleId: string) {
  const { error } = await supabase.from('modules').delete().eq('id', moduleId);
  if (error) throw error;
}

export async function upsertLesson(lesson: any) {
  const { data, error } = await supabase.from('lessons').upsert({
    id: lesson.id,
    module_id: lesson.module_id,
    title: lesson.title,
    description: lesson.description,
    content: lesson.content,
    thumbnail: lesson.thumbnail,
    order: lesson.order,
    video_url: lesson.video_url || null,
  }).select();
  if (error) throw error;
  return data;
}

export async function deleteLesson(lessonId: string) {
  const { error } = await supabase.from('lessons').delete().eq('id', lessonId);
  if (error) throw error;
}

export async function syncUserLastLogin(userId: string, lastLogin: string) {
  const { error } = await supabase.from('users').update({ last_login: lastLogin }).eq('id', userId);
  if (error) throw error;
}

export async function syncUserBanned(userId: string, isBanned: boolean) {
  const { error } = await supabase.from('users').update({ is_banned: isBanned }).eq('id', userId);
  if (error) throw error;
}

export async function syncLessonProgress(userId: string, progress: any) {
  // Try to insert including the last_position column
  let { error } = await supabase.from('lesson_progress').upsert({
    id: progress.id,
    user_id: userId,
    lesson_id: progress.lesson_id,
    status: progress.status,
    completed_at: progress.completed_at,
    last_position: progress.last_position || 0,
  });

  // Fallback gracefully if the column doesn't exist in Supabase yet
  if (error && error.message.includes('column "last_position"')) {
    const { error: fallbackError } = await supabase.from('lesson_progress').upsert({
      id: progress.id,
      user_id: userId,
      lesson_id: progress.lesson_id,
      status: progress.status,
      completed_at: progress.completed_at,
    });
    if (fallbackError) throw fallbackError;
  } else if (error) {
    throw error;
  }
}

export async function uploadFile(bucketName: string, file: File, folder?: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const randomName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
  const filePath = folder ? `${folder}/${randomName}` : randomName;
  
  const { error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return publicUrl;
}

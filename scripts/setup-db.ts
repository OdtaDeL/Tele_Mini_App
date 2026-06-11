import pg from 'pg';
import { MOCK_MODULES, MOCK_LESSONS, MOCK_ACHIEVEMENTS } from '../src/data/mockData';

// connection string from arguments or env
const connectionString = process.argv[2] || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Error: Please provide your PostgreSQL connection string.');
  console.error('Usage: npx tsx scripts/setup-db.ts "postgresql://postgres:[PASSWORD]@db.yvtqofadqyqlbfdvdbzh.supabase.co:5432/postgres"');
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
});

async function main() {
  console.log('Connecting to database...');
  await client.connect();
  console.log('Connected successfully!');

  try {
    // 1. Drop existing tables if they exist to apply clean TEXT and UUID columns
    console.log('Dropping existing tables...');
    await client.query(`
      DROP TABLE IF EXISTS daily_rewards CASCADE;
      DROP TABLE IF EXISTS user_achievements CASCADE;
      DROP TABLE IF EXISTS lesson_progress CASCADE;
      DROP TABLE IF EXISTS achievements CASCADE;
      DROP TABLE IF EXISTS lessons CASCADE;
      DROP TABLE IF EXISTS modules CASCADE;
    `);

    // 2. Re-create tables with TEXT key types matching frontend alphanumeric IDs
    console.log('Creating tables...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        telegram_id TEXT UNIQUE NOT NULL,
        username TEXT,
        first_name TEXT,
        avatar TEXT,
        level INTEGER DEFAULT 1,
        xp INTEGER DEFAULT 0,
        streak INTEGER DEFAULT 0,
        last_login TIMESTAMPTZ DEFAULT NOW(),
        is_admin BOOLEAN DEFAULT FALSE,
        is_banned BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS modules (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        icon TEXT DEFAULT '📘',
        "order" INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS lessons (
        id TEXT PRIMARY KEY,
        module_id TEXT REFERENCES modules(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        content TEXT,
        thumbnail TEXT,
        xp_reward INTEGER DEFAULT 25,
        "order" INTEGER DEFAULT 0,
        video_url TEXT
      );

      CREATE TABLE IF NOT EXISTS lesson_progress (
        id TEXT PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        lesson_id TEXT REFERENCES lessons(id) ON DELETE CASCADE,
        status TEXT DEFAULT 'not_started',
        completed_at TIMESTAMPTZ,
        UNIQUE(user_id, lesson_id)
      );

      CREATE TABLE IF NOT EXISTS achievements (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        xp_reward INTEGER DEFAULT 50,
        condition_type TEXT,
        condition_value INTEGER
      );

      CREATE TABLE IF NOT EXISTS user_achievements (
        id TEXT PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        achievement_id TEXT REFERENCES achievements(id) ON DELETE CASCADE,
        earned_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, achievement_id)
      );

      CREATE TABLE IF NOT EXISTS daily_rewards (
        id TEXT PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        day INTEGER,
        xp_reward INTEGER,
        claimed_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 3. Disable RLS for compatibility with browser client anon queries
    console.log('Configuring Row Level Security (RLS)...');
    await client.query(`
      ALTER TABLE users DISABLE ROW LEVEL SECURITY;
      ALTER TABLE modules DISABLE ROW LEVEL SECURITY;
      ALTER TABLE lessons DISABLE ROW LEVEL SECURITY;
      ALTER TABLE lesson_progress DISABLE ROW LEVEL SECURITY;
      ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;
      ALTER TABLE user_achievements DISABLE ROW LEVEL SECURITY;
      ALTER TABLE daily_rewards DISABLE ROW LEVEL SECURITY;
    `);

    // 4. Seed Modules
    console.log('Seeding modules...');
    for (const m of MOCK_MODULES) {
      await client.query(
        'INSERT INTO modules (id, title, description, icon, "order") VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, icon = EXCLUDED.icon, "order" = EXCLUDED.order',
        [m.id, m.title, m.description, m.icon, m.order]
      );
    }

    // 5. Seed Lessons
    console.log('Seeding lessons...');
    for (const l of MOCK_LESSONS) {
      await client.query(
        'INSERT INTO lessons (id, module_id, title, description, content, thumbnail, xp_reward, "order", video_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO UPDATE SET module_id = EXCLUDED.module_id, title = EXCLUDED.title, description = EXCLUDED.description, content = EXCLUDED.content, thumbnail = EXCLUDED.thumbnail, xp_reward = EXCLUDED.xp_reward, "order" = EXCLUDED.order, video_url = EXCLUDED.video_url',
        [l.id, l.module_id, l.title, l.description, l.content, l.thumbnail || '', l.xp_reward, l.order, l.video_url || '']
      );
    }

    // 6. Seed Achievements
    console.log('Seeding achievements...');
    for (const a of MOCK_ACHIEVEMENTS) {
      await client.query(
        'INSERT INTO achievements (id, name, description, icon, xp_reward, condition_type, condition_value) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, icon = EXCLUDED.icon, xp_reward = EXCLUDED.xp_reward, condition_type = EXCLUDED.condition_type, condition_value = EXCLUDED.condition_value',
        [a.id, a.name, a.description, a.icon, a.xp_reward, a.condition_type, a.condition_value]
      );
    }

    console.log('Database successfully set up and seeded!');
  } catch (err) {
    console.error('Database setup failed:', err);
  } finally {
    await client.end();
  }
}

main();

# 🤖 Hướng Dẫn Deploy Academy Hub lên Telegram Group

> Tài liệu này hướng dẫn từng bước để gắn Academy Learning Hub vào group Telegram,
> hiển thị nút mở app (giống Blum / Hamster Kombat), và phân quyền Admin theo role trong group.

---

## 📋 Mục Lục

1. [Tạo Telegram Bot](#1-tạo-telegram-bot)
2. [Deploy Frontend lên Internet](#2-deploy-frontend-lên-internet)
3. [Gắn Mini App vào Bot](#3-gắn-mini-app-vào-bot)
4. [Thêm Bot vào Group & Hiện Nút Launch](#4-thêm-bot-vào-group--hiện-nút-launch)
5. [Phân Quyền Admin theo Role Group](#5-phân-quyền-admin-theo-role-group)
6. [Cấu hình Supabase (Backend)](#6-cấu-hình-supabase-backend)
7. [Checklist Hoàn Chỉnh](#7-checklist-hoàn-chỉnh)

---

## 1. Tạo Telegram Bot

### Bước 1: Tạo bot mới qua BotFather

1. Mở Telegram, tìm **@BotFather**
2. Gõ `/newbot`
3. Đặt tên hiển thị: `Academy Learning Hub`
4. Đặt username (phải kết thúc bằng `bot`): ví dụ `academy_hub_bot`
5. BotFather sẽ trả về **Bot Token** — lưu lại cẩn thận:
   ```
   7XXXXXXXXX:AAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

### Bước 2: Cấu hình Bot

```
/setdescription → "🎓 Academy Learning Hub - Học trading, kiếm XP, leo bảng xếp hạng!"
/setabouttext   → "Nền tảng học trading gamified ngay trong Telegram"
/setuserpic     → Upload logo Academy
```

### Bước 3: Bật inline mode (để gắn vào group)

```
/setinline → @academy_hub_bot → Bật
/setinlinefeedback → 100%
```

---

## 2. Deploy Frontend lên Internet

Mini App **bắt buộc** phải chạy trên HTTPS. Có 2 lựa chọn nhanh:

### Option A: Vercel (Khuyên dùng — Free)

```bash
# Cài Vercel CLI
npm install -g vercel

# Build và deploy từ thư mục project
cd f:\Tele_Mini_App
vercel --prod
```

Vercel sẽ trả về URL dạng: `https://academy-hub-xyz.vercel.app`

### Option B: Netlify

```bash
# Build trước
npm run build

# Kéo thả thư mục dist/ vào https://app.netlify.com/drop
```

Netlify trả về URL dạng: `https://academy-hub-xyz.netlify.app`

### Option C: Ngrok (Chỉ để Test — Tạm thời)

```bash
# Chạy dev server
npm run dev

# Mở terminal khác, tunnel ra internet
npx ngrok http 5173
```

Ngrok trả về URL dạng: `https://xxxx.ngrok-free.app`

> ⚠️ **Lưu ý:** Ngrok URL thay đổi mỗi lần restart. Chỉ dùng để test nhanh.

---

## 3. Gắn Mini App vào Bot

### Bước 1: Đăng ký Mini App với BotFather

```
/newapp → Chọn @academy_hub_bot
Tên app    : Academy Hub
Mô tả      : Học trading gamified
URL        : https://academy-hub-xyz.vercel.app
GIF preview: (upload ảnh demo)
Short name : learn
```

Short name tạo ra deep link:
```
https://t.me/academy_hub_bot/learn
```

### Bước 2: Tạo Menu Button (nút trong chat bot)

Gọi Telegram Bot API để set menu button:

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setChatMenuButton" \
  -H "Content-Type: application/json" \
  -d '{
    "menu_button": {
      "type": "web_app",
      "text": "🎓 Mở Academy",
      "web_app": {
        "url": "https://academy-hub-xyz.vercel.app"
      }
    }
  }'
```

> Sau lệnh này, khi user chat với bot sẽ thấy nút **"🎓 Mở Academy"** ở góc dưới bên phải — giống hệt Blum / Hamster Kombat.

---

## 4. Thêm Bot vào Group & Hiện Nút Launch

Đây là cách Blum và Hamster Kombat hiển thị nút **"Open App"** ngay trong group.

### Bước 1: Thêm bot vào group

1. Mở group Telegram Academy demo
2. Vào **Group Info → Add Members**
3. Tìm `@academy_hub_bot` → **Add**
4. Cấp quyền: **Post Messages** (tối thiểu)

### Bước 2: Gửi tin nhắn có nút Launch App vào group

Gọi API một lần để gửi tin nhắn ghim vào group (lấy `CHAT_ID` của group):

```bash
# Lấy Chat ID của group
curl "https://api.telegram.org/bot8935650480:AAFnDvoggMIIrEpR3Lye098fYGaM9dXxp9g/getUpdates"
# → Tìm "chat": {"id": -100XXXXXXXXXX} trong kết quả

# Gửi tin nhắn có Launch Button vào group
curl -X POST "https://api.telegram.org/bot8935650480:AAFnDvoggMIIrEpR3Lye098fYGaM9dXxp9g/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "-1003872191165",
    "text": "🎓 *Academy Learning Hub*",
    "parse_mode": "Markdown",
    "reply_markup": {
      "inline_keyboard": [[
        {
          "text": "🚀 Mở Academy",
          "web_app": {
            "url": "https://academy-hub-xyz.vercel.app"
          }
        }
      ]]
    }
  }'
```

### Bước 3: Ghim tin nhắn trong group

Sau khi tin nhắn được gửi, **ghim (pin)** nó trong group:
- Nhấn giữ tin nhắn → **Pin** → **Pin for all members**

> 🎯 **Kết quả:** Giống Blum/Hamster — Members vào group thấy tin nhắn ghim với nút **"🚀 Mở Academy"**, bấm vào mở Mini App ngay trong Telegram.

---

## 5. Phân Quyền Admin theo Role Group

### Cách hoạt động

Khi user mở Mini App, Telegram tự động truyền thông tin `initData` vào app, bao gồm `user.id`. Ta dùng thông tin này để:

1. Gọi Telegram Bot API kiểm tra user có phải **Admin/Owner** của group không
2. Nếu có → set `is_admin = true` trong database

### Bước 1: Cập nhật `AppContext.tsx` — Detect Admin từ Telegram

Mở file [`src/context/AppContext.tsx`](file:///f:/Tele_Mini_App/src/context/AppContext.tsx) và thêm logic sau vào hàm khởi tạo:

```typescript
// Thêm vào đầu AppProvider
useEffect(() => {
  const checkAdminStatus = async () => {
    // Lấy Telegram WebApp data
    const tg = window.Telegram?.WebApp;
    if (!tg?.initDataUnsafe?.user) return;
    
    const telegramId = tg.initDataUnsafe.user.id.toString();
    const GROUP_CHAT_ID = '-100XXXXXXXXXX'; // Chat ID của group Academy
    
    try {
      // Gọi backend endpoint để kiểm tra role
      const response = await fetch('/api/check-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          telegramId,
          groupId: GROUP_CHAT_ID,
          initData: tg.initData // Raw init data để verify
        }),
      });
      
      const { isAdmin } = await response.json();
      
      if (isAdmin) {
        dispatch({ type: 'SET_USER', payload: { ...state.user, is_admin: true } });
      }
    } catch (err) {
      console.error('Admin check failed:', err);
    }
  };
  
  checkAdminStatus();
}, []); // Chỉ chạy 1 lần khi app load
```

### Bước 2: Tạo Backend Endpoint kiểm tra Admin

Tạo file `api/check-admin.js` (nếu dùng Vercel serverless):

```javascript
// api/check-admin.js
import crypto from 'crypto';

// Verify initData từ Telegram (bảo mật)
function verifyTelegramData(initData, botToken) {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');
  
  const dataCheckString = [...urlParams.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => `${key}=${val}`)
    .join('\n');
  
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();
  
  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  return computedHash === hash;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { telegramId, groupId, initData } = req.body;
  const BOT_TOKEN = process.env.BOT_TOKEN;
  
  // 1. Verify initData hợp lệ (tránh giả mạo)
  if (!verifyTelegramData(initData, BOT_TOKEN)) {
    return res.status(403).json({ error: 'Invalid init data', isAdmin: false });
  }
  
  try {
    // 2. Gọi Telegram API kiểm tra role của user trong group
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=${groupId}&user_id=${telegramId}`
    );
    const data = await response.json();
    
    if (!data.ok) {
      return res.status(200).json({ isAdmin: false });
    }
    
    // 3. Các role được phép làm Admin
    const adminStatuses = ['creator', 'administrator'];
    const isAdmin = adminStatuses.includes(data.result.status);
    
    return res.status(200).json({ isAdmin });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ isAdmin: false, error: error.message });
  }
}
```

### Bước 3: Tạo file `.env` với Bot Token

```bash
# f:\Tele_Mini_App\.env
VITE_BOT_TOKEN=7XXXXXXXXX:AAXXXXXXXXXXXXXXXXXXXXXX
VITE_GROUP_CHAT_ID=-100XXXXXXXXXX
BOT_TOKEN=7XXXXXXXXX:AAXXXXXXXXXXXXXXXXXXXXXX
```

### Bước 4: Cập nhật `App.tsx` — Khởi tạo Telegram WebApp

Mở [`src/App.tsx`](file:///f:/Tele_Mini_App/src/App.tsx) và thêm vào đầu:

```typescript
import { useEffect } from 'react';

// Bên trong App component:
useEffect(() => {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.ready();                    // Báo Telegram app đã load xong
    tg.expand();                   // Mở full screen (giống Blum)
    tg.setHeaderColor('#0a0e1a'); // Dark header
    tg.setBackgroundColor('#0a0e1a');
    tg.enableClosingConfirmation(); // Hỏi trước khi đóng
  }
}, []);
```

### Bước 5: Thêm TypeScript types cho Telegram WebApp

Tạo file `src/types/telegram.d.ts`:

```typescript
// src/types/telegram.d.ts
interface TelegramWebApp {
  ready(): void;
  expand(): void;
  close(): void;
  setHeaderColor(color: string): void;
  setBackgroundColor(color: string): void;
  enableClosingConfirmation(): void;
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      photo_url?: string;
    };
    chat?: {
      id: number;
      type: string;
      title: string;
    };
    start_param?: string;
  };
  themeParams: {
    bg_color: string;
    text_color: string;
    hint_color: string;
    link_color: string;
    button_color: string;
    button_text_color: string;
  };
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp;
  };
}
```

---

## 6. Cấu hình Supabase (Backend)

Khi sẵn sàng chuyển từ mock data sang real database:

### Tạo project Supabase

1. Vào [supabase.com](https://supabase.com) → **New Project**
2. Đặt tên: `academy-hub`
3. Lưu **Project URL** và **Anon Key**

### Chạy SQL tạo tables

```sql
-- Chạy trong Supabase SQL Editor

CREATE TABLE users (
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

CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '📘',
  "order" INTEGER DEFAULT 0
);

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  thumbnail TEXT,
  xp_reward INTEGER DEFAULT 25,
  "order" INTEGER DEFAULT 0,
  video_url TEXT
);

CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started',
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  xp_reward INTEGER DEFAULT 50,
  condition_type TEXT,
  condition_value INTEGER
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE daily_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  day INTEGER,
  xp_reward INTEGER,
  claimed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_rewards ENABLE ROW LEVEL SECURITY;

-- Policy: user chỉ đọc được data của mình
CREATE POLICY "Users read own data" ON users
  FOR SELECT USING (telegram_id = current_setting('app.telegram_id', true));

-- Policy: Admin đọc được tất cả
CREATE POLICY "Admins read all" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE telegram_id = current_setting('app.telegram_id', true) AND is_admin = TRUE
    )
  );
```

### Thêm Supabase vào project

```bash
npm install @supabase/supabase-js
```

Thêm vào `.env`:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxxx
```

Tạo file `src/services/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

---

## 7. Checklist Hoàn Chỉnh

### Setup Bot
- [. ] Tạo bot qua @BotFather
- [ .] Lưu Bot Token vào `.env`
- [ .] Set description & ảnh đại diện bot
- [. ] Đăng ký Mini App (`/newapp`) với BotFather
- [ .] Set Menu Button (nút Open App trong chat 1:1 với bot)

### Deploy
- [.] Build: `npm run build`
- [.] Deploy lên Vercel/Netlify → Lấy HTTPS URL
- [.] Cập nhật URL trong BotFather (`/editapp`)

### Group Setup
- [ ] Thêm `@academy_hub_bot` vào group Academy demo
- [ ] Lấy Chat ID của group (qua `/getUpdates`)
- [ ] Gửi tin nhắn có Launch Button vào group
- [ ] Ghim tin nhắn đó

### Admin Role
- [ ] Tạo file `api/check-admin.js`
- [ ] Deploy API cùng với Vercel (tự động detect)
- [ ] Test: User là Admin group → thấy ⚙️ Admin Panel trong Profile
- [ ] Test: User thường → không thấy Admin Panel

### Supabase (Optional)
- [ ] Tạo project Supabase
- [ ] Chạy SQL tạo tables (hoặc dùng script tự động bên dưới)
- [ ] Thêm credentials vào `.env`
- [ ] Thay thế localStorage trong `AppContext.tsx` bằng Supabase queries

### 🛠️ Script Khởi Tạo & Seed Database Tự Động
Để đơn giản hóa quá trình tạo bảng và đồng bộ dữ liệu ban đầu, bạn có thể chạy script `scripts/setup-db.ts` đã được chuẩn bị sẵn. Script này sẽ:
1. Tạo đầy đủ các bảng (`users`, `modules`, `lessons`, `lesson_progress`, `achievements`, `user_achievements`, `daily_rewards`).
2. Tự động chuyển đổi các ID khóa chính thành kiểu `TEXT` để khớp hoàn hảo với code của ứng dụng React (tránh lỗi UUID đúc sai định dạng `'mod_001'`, `'les_001'`,...).
3. Tắt RLS (Row Level Security) để client-side có thể đồng bộ lưu tiến trình học, điểm danh và thành tựu trực tiếp mà không bị lỗi phân quyền.
4. Đẩy toàn bộ dữ liệu mẫu (modules, bài học, thành tựu) từ `mockData.ts` vào database.

**Cách chạy:**
Chạy lệnh sau trên terminal của máy tính (thay `YOUR_PASSWORD` bằng mật khẩu database Supabase của bạn):
```bash
npx tsx scripts/setup-db.ts "postgresql://postgres:YOUR_PASSWORD@db.yvtqofadqyqlbfdvdbzh.supabase.co:5432/postgres"
```

---

## 🔒 Bảo Mật Quan Trọng

| Vấn đề | Giải pháp |
|--------|-----------|
| Giả mạo Admin | Luôn verify `initData` bằng Bot Token trên **server** trước khi check role |
| Lộ Bot Token | Chỉ để Token ở **backend/server-side**, không expose ra frontend |
| SQL Injection | Dùng Supabase RLS + parameterized queries |
| CORS | Whitelist chỉ domain Telegram trong CORS config |

---

## 📞 Liên Hệ Hỗ Trợ

- Telegram Mini App Docs: https://core.telegram.org/bots/webapps
- BotFather Commands: https://core.telegram.org/bots#botfather
- Supabase Docs: https://supabase.com/docs
- Vercel Deploy: https://vercel.com/docs

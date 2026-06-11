import crypto from 'crypto';

// Verify initData từ Telegram (bảo mật)
function verifyTelegramData(initData, botToken) {
  if (!initData || !botToken) return false;
  
  try {
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
  } catch (err) {
    console.error('Error verifying telegram data:', err);
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { telegramId, groupId, initData } = req.body;
  const BOT_TOKEN = process.env.BOT_TOKEN || process.env.VITE_BOT_TOKEN;
  
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
      console.error('Telegram API response error:', data);
      return res.status(200).json({ isAdmin: false });
    }
    
    // 3. Các role được phép làm Admin
    const adminStatuses = ['creator', 'administrator'];
    const isAdmin = adminStatuses.includes(data.result.status);
    
    return res.status(200).json({ isAdmin });
    
  } catch (error) {
    console.error('getChatMember error:', error);
    return res.status(500).json({ isAdmin: false, error: error.message });
  }
}

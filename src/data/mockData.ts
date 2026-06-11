import type { Module, Lesson, Achievement, User } from '../types';

export const MOCK_USER: User = {
  id: 'user_001',
  telegram_id: '123456789',
  username: 'trader_alex',
  first_name: 'Alex',
  avatar: '',
  level: 3,
  xp: 320,
  streak: 5,
  last_login: new Date().toISOString(),
  created_at: '2025-01-15T10:00:00Z',
  is_admin: true,
  is_banned: false,
};

export const MOCK_MODULES: Module[] = [
  {
    id: 'mod_001',
    title: 'Introduction to Trading',
    description: 'Learn the basics of trading and financial markets. Perfect for beginners starting their journey.',
    icon: '📈',
    order: 1,
    lessons_count: 3,
  },
  {
    id: 'mod_002',
    title: 'Technical Analysis',
    description: 'Master chart patterns, indicators, and price action to make informed trading decisions.',
    icon: '📊',
    order: 2,
    lessons_count: 4,
  },
  {
    id: 'mod_003',
    title: 'Advanced Concepts',
    description: 'Dive deep into institutional trading strategies, liquidity, and market psychology.',
    icon: '🧠',
    order: 3,
    lessons_count: 4,
  },
];

export const MOCK_LESSONS: Lesson[] = [
  // Module 1: Introduction to Trading
  {
    id: 'les_001',
    module_id: 'mod_001',
    title: 'What is Trading?',
    description: 'Understanding the fundamentals of financial trading and how markets work.',
    content: `
# What is Trading?

Trading is the act of buying and selling financial instruments such as stocks, currencies, commodities, or cryptocurrencies with the goal of making a profit.

## Key Concepts

### Markets
Financial markets are venues where buyers and sellers come together to trade assets. The main types include:

- **Stock Market** — Trading shares of companies
- **Forex Market** — Trading currency pairs  
- **Crypto Market** — Trading digital currencies
- **Commodities** — Trading raw materials like gold, oil

### How Trading Works
At its core, trading involves:

1. **Buying Low** — Purchasing an asset when you believe it's undervalued
2. **Selling High** — Selling when the price has increased
3. **Short Selling** — Profiting from price decreases

### Types of Traders
- **Day Traders** — Open and close positions within the same day
- **Swing Traders** — Hold positions for days to weeks
- **Position Traders** — Hold for weeks to months
- **Scalpers** — Make many quick trades for small profits

## Why Learn Trading?
Trading offers the potential for financial independence, flexibility, and the ability to profit in any market condition. However, it requires education, discipline, and proper risk management.

> "The goal of a successful trader is to make the best trades. Money is secondary." — Alexander Elder
    `,
    thumbnail: '',
    xp_reward: 25,
    order: 1,
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'les_002',
    module_id: 'mod_001',
    title: 'Market Structure',
    description: 'Learn how markets are structured and the key participants that drive price action.',
    content: `
# Market Structure

Understanding market structure is fundamental to becoming a successful trader. It helps you identify trends, reversals, and key price levels.

## What is Market Structure?

Market structure refers to the pattern of price movements that create higher highs, higher lows, lower highs, and lower lows.

### Bullish Structure (Uptrend)
- Series of **Higher Highs (HH)** and **Higher Lows (HL)**
- Buyers are in control
- Look for buying opportunities at pullbacks

### Bearish Structure (Downtrend)
- Series of **Lower Highs (LH)** and **Lower Lows (LL)**
- Sellers are in control
- Look for selling opportunities at rallies

### Ranging Market
- Price moves sideways between support and resistance
- No clear trend direction
- Trade the range boundaries

## Break of Structure (BOS)
A Break of Structure occurs when price breaks a previous swing point:
- **Bullish BOS** — Price breaks above a previous high
- **Bearish BOS** — Price breaks below a previous low

## Change of Character (CHoCH)
A Change of Character signals a potential trend reversal:
- In an uptrend, a CHoCH occurs when price makes a lower low
- In a downtrend, a CHoCH occurs when price makes a higher high

## Key Takeaways
1. Always identify the current market structure before trading
2. Trade in the direction of the trend
3. Look for BOS to confirm trend continuation
4. Watch for CHoCH to spot potential reversals
    `,
    thumbnail: '',
    xp_reward: 25,
    order: 2,
  },
  {
    id: 'les_003',
    module_id: 'mod_001',
    title: 'Risk Management',
    description: 'The most crucial aspect of trading — protecting your capital and managing risk.',
    content: `
# Risk Management

Risk management is the most important skill in trading. Without it, even the best strategy will eventually lead to account destruction.

## The Golden Rules

### 1. Never Risk More Than 1-2% Per Trade
- If your account is $10,000, risk only $100-$200 per trade
- This ensures you can survive a losing streak

### 2. Always Use Stop Losses
- A stop loss automatically closes your trade at a predetermined loss level
- Never move your stop loss further away from your entry
- Place stops at logical levels (below support, above resistance)

### 3. Risk-Reward Ratio
Aim for a minimum of 1:2 risk-reward ratio:
- Risk $100 to make $200
- Even with a 40% win rate, you'll be profitable

### 4. Position Sizing
Calculate your position size based on:
- Account size
- Risk percentage
- Stop loss distance

**Formula:** Position Size = (Account × Risk%) / Stop Loss Distance

## Common Mistakes
- ❌ Revenge trading after losses
- ❌ Over-leveraging
- ❌ Not using stop losses
- ❌ Risking too much on a single trade
- ❌ Emotional trading

## The Trading Plan
Every successful trader has a plan that includes:
1. Entry criteria
2. Exit criteria
3. Risk per trade
4. Maximum daily loss
5. Position sizing rules

> "Risk comes from not knowing what you're doing." — Warren Buffett
    `,
    thumbnail: '',
    xp_reward: 25,
    order: 3,
  },
  // Module 2: Technical Analysis
  {
    id: 'les_004',
    module_id: 'mod_002',
    title: 'Support & Resistance',
    description: 'Identify key price levels where markets tend to reverse or consolidate.',
    content: `
# Support & Resistance

Support and resistance are the most fundamental concepts in technical analysis. They represent price levels where supply and demand meet.

## Support
A price level where buying pressure is strong enough to prevent further decline.

**How to Identify:**
- Previous swing lows
- Round numbers (e.g., $50,000 for BTC)
- Moving averages
- Trendlines

## Resistance
A price level where selling pressure is strong enough to prevent further advance.

**How to Identify:**
- Previous swing highs
- Round numbers
- Moving averages
- Trendlines

## Key Principles
1. **Role Reversal** — Once broken, support becomes resistance and vice versa
2. **The more touches, the stronger** — A level tested multiple times is more significant
3. **Volume confirmation** — Strong levels often have high volume
4. **Zones, not lines** — Think of S&R as zones rather than exact prices

## Trading Strategies
- **Bounce Trading** — Buy at support, sell at resistance
- **Breakout Trading** — Trade in the direction of the break
- **Retest Trading** — Wait for price to retest the broken level
    `,
    thumbnail: '',
    xp_reward: 25,
    order: 1,
  },
  {
    id: 'les_005',
    module_id: 'mod_002',
    title: 'Supply & Demand',
    description: 'Advanced price level analysis using institutional supply and demand zones.',
    content: `
# Supply & Demand

Supply and demand zones are areas on a chart where institutional orders have been placed, causing significant price movements.

## Demand Zones (Buying Areas)
- Areas where price rallied strongly upward
- Institutions placed large buy orders
- Price is likely to bounce when it returns to these zones

## Supply Zones (Selling Areas)
- Areas where price dropped sharply
- Institutions placed large sell orders
- Price is likely to reverse when it returns to these zones

## How to Draw Zones
1. Find a strong impulsive move (large candle)
2. Mark the base where the move originated
3. The zone is the consolidation area before the move

## Quality Factors
- **Freshness** — Untested zones are stronger
- **Strength of departure** — Stronger moves indicate more orders
- **Time spent** — Less time in the zone = more unfilled orders
- **Profit potential** — Enough room to the next opposing zone

## Trading Supply & Demand
1. Identify the trend direction
2. Find high-quality zones in the trend direction
3. Wait for price to return to the zone
4. Enter with a tight stop loss
5. Target the opposing zone
    `,
    thumbnail: '',
    xp_reward: 25,
    order: 2,
  },
  {
    id: 'les_006',
    module_id: 'mod_002',
    title: 'Trendlines',
    description: 'Learn to draw and trade trendlines for trend identification and entry timing.',
    content: `
# Trendlines

Trendlines are diagonal lines drawn on a chart to identify and confirm trends.

## Drawing Trendlines

### Uptrend Line
- Connect two or more higher lows
- Acts as dynamic support
- Price tends to bounce off this line

### Downtrend Line
- Connect two or more lower highs
- Acts as dynamic resistance
- Price tends to reject from this line

## Rules for Valid Trendlines
1. Must have at least **2 touch points** (3+ is ideal)
2. Should not cut through price action
3. Steeper trendlines are weaker
4. 45-degree angles are the most sustainable

## Trading with Trendlines
- **Bounce entries** — Enter when price touches the trendline
- **Break entries** — Trade the break of a trendline for reversals
- **Confluence** — Combine with horizontal S&R for stronger signals

## Common Patterns
- **Ascending Triangle** — Flat resistance + rising trendline
- **Descending Triangle** — Flat support + falling trendline
- **Wedges** — Two converging trendlines
- **Channels** — Two parallel trendlines
    `,
    thumbnail: '',
    xp_reward: 25,
    order: 3,
  },
  {
    id: 'les_007',
    module_id: 'mod_002',
    title: 'Candlestick Patterns',
    description: 'Read price action through candlestick patterns and formations.',
    content: `
# Candlestick Patterns

Candlestick patterns are visual representations of price movements that can signal potential reversals or continuations.

## Single Candle Patterns

### Doji
- Open and close are nearly equal
- Signals indecision
- Can indicate reversal at key levels

### Hammer / Hanging Man
- Small body with long lower wick
- Hammer (bullish) at support
- Hanging Man (bearish) at resistance

### Engulfing
- Current candle completely engulfs the previous
- Bullish Engulfing — signals buying pressure
- Bearish Engulfing — signals selling pressure

## Multi-Candle Patterns

### Morning Star / Evening Star
- Three-candle reversal pattern
- Morning Star (bullish) at bottoms
- Evening Star (bearish) at tops

### Three White Soldiers / Three Black Crows
- Three consecutive strong candles
- Signals strong momentum

## Key Tips
1. Always consider context (where on the chart)
2. Higher timeframe patterns are more reliable
3. Combine with support/resistance for confirmation
4. Volume adds conviction to patterns
    `,
    thumbnail: '',
    xp_reward: 25,
    order: 4,
  },
  // Module 3: Advanced Concepts
  {
    id: 'les_008',
    module_id: 'mod_003',
    title: 'Liquidity',
    description: 'Understand how smart money uses liquidity to fuel their positions.',
    content: `
# Liquidity

Liquidity is one of the most important concepts in advanced trading. It refers to the availability of orders at certain price levels.

## What is Liquidity?
- Clusters of stop losses and pending orders
- Created by retail traders at obvious levels
- Targeted by institutional traders for entries

## Types of Liquidity

### Buy-Side Liquidity (BSL)
- Stop losses from short sellers above resistance
- Buy stop orders above swing highs
- Institutions push price up to fill sell orders

### Sell-Side Liquidity (SSL)
- Stop losses from long buyers below support
- Sell stop orders below swing lows
- Institutions push price down to fill buy orders

## Liquidity Sweeps
A liquidity sweep occurs when price briefly breaks a level to grab stops, then reverses:
1. Price approaches a key level with stops
2. Breaks the level to trigger stop losses
3. Smart money fills orders against the stopped-out traders
4. Price reverses in the intended direction

## How to Trade Liquidity
1. Identify obvious liquidity pools (swing highs/lows, equal highs/lows)
2. Wait for the sweep (brief break and rejection)
3. Enter in the opposite direction after the sweep
4. Stop loss beyond the sweep wick
5. Target the opposing liquidity pool
    `,
    thumbnail: '',
    xp_reward: 25,
    order: 1,
  },
  {
    id: 'les_009',
    module_id: 'mod_003',
    title: 'Smart Money Concepts',
    description: 'Learn how institutional traders operate and how to follow their footprints.',
    content: `
# Smart Money Concepts (SMC)

Smart Money Concepts is a trading methodology based on understanding how institutional traders (banks, hedge funds) operate in the markets.

## Core Principles

### Order Blocks
- The last candle before an impulsive move
- Represents institutional order placement
- Acts as a zone of interest for future entries

### Fair Value Gaps (FVG)
- Three-candle pattern with a gap between the wicks
- Represents imbalance between supply and demand
- Price tends to return to fill these gaps

### Breaker Blocks
- Failed order blocks that get violated
- The zone flips from support to resistance (or vice versa)
- Very strong reversal zones

## Market Phases
1. **Accumulation** — Smart money builds positions (range)
2. **Manipulation** — False breakout to grab liquidity
3. **Distribution** — Smart money offloads positions
4. **Decline/Rally** — The real move begins

## Trading with SMC
1. Identify the higher timeframe trend
2. Mark key order blocks and FVGs
3. Wait for liquidity sweeps
4. Enter at order blocks/FVGs in the trend direction
5. Target the next liquidity pool

## Important Notes
- SMC works best on higher timeframes (4H, Daily)
- Always combine with proper risk management
- Not every setup will work — focus on quality
    `,
    thumbnail: '',
    xp_reward: 25,
    order: 2,
  },
  {
    id: 'les_010',
    module_id: 'mod_003',
    title: 'Futures Trading',
    description: 'Introduction to leveraged trading, margin, and futures contracts.',
    content: `
# Futures Trading

Futures trading allows you to trade contracts that derive their value from an underlying asset, with the ability to use leverage.

## What are Futures?
- Contracts to buy/sell an asset at a future date
- In crypto, most futures are **perpetual** (no expiry)
- Allow trading with **leverage** (borrowed capital)

## Key Concepts

### Leverage
- Amplifies your position size
- 10x leverage = $100 controls $1,000
- Amplifies both profits AND losses
- Higher leverage = higher liquidation risk

### Margin
- **Initial Margin** — Required deposit to open a position
- **Maintenance Margin** — Minimum balance to keep position open
- **Liquidation** — When margin drops below maintenance level

### Funding Rate
- Periodic fee between longs and shorts
- Keeps futures price aligned with spot price
- Positive rate = longs pay shorts
- Negative rate = shorts pay longs

## Risk Management in Futures
1. Never use more than 5-10x leverage as a beginner
2. Always use stop losses (especially with leverage!)
3. Size positions based on your risk tolerance
4. Never risk your entire account on leveraged trades

## Common Mistakes
- ❌ Using maximum leverage
- ❌ Not accounting for fees and funding
- ❌ Overtrading with leverage
- ❌ Not having a liquidation plan

> ⚠️ Leverage is a double-edged sword. It can multiply your gains, but it can also wipe your account in minutes.
    `,
    thumbnail: '',
    xp_reward: 25,
    order: 3,
  },
  {
    id: 'les_011',
    module_id: 'mod_003',
    title: 'Trading Psychology',
    description: 'Master your emotions and develop the mental framework for consistent trading.',
    content: `
# Trading Psychology

Psychology is often cited as the most important factor in trading success. Your mindset determines your consistency.

## The Emotional Cycle
1. **Excitement** — After a winning trade
2. **Greed** — Want to make more, increase size
3. **Fear** — After a losing trade
4. **Panic** — Close trades too early or revenge trade
5. **Despair** — Consider quitting
6. **Hope** — Start learning again

## Key Psychological Challenges

### Fear of Missing Out (FOMO)
- Entering trades without proper analysis
- Chasing price after it has already moved
- **Solution:** Stick to your trading plan

### Revenge Trading
- Trading to recover losses immediately
- Usually leads to bigger losses
- **Solution:** Set maximum daily loss limits

### Overconfidence
- After a winning streak, increasing risk
- Ignoring your rules because "you're hot"
- **Solution:** Treat every trade independently

### Analysis Paralysis
- Too many indicators and information
- Unable to pull the trigger on trades
- **Solution:** Simplify your strategy

## Building a Winner's Mindset
1. **Accept losses** — They are a cost of doing business
2. **Focus on process** — Not outcomes
3. **Journal every trade** — Review and improve
4. **Take breaks** — Step away after losses
5. **Stay disciplined** — Follow your rules, always

## Daily Routine
- Morning: Review markets, mark key levels
- Pre-trade: Check your plan, confirm setup
- During trade: Follow your rules, no emotions
- Post-trade: Journal the trade, review decisions
- Evening: Reflect, prepare for tomorrow

> "The market can stay irrational longer than you can stay solvent." — John Maynard Keynes
    `,
    thumbnail: '',
    xp_reward: 25,
    order: 4,
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
    description: 'Complete 5 lessons',
    icon: '📖',
    xp_reward: 75,
    condition_type: 'lessons_completed',
    condition_value: 5,
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
    description: 'Complete 10 lessons',
    icon: '⭐',
    xp_reward: 150,
    condition_type: 'lessons_completed',
    condition_value: 10,
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
    condition_value: 3,
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

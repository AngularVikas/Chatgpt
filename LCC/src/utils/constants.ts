export const COLLECTIONS = {
  USERS: 'users',
  PLAYERS: 'players',
  SCHEDULES: 'schedules',
  AVAILABILITY: 'availability',
  TEAMS: 'teams',
  MEMBERSHIPS: 'memberships',
  PAYMENTS: 'payments',
  LIVE_SCORES: 'liveScores',
};

export const ROLE_COLORS: Record<string, string> = {
  'Batsman': '#007AFF',
  'Bowler': '#00C853',
  'All-Rounder': '#c8a84b',
  'Wicket-Keeper': '#FF9500',
  'Wicket-Keeper Batsman': '#FF9500',
};

export const MATCH_STATUS_COLORS: Record<string, string> = {
  scheduled: '#007AFF',
  live: '#FF3B30',
  completed: '#00C853',
  cancelled: '#9CA3AF',
  rain_delay: '#FF9500',
};

export const MEMBERSHIP_TIERS = {
  basic: { name: 'Basic', price: 50, color: '#9CA3AF' },
  player: { name: 'Playing Member', price: 150, color: '#1a3c5e' },
  premium: { name: 'Premium', price: 300, color: '#c8a84b' },
};

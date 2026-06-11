import { format, isToday, isTomorrow } from 'date-fns';

export const formatMatchDate = (date: Date) => {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'EEE, MMM d');
};

export const formatMatchTime = (date: Date) => format(date, 'h:mm a');

export const formatCountdown = (date: Date) => {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  if (diff <= 0) return 'Now';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

export const formatOvers = (overs: number, balls: number) => `${overs}.${balls}`;

export const formatSR = (runs: number, balls: number) =>
  balls === 0 ? '0.00' : ((runs / balls) * 100).toFixed(2);

export const formatAverage = (runs: number, innings: number) =>
  innings === 0 ? '0.00' : (runs / innings).toFixed(2);

export const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

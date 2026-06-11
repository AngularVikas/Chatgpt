import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['player', 'member']).default('member'),
  jerseyNumber: z.number().optional(),
});

export const playerSchema = z.object({
  displayName: z.string().min(2, 'Name required'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  jerseyNumber: z.number().min(1).max(99).optional(),
  role: z.enum(['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper', 'Wicket-Keeper Batsman']),
  battingStyle: z.enum(['Right-hand', 'Left-hand']),
  bowlingStyle: z.string().optional(),
  bio: z.string().optional(),
});

export const matchSchema = z.object({
  title: z.string().min(2, 'Title required'),
  opponent: z.string().min(2, 'Opponent required'),
  venue: z.string().min(2, 'Venue required'),
  matchDate: z.date(),
  matchType: z.enum(['T20', 'ODI', 'Test', 'T10', 'Practice']),
  notes: z.string().optional(),
});

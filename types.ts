export enum ViewState {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD',
  JOURNAL = 'JOURNAL',
  MOOD = 'MOOD',
  CBT = 'CBT',
  PROFILE = 'PROFILE'
}

export interface User {
  username: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO string
  content: string;
  tags: string[];
  imageUrl?: string;
}

export interface MoodLog {
  id: string;
  date: string; // ISO string
  value: number; // 1-10
  note?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface CBTMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface AppState {
  user: User | null;
  view: ViewState;
}
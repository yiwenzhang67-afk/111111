import { Badge } from './types';

export const APP_NAME = "心语感恩日记";

export const MOOD_EMOJIS = [
  "😢", "😟", "😐", "🙂", "😄"
]; // Mapped to values 1-2, 3-4, 5-6, 7-8, 9-10

export const INITIAL_BADGES: Badge[] = [
  { id: 'first_step', name: '初次遇见', description: '完成第一篇感恩日记', icon: '🌱', unlocked: false },
  { id: 'streak_3', name: '三日连心', description: '连续记录3天', icon: '🔥', unlocked: false },
  { id: 'streak_7', name: '周而复始', description: '连续记录7天', icon: '🌟', unlocked: false },
  { id: 'mood_master', name: '情绪观察员', description: '记录超过10次情绪', icon: '🧠', unlocked: false },
  { id: 'cbt_explorer', name: '思维重构', description: '使用一次AI认知疗法', icon: '💡', unlocked: false },
];

export const THEME_COLORS = {
  primary: 'amber-600',
  secondary: 'teal-600',
  bg: 'stone-50'
};
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { MoodLog } from '../types';
import { storageService } from '../services/storageService';
import { MOOD_EMOJIS } from '../constants';
import { Smile } from 'lucide-react';

export const MoodTracker: React.FC = () => {
  const [moods, setMoods] = useState<MoodLog[]>([]);
  const [todayMood, setTodayMood] = useState<number>(5);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);

  useEffect(() => {
    loadMoods();
  }, []);

  const loadMoods = async () => {
    const data = await storageService.getMoods();
    setMoods(data);
    // Check if logged today
    const todayStr = new Date().toISOString().split('T')[0];
    const found = data.find(m => m.date.startsWith(todayStr));
    if (found) setHasLoggedToday(true);
  };

  const handleSaveMood = async () => {
    if (hasLoggedToday) return;
    await storageService.addMood({
      date: new Date().toISOString(),
      value: todayMood,
    });
    await loadMoods();
    setHasLoggedToday(true);
  };

  // Prepare data for chart
  const chartData = moods.slice(-7).map(m => ({
    day: new Date(m.date).toLocaleDateString('zh-CN', { weekday: 'short' }),
    value: m.value
  }));

  const getEmojiForValue = (val: number) => {
    const index = Math.ceil(val / 2) - 1;
    return MOOD_EMOJIS[Math.max(0, Math.min(index, 4))];
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
          <Smile className="text-teal-500" size={20} />
          情绪图谱
        </h2>
        <span className="text-xs text-stone-400">过去7天</span>
      </div>

      <div className="h-40 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis 
                dataKey="day" 
                tick={{fontSize: 10, fill: '#a8a29e'}} 
                axisLine={false} 
                tickLine={false} 
                dy={10}
            />
            <YAxis hide domain={[0, 10]} />
            <Tooltip 
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}
                labelStyle={{color: '#78716c'}}
            />
            <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#0d9488" 
                strokeWidth={3} 
                dot={{fill: '#0d9488', r: 4, strokeWidth: 2, stroke: '#fff'}} 
                activeDot={{r: 6}}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {!hasLoggedToday ? (
        <div className="bg-stone-50 rounded-xl p-4 text-center">
          <p className="text-sm text-stone-600 mb-3">今天心情如何？</p>
          <div className="text-4xl mb-4 transition-all transform duration-300">
            {getEmojiForValue(todayMood)}
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={todayMood}
            onChange={(e) => setTodayMood(parseInt(e.target.value))}
            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-teal-600 mb-4"
          />
          <button
            onClick={handleSaveMood}
            className="w-full py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
          >
            记录心情
          </button>
        </div>
      ) : (
        <div className="text-center p-4 bg-teal-50 rounded-xl border border-teal-100">
          <p className="text-teal-800 text-sm font-medium">今日心情已记录，继续保持觉察。</p>
        </div>
      )}
    </div>
  );
};
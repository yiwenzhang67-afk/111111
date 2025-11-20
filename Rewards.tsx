import React, { useEffect, useState } from 'react';
import { User, Badge } from '../types';
import { storageService } from '../services/storageService';
import { LogOut, Trophy, User as UserIcon, Award } from 'lucide-react';

interface RewardsProps {
  user: User;
  onLogout: () => void;
}

export const Rewards: React.FC<RewardsProps> = ({ user, onLogout }) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [entryCount, setEntryCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setBadges(storageService.getBadges());
      const entries = await storageService.getEntries();
      setEntryCount(entries.length);
    };
    loadData();
  }, []);

  return (
    <div className="p-4 pb-24">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
            <UserIcon size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-800">{user.username}</h2>
            <p className="text-sm text-stone-400">感恩之旅第 {entryCount} 步</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
            <Trophy size={20} className="text-amber-500" />
            成就勋章
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {badges.map(badge => (
            <div 
                key={badge.id} 
                className={`aspect-square flex flex-col items-center justify-center p-3 rounded-xl text-center border transition-all ${
                    badge.unlocked 
                    ? 'bg-white border-amber-200 shadow-sm' 
                    : 'bg-stone-50 border-stone-100 opacity-60 grayscale'
                }`}
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <h4 className="text-xs font-bold text-stone-700 mb-1">{badge.name}</h4>
              <p className="text-[10px] text-stone-400 leading-tight">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-teal-50 rounded-xl p-4 mb-6 border border-teal-100">
         <div className="flex items-start gap-3">
            <Award className="text-teal-600 mt-1" size={20} />
            <div>
                <h4 className="font-bold text-teal-800 text-sm">每日一句</h4>
                <p className="text-teal-700 text-xs mt-1">"生活不是因为美好才感恩，而是因为感恩才美好。"</p>
            </div>
         </div>
      </div>

      <button
        onClick={onLogout}
        className="w-full py-3 bg-white border border-stone-200 text-stone-600 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors"
      >
        <LogOut size={18} />
        退出登录
      </button>
    </div>
  );
};
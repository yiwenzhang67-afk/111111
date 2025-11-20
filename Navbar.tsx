import React from 'react';
import { ViewState } from '../types';
import { Home, BookHeart, BrainCircuit, UserCircle } from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, icon: Home, label: '首页' },
    { id: ViewState.JOURNAL, icon: BookHeart, label: '日记' },
    { id: ViewState.CBT, icon: BrainCircuit, label: '疗愈' },
    { id: ViewState.PROFILE, icon: UserCircle, label: '我的' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 pb-safe pt-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 h-20 flex justify-between items-start pb-4">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`flex flex-col items-center space-y-1 w-16 transition-colors duration-200 ${
              isActive ? 'text-amber-600' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
import React, { useState } from 'react';
import { ViewState } from '../types';
import { storageService } from '../services/storageService';
import { HeartHandshake } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
  initialView: ViewState;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, initialView }) => {
  const [view, setView] = useState<ViewState>(initialView);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // Dummy password for UI
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setLoading(true);
    // Simulate API call
    await storageService.login(username);
    setLoading(false);
    onLogin();
  };

  const isLogin = view === ViewState.LOGIN;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50 px-6">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 space-y-8 border border-amber-100">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-2">
            <HeartHandshake size={32} />
          </div>
          <h1 className="text-2xl font-bold text-stone-800 tracking-tight">心语感恩日记</h1>
          <p className="text-stone-500 text-sm">
            {isLogin ? '欢迎回来，记录生活的美好' : '开启你的感恩治愈之旅'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider ml-1">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all text-stone-800"
              placeholder="你的名字"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider ml-1">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all text-stone-800"
              placeholder="随便填（模拟）"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-lg shadow-amber-600/20 active:scale-[0.98] transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? '处理中...' : (isLogin ? '登录' : '开始旅程')}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setView(isLogin ? ViewState.REGISTER : ViewState.LOGIN)}
            className="text-sm text-stone-400 hover:text-amber-600 transition-colors"
          >
            {isLogin ? '还没有账号？去注册' : '已有账号？去登录'}
          </button>
        </div>
      </div>
    </div>
  );
};
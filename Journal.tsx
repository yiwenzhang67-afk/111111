import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types';
import { storageService } from '../services/storageService';
import { geminiService } from '../services/geminiService';
import { Plus, Calendar, Sparkles } from 'lucide-react';

export const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loadingPrompt, setLoadingPrompt] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const data = await storageService.getEntries();
    setEntries(data);
  };

  const handleCreateStart = async () => {
    setIsCreating(true);
    setLoadingPrompt(true);
    const suggestion = await geminiService.getGratitudePrompt();
    setPrompt(suggestion);
    setLoadingPrompt(false);
  };

  const handleSave = async () => {
    if (!newContent.trim()) return;
    await storageService.addEntry({
      date: new Date().toISOString(),
      content: newContent,
      tags: []
    });
    setNewContent('');
    setIsCreating(false);
    loadEntries();
  };

  if (isCreating) {
    return (
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-stone-800">新日记</h2>
          <button onClick={() => setIsCreating(false)} className="text-stone-400 text-sm">取消</button>
        </div>

        <div className="bg-amber-50 p-4 rounded-xl mb-4 border border-amber-100">
          <div className="flex items-start gap-2">
             <Sparkles size={16} className="text-amber-600 mt-0.5 shrink-0" />
             <p className="text-sm text-amber-800 italic font-medium">
                {loadingPrompt ? '正在思考灵感...' : prompt}
             </p>
          </div>
        </div>

        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="今天发生了什么让你感到温暖的事..."
          className="flex-1 w-full p-4 bg-white rounded-xl border border-stone-200 resize-none focus:ring-2 focus:ring-amber-200 outline-none text-stone-700 text-lg leading-relaxed"
        />

        <button
          onClick={handleSave}
          disabled={!newContent.trim()}
          className="mt-4 w-full py-3 bg-amber-600 text-white rounded-xl font-semibold shadow-lg shadow-amber-600/20 hover:bg-amber-700 active:scale-95 transition-all disabled:opacity-50"
        >
          保存感恩瞬间
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-stone-800">我的日记</h2>
        <button
          onClick={handleCreateStart}
          className="flex items-center gap-1 bg-stone-800 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:bg-black transition-colors"
        >
          <Plus size={16} />
          <span>记一笔</span>
        </button>
      </div>

      <div className="space-y-4">
        {entries.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar size={32} />
                </div>
                <p>还没有日记，开始记录第一份美好吧。</p>
            </div>
        ) : (
            entries.map(entry => (
            <div key={entry.id} className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100">
                <div className="text-xs text-stone-400 mb-2 font-mono">
                {new Date(entry.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
                </div>
                <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">
                {entry.content}
                </p>
            </div>
            ))
        )}
      </div>
    </div>
  );
};
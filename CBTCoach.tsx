import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { CBTMessage } from '../types';
import { Send, Bot, User as UserIcon, AlertCircle } from 'lucide-react';
import { storageService } from '../services/storageService';

export const CBTCoach: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<CBTMessage[]>([
    {
      id: 'intro',
      role: 'model',
      text: '你好，我是你的CBT情绪助手。如果你感到困扰、焦虑或有一些消极的想法，可以告诉我。我会试着帮助你从不同的角度看待它。',
      timestamp: Date.now()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasApiKey = !!process.env.API_KEY;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: CBTMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await geminiService.analyzeThought(userMsg.text);
      
      const aiMsg: CBTMessage = {
        id: crypto.randomUUID(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
      
      // Reward for using CBT
      storageService.checkBadges('cbt_use', 1);

    } catch (error) {
      const errorMsg: CBTMessage = {
        id: crypto.randomUUID(),
        role: 'model',
        text: "抱歉，我遇到了一点问题，请稍后再试。",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!hasApiKey) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-stone-500">
            <AlertCircle size={48} className="mb-4 text-amber-500" />
            <p>需要配置 Gemini API Key 才能使用 AI 功能。</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="bg-white p-4 border-b border-stone-100 shadow-sm z-10">
        <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
          <Bot className="text-amber-600" size={24} />
          认知重构助手
        </h2>
        <p className="text-xs text-stone-400 mt-1">基于认知行为疗法(CBT)的AI对话</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] md:max-w-[70%] gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-stone-200' : 'bg-amber-100 text-amber-600'}`}>
                  {isUser ? <UserIcon size={16} className="text-stone-600" /> : <Bot size={18} />}
                </div>
                <div className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                  isUser 
                    ? 'bg-stone-800 text-white rounded-tr-none' 
                    : 'bg-white text-stone-700 rounded-tl-none border border-stone-100'
                }`}>
                   {/* Simple markdown-like bold rendering if needed, or just text */}
                   {msg.text}
                </div>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
             <div className="flex gap-2 bg-white p-3 rounded-2xl rounded-tl-none border border-stone-100 ml-10 items-center">
                <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-150"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-stone-200">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="写下你的烦恼..."
            className="w-full pl-4 pr-12 py-3 rounded-full bg-stone-100 border-none focus:ring-2 focus:ring-amber-200 outline-none text-stone-700 placeholder-stone-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 bg-amber-600 text-white rounded-full disabled:opacity-50 hover:bg-amber-700 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
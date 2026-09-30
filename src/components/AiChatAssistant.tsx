import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';
import { Destination } from '../types/travel';
import { sendChatMessageToN8n } from '../services/n8nService';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AiChatAssistantProps {
  currentDestination?: Destination | null;
  budget?: number;
  currency?: string;
  isOpen: boolean;
  onToggle: () => void;
  initialPrompt?: string;
}

export const AiChatAssistant: React.FC<AiChatAssistantProps> = ({
  currentDestination,
  budget,
  currency,
  isOpen,
  onToggle,
  initialPrompt,
}) => {
  const [sessionId] = useState(() => {
    const saved = typeof window !== 'undefined' ? window.sessionStorage.getItem('tripwise_chat_session') : null;
    if (saved) return saved;
    const newId = `tripwise-session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('tripwise_chat_session', newId);
    }
    return newId;
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I'm your TripWise AI concierge. ${
        currentDestination
          ? `I see you're exploring ${currentDestination.name}. Ask me about hidden gems, cheaper stays, food recommendations, or tweaking your daily schedule!`
          : `Tell me your budget, travel dates, and who you're traveling with, and I'll find your perfect trip.`
      }`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastSentPromptRef = useRef<string>('');
  const prevDestRef = useRef<string | undefined>(currentDestination?.name);

  useEffect(() => {
    if (currentDestination && currentDestination.name !== prevDestRef.current) {
      prevDestRef.current = currentDestination.name;
      const destLabel = currentDestination.country
        ? `${currentDestination.name}, ${currentDestination.country}`
        : currentDestination.name;
      setMessages((prev) => [
        ...prev,
        {
          id: `dest-change-${Date.now()}`,
          sender: 'assistant',
          text: `Destination updated to **${destLabel}**! Ask me to plan a custom day-by-day itinerary, recommend hotels, or share local tips here.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [currentDestination]);

  useEffect(() => {
    if (initialPrompt && isOpen && lastSentPromptRef.current !== initialPrompt) {
      lastSentPromptRef.current = initialPrompt;
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const destLabel = currentDestination
        ? currentDestination.country
          ? `${currentDestination.name}, ${currentDestination.country}`
          : currentDestination.name
        : undefined;

      const context = {
        destination: destLabel,
        budget,
        currency,
      };

      const { reply } = await sendChatMessageToN8n(text, sessionId, context);

      const aiMsg: Message = {
        id: `ai-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sender: 'assistant',
        text: reply || "I'm right here to help you customize your travel plans!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('n8n Chat error:', err);
      const errorMsg: Message = {
        id: `ai-err-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sender: 'assistant',
        text: "I'm having trouble connecting to the AI Concierge right now. Please try sending your message again!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestionChips = currentDestination
    ? [
        `Show cheaper hotel options in ${currentDestination.name}`,
        `What are the best vegetarian dishes here?`,
        `Replace day 2 with more food & market experiences`,
        `What is the best photography vantage point?`,
      ]
    : [
        'Recommend 5-day trips under ₹80,000 for family',
        'Romantic beach getaways for couples in Asia',
        'Budget solo trips with mountain hiking',
      ];

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-20 md:bottom-6 right-6 z-40 bg-slate-900 hover:bg-slate-800 text-white rounded-full p-4 shadow-2xl flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 border border-slate-700"
        aria-label="Open AI Travel Assistant"
      >
        <Sparkles className="w-5 h-5 text-amber-400" />
        <span className="text-xs font-semibold hidden sm:inline">Ask TripWise AI</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 w-full sm:w-[420px] max-w-[calc(100vw-2rem)] h-[540px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-display leading-tight">
              TripWise Concierge
            </h3>
            <span className="text-[11px] text-slate-300">
              {currentDestination ? `Advising on ${currentDestination.name}` : 'AI Trip Planner'}
            </span>
          </div>
        </div>

        <button
          onClick={onToggle}
          className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-br-none shadow-sm'
                  : 'bg-white text-slate-800 rounded-bl-none border border-slate-200/80 shadow-sm'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
              <span
                className={`text-[9px] block mt-1 ${
                  msg.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-none border border-slate-200 px-4 py-3 text-xs text-slate-500 flex items-center gap-2 shadow-sm">
              <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
              <span>TripWise AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="p-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
        {suggestionChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            className="text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition-colors truncate max-w-[200px]"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask anything about your trip or changes..."
          className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

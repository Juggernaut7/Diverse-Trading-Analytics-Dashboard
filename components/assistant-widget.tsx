import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I can help with analytics, journaling, and trading insights. Ask me anything.' }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', text: input }]);
    setInput('');
    // Simulate AI response
    setTimeout(() => {
      setMessages(msgs => [...msgs, { role: 'assistant', text: 'This is a sample AI response.' }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-80 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-neutral-800">
            <span className="font-bold text-white text-sm">AI Assistant</span>
            <button onClick={() => setOpen(false)} className="text-neutral-400 hover:text-red-400">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ maxHeight: 320 }}>
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'assistant' ? 'text-emerald-400 text-xs' : 'text-white text-xs text-right'}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex items-center border-t border-neutral-800 p-2 gap-2">
            <input
              className="flex-1 bg-neutral-800 text-white px-2 py-1 rounded border border-neutral-700 text-xs"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
            />
            <button onClick={handleSend} className="text-emerald-400 hover:text-emerald-300"><Send size={16} /></button>
          </div>
        </div>
      ) : (
        <button
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3 shadow-lg flex items-center gap-2"
          onClick={() => setOpen(true)}
          title="Open AI Assistant"
        >
          <MessageCircle size={20} />
          <span className="hidden sm:inline text-xs font-bold">AI</span>
        </button>
      )}
    </div>
  );
}

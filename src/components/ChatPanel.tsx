import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getGeminiResponse } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const ChatPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'model',
          parts: [{ text: '¡Hola! 👋 Soy el asistente de **C Design IA**. Podés preguntarme sobre servicios, proyectos o cómo contactarnos. ¿En qué te ayudo?' }],
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', parts: [{ text: input }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(newMessages);
      if (response) {
        setMessages([...newMessages, { role: 'model', parts: [{ text: response }] }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([
        ...newMessages,
        { role: 'model', parts: [{ text: 'Ups, hubo un error 😅 Escribinos a [constanzarissop91@gmail.com](mailto:constanzarissop91@gmail.com)' }] },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-32 right-4 md:right-8 z-[399] w-[calc(100vw-2rem)] md:w-80 bg-bg-secondary border border-lilac/20 flex flex-col max-h-[480px] shadow-2xl rounded-lg overflow-hidden"
        >
          <div className="p-3.5 border-b border-lilac/10 flex items-center justify-between bg-bg-tertiary">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-lilac/10 border border-lilac/20 flex items-center justify-center text-lilac font-bold">
                ◈
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">C Design IA</div>
                <div className="text-[10px] text-text-muted flex items-center gap-1">
                  <span className="chat-dot"></span>
                  Asistente virtual
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-text-muted hover:text-lilac transition-colors p-1">
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scroll-smooth">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[90%] p-2.5 text-xs leading-relaxed rounded-lg ${
                  msg.role === 'model'
                    ? 'bg-bg-tertiary border border-lilac/10 text-text-secondary self-start rounded-tl-none'
                    : 'bg-lilac/10 border border-lilac/20 text-text-primary self-end rounded-tr-none'
                }`}
              >
                <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
              </div>
            ))}
            {isLoading && (
              <div className="bg-bg-tertiary border border-lilac/10 self-start rounded-lg rounded-tl-none p-3 flex gap-1 items-center">
                <span className="w-1 h-1 rounded-full bg-lilac-dim animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1 h-1 rounded-full bg-lilac-dim animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1 h-1 rounded-full bg-lilac-dim animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            )}
          </div>

          <div className="p-2 border-t border-lilac/10 bg-bg-tertiary text-[10px] text-text-muted text-center">
            ¿Preferís hablar directo?{' '}
            <a
              href="https://wa.me/5493815341233"
              target="_blank"
              rel="noreferrer"
              className="text-wa font-medium hover:underline"
            >
              WhatsApp ↗
            </a>
          </div>

          <div className="p-3 border-t border-lilac/10 flex gap-2 items-center bg-bg-secondary">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribí tu consulta..."
              className="flex-1 bg-bg-tertiary border border-lilac/10 text-text-primary p-2 text-xs outline-none focus:border-lilac-dim transition-colors rounded"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-8 h-8 bg-lilac hover:opacity-80 disabled:opacity-30 text-bg flex items-center justify-center transition-all rounded"
            >
              <Send size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, ChevronLeft, Download, Send, Wand2 } from 'lucide-react';

const WAITING_MESSAGES = [
  "C DESIGN LAB está conceptualizando tu idea...",
  "Sintetizando texturas de alta costura...",
  "Nuestra IA está diseñando tu visión...",
  "Renderizando obra maestra 8K...",
];

export const IALab = () => {
  const [userPrompt, setUserPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState({ url: '', advice: '', ready: false, error: false });

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % WAITING_MESSAGES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!userPrompt.trim()) return;
    setIsGenerating(true);
    setShowResults(false);
    
    try {
      // PROMPT MAESTRO: Forzamos realismo y simetría total
      const stylePreset = "highly detailed facial features, perfect symmetrical eyes, realistic skin pores, sharp focus, 8k, fashion editorial, cinematic lighting, masterpiece, flawless face";
      const fullPrompt = `${userPrompt}, ${stylePreset}`;
      const seed = Math.floor(Math.random() * 1000000);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=1080&height=1350&nologo=true&model=flux&seed=${seed}`;

      setResult({
        url: imageUrl,
        advice: `C DESIGN LAB ha sintetizado tu visión con estándares de alta costura digital.`,
        ready: true,
        error: false
      });
      setShowResults(true);
    } catch (e) {
      setResult(prev => ({ ...prev, ready: true, error: true }));
      setShowResults(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white p-6 md:p-12 overflow-x-hidden">
      <nav className="relative z-10 mb-16 flex justify-between items-center max-w-7xl mx-auto">
        <a href="/" className="flex items-center gap-2 text-purple-400 hover:text-white transition-all group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Volver</span>
        </a>
        <div className="text-right">
          <h1 className="text-3xl md:text-5xl font-serif italic uppercase tracking-tighter">C DESIGN LAB</h1>
          <p className="text-[9px] text-purple-500 mt-1 uppercase tracking-[0.4em]">Digital Fashion Masterpiece</p>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Panel de Control */}
        <div className="backdrop-blur-3xl bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-[10px] font-bold text-purple-300 uppercase tracking-[0.5em]">1. Describe tu obra maestra</h3>
            <p className="text-white/30 text-[9px] uppercase tracking-widest">IA Generative Engine</p>
          </div>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Ej: Extremely beautiful model, iridescent gown, symmetrical face, 8k..."
            className="w-full h-56 bg-black/40 border border-white/10 rounded-[2rem] p-8 text-white focus:border-purple-500 transition-all outline-none resize-none"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !userPrompt.trim()}
            className="w-full py-6 rounded-2xl font-bold tracking-[0.4em] bg-gradient-to-r from-purple-600 to-purple-900 shadow-xl hover:brightness-125 transition-all flex items-center justify-center gap-3"
          >
            {isGenerating ? <Loader2 className="animate-spin" /> : <><Wand2 className="w-5 h-5" /> Experiment Progress ✨</>}
          </button>
        </div>

        {/* Panel de Resultado Lateral */}
        <div className="w-full flex justify-center">
          <AnimatePresence mode="wait">
            {showResults && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 max-w-[450px] w-full">
                <div className="w-full h-auto min-h-[300px] rounded-[2.5rem] border border-purple-500/30 overflow-hidden bg-black flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.1)]">
                  <img 
                    src={result.url} 
                    className="w-full h-auto object-contain"
                    alt="C DESIGN LAB Result" 
                  />
                </div>
                <div className="space-y-4">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                    <p className="text-xs font-serif italic text-center text-white/60 leading-relaxed">"{result.advice}"</p>
                  </div>
                  <a href={result.url} target="_blank" rel="noreferrer" className="block w-full py-5 rounded-full bg-purple-600 text-center font-bold text-[10px] tracking-[0.3em] shadow-lg hover:bg-purple-500 transition-all">
                    GUARDAR EN MI DISPOSITIVO
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Loading Fullscreen */}
      <AnimatePresence>
        {isGenerating && (
          <div className="fixed inset-0 z-[6000] flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl">
            <Loader2 className="w-20 h-20 text-purple-500 animate-spin mb-8" />
            <p className="text-2xl font-serif italic text-white animate-pulse">"{WAITING_MESSAGES[currentMessage]}"</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
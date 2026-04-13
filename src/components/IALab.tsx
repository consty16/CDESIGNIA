import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, ChevronLeft, Download, Send, Wand2, Music2, Music } from 'lucide-react';

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
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isComposingMusic, setIsComposingMusic] = useState(false);
  const [musicResult, setMusicResult] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

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
    setIsImageLoading(true);
    
    try {
      // PROMPT MAESTRO: Forzamos realismo y simetría total
      const stylePreset = "highly detailed facial features, perfect symmetrical eyes, realistic skin pores, sharp focus, 8k, fashion editorial, cinematic lighting, masterpiece, flawless face";
      const fullPrompt = `${userPrompt}, ${stylePreset}`;
      const seed = Math.floor(Math.random() * 1000000);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=1024&height=1024&nologo=true&model=flux&seed=${seed}`;

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

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!result.url || isGenerating || isImageLoading) return;
    try {
      const response = await fetch(result.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `C_DESIGN_LAB_ObraMaestra_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.open(result.url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-bg-tertiary font-sans text-white p-4 md:p-8 overflow-hidden relative">
      {/* Vibrant Creative Blobs */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#5c1a5c]/20 blur-[180px] rounded-full animate-pulse z-0" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[#3b0f6b]/20 blur-[180px] rounded-full animate-pulse-slow z-0" />
      <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-white/5 blur-[150px] rounded-full z-0" />

      <nav className="relative z-10 mb-10 flex items-center justify-center max-w-5xl mx-auto">
        <a href="/" className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-white/50 hover:text-lilac transition-all group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1" />
          <span className="text-[10px] uppercase tracking-widest font-black">VOLVER</span>
        </a>
        <div className="text-center">
          <h1 
            className="text-4xl md:text-6xl font-serif font-bold mb-2 uppercase"
            style={{ 
              color: '#c4b5fd', 
              textShadow: '0 0 15px rgba(194,171,237,0.8), 0 0 30px rgba(194,171,237,0.5)' 
            }}
          >
            C DESIGN LAB
          </h1>
          <p 
            className="font-serif text-lg md:text-2xl italic tracking-wide"
            style={{ color: '#9333ea' }}
          >
            Digital Fashion Masterpiece
          </p>
        </div>
      </nav>

      <div className="ia-lab-wrapper max-w-5xl mx-auto relative z-10">
        {/* Panel de Control - More Compact & Vivid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel"
        >
          <div className="text-center space-y-2 mb-4">
            <h3 className="text-[10px] font-black text-white tracking-[0.4em] uppercase flex items-center justify-center gap-4">
              <span className="w-6 h-[1px] bg-white/20" />
              1. Tu Obra Maestra
              <span className="w-6 h-[1px] bg-white/20" />
            </h3>
            <p className="text-white/40 text-[8px] uppercase tracking-widest font-bold">IA Generative Engine</p>
          </div>
          
          <div className="input-area mb-6 rounded-xl overflow-hidden" style={{ backgroundColor: '#3b1566' }}>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Describe tu visión aquí..."
              rows={6}
              className="w-full bg-transparent border-none p-5 text-white text-base placeholder-white/30 focus:ring-0 outline-none transition-all resize-none font-light leading-snug"
            />
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !userPrompt.trim()}
                className="w-full py-4 rounded-xl font-black text-xs tracking-[0.4em] bg-lilac text-white shadow-[0_0_40px_rgba(168,85,247,0.5)] hover:brightness-125 hover:scale-105 transition-all flex items-center justify-center gap-3 border border-white/40 uppercase"
              >
                {isGenerating ? <Loader2 className="animate-spin" /> : <><Wand2 className="w-5 h-5" /> GENERAR ✨</>}
              </button>

              <button
                onClick={handleDownload}
                style={{
                  backgroundColor: '#4a1040',
                  pointerEvents: (result.url && !isGenerating && !isImageLoading) ? 'auto' : 'none'
                }}
                className="w-full py-4 rounded-xl font-black text-xs tracking-[0.2em] text-white hover:brightness-125 transition-all flex items-center justify-center gap-2 border border-white/20 uppercase shadow-[0_0_20px_rgba(74,16,64,0.5)] cursor-pointer"
              >
                <Download className="w-4 h-4" /> DESCARGAR
              </button>
            </div>
            
            <a
              href="https://labs.google/fx/es/tools/music-fx"
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 rounded-xl font-black text-xs tracking-[0.4em] bg-white/5 text-white hover:bg-lilac/20 hover:text-lilac transition-all flex items-center justify-center gap-3 border border-white/10 uppercase shadow-[0_0_30px_rgba(255,255,255,0.05)] group cursor-pointer"
            >
              <Music2 className="w-5 h-5 group-hover:scale-110 transition-transform" /> MAGIA MUSICAL 🎵
            </a>
          </div>
        </motion.div>

        {/* Panel de Resultado - Perfectly Aligned */}
        <div className="glass-panel">
          <div id="result-container" className="image-placeholder mb-6 overflow-hidden relative">
            {isGenerating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg/60 backdrop-blur-xl z-20">
                <div className="w-16 h-16 border-4 border-lilac/30 border-t-lilac rounded-full animate-spin mb-4" />
                <p className="text-lilac font-black tracking-[0.3em] animate-pulse uppercase text-[10px]">CREANDO...</p>
              </div>
            ) : result.url ? (
              <>
                {isImageLoading && (
                   <p id="loading-text" style={{ color: 'rgba(255,255,255,0.5)' }} className="text-sm font-serif italic">Tu obra aparecerá aquí...</p>
                )}
                <motion.img
                  id="ai-result-img"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isImageLoading ? 0 : 1 }}
                  src={result.url}
                  alt="AI Result"
                  onLoad={() => setIsImageLoading(false)}
                  className="w-full h-full object-cover rounded-[15px]"
                  style={{ display: isImageLoading ? 'none' : 'block' }}
                />
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-lilac/5 border border-lilac/10 flex items-center justify-center mb-4">
                  <Wand2 className="w-8 h-8 text-lilac/20" />
                </div>
                <p className="text-lilac/30 font-serif italic text-sm">Tu obra aparecerá aquí...</p>
              </div>
            )}
          </div>
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

      {/* Background Audio for Wow Factor */}
      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" />
      
      {/* Music Result Overlay */}
      <AnimatePresence>
        {musicResult && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-8 py-4 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl text-center"
          >
            <p className="text-lilac text-[10px] font-black tracking-widest uppercase mb-1">Concepto Sonoro</p>
            <p className="text-white text-sm font-serif italic max-w-md">"{musicResult}"</p>
            <button 
              onClick={() => setMusicResult('')}
              className="mt-3 text-[10px] text-white/40 hover:text-white transition-colors"
            >
              CERRAR
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
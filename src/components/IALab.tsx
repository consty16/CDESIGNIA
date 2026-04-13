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

  const handleMusicMagic = async () => {
    if (!userPrompt.trim()) return;
    setIsComposingMusic(true);
    setMusicResult('');

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        setMusicResult('API Key no configurada. Agregá VITE_GEMINI_API_KEY en las variables de entorno.');
        return;
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Basado en este concepto visual: '${userPrompt}', describí en una sola frase corta, poética y de alta gama cómo suena su banda sonora. Usá términos de instrumentos y ambiente de lujo. En español.`
              }]
            }],
            generationConfig: {
              maxOutputTokens: 150,
              temperature: 0.9
            }
          })
        }
      );

      const data = await response.json();
      console.log('Gemini Music Response:', JSON.stringify(data, null, 2));

      if (data.error) {
        setMusicResult(`Error de API: ${data.error.message}`);
        return;
      }

      // Buscar el texto en cualquier posición de parts (compatibilidad con modelos thinking)
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const textPart = parts.find((p: any) => p.text && !p.thought);
      const text = textPart?.text || parts[parts.length - 1]?.text || 'No se pudo generar la composición.';
      const cleanText = text.trim();
      setMusicResult(cleanText);

      // WOW FACTOR: Música de ambiente + Voz de lujo
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log('Audio playback blocked by browser', e));
      }

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Parar cualquier voz anterior
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'es-ES';
        utterance.rate = 0.9;
        utterance.volume = 1;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error en Gemini Music:', error);
      setMusicResult('Error al conectar con la IA musical. Verificá tu API Key.');
    } finally {
      setIsComposingMusic(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a0b2e] font-sans text-white p-4 md:p-8 overflow-hidden relative">
      {/* Vibrant Creative Blobs */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#5c1a5c]/20 blur-[180px] rounded-full animate-pulse z-0" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[#3b0f6b]/20 blur-[180px] rounded-full animate-pulse-slow z-0" />
      <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-white/5 blur-[150px] rounded-full z-0" />

      <nav className="relative z-10 mb-10 flex justify-between items-center max-w-5xl mx-auto">
        <a href="/" className="flex items-center gap-2 text-white/50 hover:text-lilac transition-all group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1" />
          <span className="text-[10px] uppercase tracking-widest font-black">VOLVER</span>
        </a>
        <div className="text-right">
          <h1 className="text-4xl md:text-6xl font-orbitron font-black text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.6)] mb-1">
            C DESIGN <span className="text-lilac drop-shadow-[0_0_20px_rgba(168,85,247,0.7)]">LAB</span>
          </h1>
          <p className="text-[10px] md:text-xs text-lilac/80 uppercase tracking-[0.5em] font-bold">Digital Fashion Masterpiece</p>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Panel de Control - More Compact & Vivid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-3xl bg-white/10 border border-white/20 rounded-3xl p-6 md:p-8 shadow-[0_0_80px_rgba(0,0,0,0.3)] space-y-6"
        >
          <div className="text-center space-y-2">
            <h3 className="text-[10px] font-black text-white tracking-[0.4em] uppercase flex items-center justify-center gap-4">
              <span className="w-6 h-[1px] bg-white/20" />
              1. Tu Obra Maestra
              <span className="w-6 h-[1px] bg-white/20" />
            </h3>
            <p className="text-white/40 text-[8px] uppercase tracking-widest font-bold">IA Generative Engine</p>
          </div>
          
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Describe tu visión aquí..."
            className="w-full h-32 bg-gradient-to-br from-[#5c1a5c] to-[#3a0e3a] border border-lilac/50 rounded-2xl p-5 text-white text-base placeholder-white/30 focus:ring-4 focus:ring-lilac/30 outline-none transition-all resize-none font-light leading-snug"
          />
          
          <div className="space-y-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !userPrompt.trim()}
              className="w-full py-4 rounded-xl font-black text-xs tracking-[0.4em] bg-lilac text-bg-tertiary shadow-[0_0_40px_rgba(168,85,247,0.5)] hover:bg-white hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-30 border border-white/40 uppercase"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : <><Wand2 className="w-5 h-5" /> GENERAR ✨</>}
            </button>
            
            <button
              onClick={handleMusicMagic}
              disabled={isComposingMusic || !userPrompt.trim()}
              className="w-full py-4 rounded-xl font-black text-xs tracking-[0.4em] bg-white/5 text-white hover:bg-lilac/20 hover:text-lilac transition-all flex items-center justify-center gap-3 border border-white/10 uppercase shadow-[0_0_30px_rgba(255,255,255,0.05)] group"
            >
              {isComposingMusic ? <Loader2 className="animate-spin" /> : <><Music2 className="w-5 h-5 group-hover:scale-110 transition-transform" /> MAGIA MUSICAL 🎵</>}
            </button>
          </div>
        </motion.div>

        {/* Panel de Resultado - Perfectly Aligned */}
        <div className="flex flex-col gap-6">
          <div className="relative aspect-square bg-black/40 rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl group">
            {isGenerating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg/60 backdrop-blur-xl z-20">
                <div className="w-16 h-16 border-4 border-lilac/30 border-t-lilac rounded-full animate-spin mb-4" />
                <p className="text-lilac font-black tracking-[0.3em] animate-pulse uppercase text-[10px]">CREANDO...</p>
              </div>
            ) : result ? (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={result.url}
                alt="AI Result"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-lilac/5 border border-lilac/10 flex items-center justify-center mb-4">
                  <Wand2 className="w-8 h-8 text-lilac/20" />
                </div>
                <p className="text-lilac/30 font-serif italic text-sm">El arte aparecerá aquí...</p>
              </div>
            )}
          </div>
          
          {result && !isGenerating && (
            <motion.a 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              href={result.url} 
              target="_blank" 
              rel="noreferrer" 
              className="w-full py-4 rounded-xl bg-gradient-to-br from-[#3b0f6b] to-[#240842] text-white text-center font-black text-xs tracking-[0.4em] shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:brightness-125 transition-all border border-lilac/30 uppercase"
            >
              DESCARGAR OBRA 📥
            </motion.a>
          )}
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
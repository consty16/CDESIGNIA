import React, { useState, useEffect } from 'react';
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
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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
    <div className="min-h-screen bg-bg font-sans text-white p-4 md:p-8 overflow-hidden">
      <nav className="relative z-10 mb-10 flex justify-between items-center max-w-5xl mx-auto">
        <a href="/" className="flex items-center gap-2 text-purple-400 hover:text-white transition-all group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Volver</span>
        </a>
        <div className="text-right">
          <h1 className="text-3xl md:text-5xl font-serif italic uppercase tracking-tighter text-purple-300" style={{ textShadow: '0 0 10px #a855f7, 0 0 30px #a855f7, 0 0 60px #7c3aed' }}>C DESIGN LAB</h1>
          <p className="text-[9px] text-purple-500 mt-1 uppercase tracking-[0.4em]">Digital Fashion Masterpiece</p>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Panel de Control */}
        <div className="backdrop-blur-3xl bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl space-y-5">
          <div className="text-center space-y-2">
            <h3 className="text-[10px] font-bold text-purple-300 uppercase tracking-[0.5em]">1. Describe tu obra maestra</h3>
            <p className="text-white/30 text-[9px] uppercase tracking-widest">IA Generative Engine</p>
          </div>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Ej: Extremely beautiful model, iridescent gown, symmetrical face, 8k..."
            className="w-full h-40 bg-gradient-to-br from-[#5c1a5c] to-[#3a0e3a] border border-lilac/30 rounded-xl p-4 text-white placeholder-white/40 focus:ring-2 focus:ring-lilac focus:border-transparent outline-none transition-all resize-none mb-4 shadow-inner"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !userPrompt.trim()}
            className="w-full py-5 rounded-xl font-bold text-sm tracking-[0.3em] bg-lilac text-bg-tertiary shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:brightness-125 hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-40 border-2 border-white/50"
          >
            {isGenerating ? <Loader2 className="animate-spin" /> : <><Wand2 className="w-5 h-5" /> EXPERIMENT PROGRESS ✨</>}
          </button>
          
          <a
            href="https://musicfx.withgoogle.com/dj"
            target="_blank"
            rel="noreferrer"
            className="w-full mt-4 py-5 rounded-xl font-bold text-sm tracking-[0.3em] bg-bg-tertiary text-lilac shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:brightness-150 hover:text-white transition-all flex items-center justify-center gap-3 border border-lilac/30 uppercase"
          >
            <Music2 className="w-5 h-5" /> hagamos magia MUSICAL 🎵
          </a>
        </div>

        {/* Panel de Resultado Lateral */}
        <div className="w-full flex justify-center">
          <AnimatePresence mode="wait">
            {showResults && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 max-w-[380px] w-full">
                <div className="relative w-full h-auto rounded-2xl border border-purple-500/30 overflow-hidden bg-black flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.1)] min-h-[400px]">
                  {isImageLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10">
                      <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
                      <p className="text-[10px] text-purple-300 uppercase tracking-widest animate-pulse font-bold text-center px-4">Materializando visión de alta gama...</p>
                    </div>
                  )}
                  <img 
                    src={result.url} 
                    className={`w-full h-auto object-contain transition-opacity duration-1000 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                    alt="C DESIGN LAB Result" 
                    onLoad={() => setIsImageLoading(false)}
                    onError={() => {
                        setIsImageLoading(false);
                        setResult(prev => ({ ...prev, error: true }));
                    }}
                  />
                </div>
                <div className="space-y-4">
                  <a href={result.url} target="_blank" rel="noreferrer" className="block w-full py-3 rounded-full bg-lilac text-bg-tertiary text-center font-bold text-[10px] tracking-[0.3em] shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:bg-lilac-dim transition-all">
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
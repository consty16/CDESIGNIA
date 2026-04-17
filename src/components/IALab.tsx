import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, ChevronLeft, Download, RefreshCw, Image as ImageIcon, Music2 } from 'lucide-react';

const WAITING_MESSAGES = [
  "C DESIGN LAB está conceptualizando tu idea...",
  "Sintetizando texturas de alta costura...",
  "Nuestra IA está diseñando tu visión...",
  "Renderizando obra maestra 8K...",
  "Analizando estructura visual Antigravity...",
  "Procesando transformación en la nube...",
];

export const IALab = () => {
  const [userPrompt, setUserPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState({ url: '', advice: '', ready: false, error: false });
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

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
    setStatusMsg('');

    try {
      // POLLINATIONS GENERATION LOGIC - UNTOUCHED
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
      console.error("Engine Error:", e);
      setResult(prev => ({ ...prev, ready: true, error: true }));
      setStatusMsg("Error de conexión con el motor visual.");
      setShowResults(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!result.url || isGenerating || isImageLoading) return;
    try {
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = result.url;
      a.download = `C_DESIGN_LAB_Original_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      window.open(result.url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-bg-tertiary font-sans text-white p-4 md:p-8 overflow-hidden relative">
      {/* Dynamic Background */}
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
          <p className="font-serif text-lg md:text-2xl italic tracking-wide" style={{ color: '#9333ea' }}>
            Digital Fashion Masterpiece
          </p>
        </div>
      </nav>

      <div className="ia-lab-wrapper max-w-5xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel de Control */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel"
        >
          <div className="space-y-6">
            <div className="prompt-zone">
              <label className="text-[10px] font-black text-white/60 tracking-widest uppercase mb-3 block">
                Describe tu visión
              </label>
              <div className="input-area rounded-xl overflow-hidden" style={{ backgroundColor: '#3b1566' }}>
                <textarea
                  id="ag-prompt"
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="Ej: Un vestido de gala hecho de luz estelar..."
                  rows={14}
                  className="w-full bg-transparent border-none p-5 text-white text-base placeholder-white/30 focus:ring-0 outline-none transition-all resize-none font-light leading-snug"
                />
              </div>
            </div>

            <div className="action-zone space-y-4">
              <button
                id="ag-btn-render"
                onClick={handleGenerate}
                disabled={isGenerating || !userPrompt.trim()}
                className="w-full py-5 rounded-xl font-black text-xs tracking-[0.4em] bg-lilac text-white shadow-[0_0_40px_rgba(168,85,247,0.5)] hover:brightness-125 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/40 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <Loader2 className="animate-spin w-6 h-6" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    GENERAR IMAGEN
                  </>
                )}
              </button>

              {statusMsg && (
                <p className="text-center text-[10px] uppercase tracking-widest font-bold opacity-60 animate-pulse">
                  {statusMsg}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Panel de Resultado */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel flex flex-col"
        >
          <div className="mb-3">
            <h3 className="text-[10px] font-black text-white/40 tracking-[0.4em] uppercase text-center lg:text-left">Resultado Final</h3>
          </div>

          <div className="flex-1 min-h-[400px] relative rounded-2xl overflow-hidden bg-black/20 border border-white/5 group">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-3xl z-20"
                >
                  <div className="w-16 h-16 border-4 border-lilac/30 border-t-lilac rounded-full animate-spin mb-6" />
                  <p className="text-lilac font-black tracking-[0.2em] animate-pulse uppercase text-[10px]">
                    Sintetizando...
                  </p>
                </motion.div>
              ) : result.url ? (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full"
                >
                  <img
                    id="ag-result-preview"
                    src={result.url}
                    alt="AI Transformation Result"
                    className="w-full h-full object-cover"
                    onLoad={() => setIsImageLoading(false)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                    <button
                      onClick={handleDownload}
                      className="bg-white text-black py-3 px-6 rounded-full font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-lilac hover:text-white transition-colors"
                    >
                      <Download className="w-4 h-4" /> Descargar Obra Maestra
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center opacity-30">
                  <ImageIcon className="w-20 h-20 mb-6 text-lilac" />
                  <p className="font-serif italic text-lg capitalize">Tu visión aparecerá aquí</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <a
              href="https://labs.google/fx/es/tools/music-fx"
              target="_blank"
              rel="noreferrer"
              className="py-4 rounded-xl font-black text-[10px] tracking-[0.2em] bg-white/5 text-white hover:bg-lilac transition-all flex items-center justify-center gap-2 border border-white/10 uppercase"
            >
              <Music2 className="w-4 h-4" /> Banda Sonora
            </a>
            <button
              onClick={() => {
                setResult({ url: '', advice: '', ready: false, error: false });
                setUserPrompt('');
                setStatusMsg('');
              }}
              className="py-4 rounded-xl font-black text-[10px] tracking-[0.2em] bg-white/5 text-white hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 border border-white/10 uppercase"
            >
              <RefreshCw className="w-4 h-4" /> Resetear
            </button>
          </div>
        </motion.div>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[6000] flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl px-6 text-center"
          >
            <div className="relative">
              <Loader2 className="w-32 h-32 text-purple-600 animate-spin" />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-white animate-pulse" />
            </div>
            <motion.p
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-serif italic text-white mt-12 max-w-2xl"
            >
              "{WAITING_MESSAGES[currentMessage]}"
            </motion.p>
            <p className="mt-4 text-[10px] text-white/40 tracking-[0.5em] font-black uppercase">Antigravity Engine Active</p>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" />
    </div>
  );
};
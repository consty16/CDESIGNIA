import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, Loader2, ChevronLeft, Download, Send } from 'lucide-react';

const WAITING_MESSAGES = [
  "C DESIGN LAB está conceptualizando tu idea...",
  "Sintetizando texturas de alta costura...",
  "Nuestra IA está diseñando tu visión...",
  "Renderizando obra maestra 8K...",
];

interface LabResult {
  url: string | null;
  advice: string | null;
  tags: string[];
  ready: boolean;
  error: boolean;
}

export const IALab = () => {
  const [userPrompt, setUserPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<LabResult>({ url: null, advice: null, tags: [], ready: false, error: false });

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
    setResult({ url: null, advice: null, tags: [], ready: false, error: false });

    try {
      const stylePreset = 'high-end fashion editorial, cinematic lighting, ultra-realistic, 8k, purple and lila neon accents, C DESIGN LAB luxury aesthetic';
      const fullPrompt = `${userPrompt}, ${stylePreset}`;
      const randomSeed = Math.floor(Math.random() * 1000000);
      
      // Usamos el endpoint estable de Pollinations sin forzar un modelo específico si falla
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=1080&height=1350&nologo=true&seed=${randomSeed}`;

      setResult({
        url: imageUrl,
        advice: `C DESIGN LAB ha sintetizado tu visión "${userPrompt}" bajo nuestra estética luxury para crear esta pieza exclusiva.`,
        tags: ['c-design-lab', 'luxury', 'editorial', 'haute-couture', '8k'],
        ready: true,
        error: false
      });

      setShowResults(true);
      // No cerramos isGenerating aquí, lo haremos cuando la imagen cargue en el modal o falle
    } catch (e: any) {
      console.error('C Design Lab Error:', e);
      setResult(prev => ({ ...prev, ready: true, error: true }));
      setShowResults(true);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep font-sans text-text-primary p-6 md:p-12 overflow-x-hidden flex flex-col">

      <nav className="relative z-10 mb-12 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2 text-lilac-glow hover:text-white transition-colors group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Volver</span>
        </Link>
        <div className="text-right">
          <h1 className="text-3xl md:text-6xl font-serif italic text-white uppercase tracking-tighter">C DESIGN LAB</h1>
          <p className="text-[10px] text-lilac-neon mt-2 uppercase tracking-widest font-medium">IA · Premium Edition</p>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-2xl relative z-10">
          <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-focus-within:opacity-20 transition-opacity">
              <Sparkles className="w-12 h-12 text-lilac-glow" />
            </div>
            
            <h3 className="text-[10px] font-bold text-lilac-glow mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="w-8 h-px bg-lilac-glow/30" />
              Describe tu Visión
            </h3>
            
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Ej: futuristic goddess in purple silk, bioluminescent details, high fashion, ethereal atmosphere..."
              className="w-full h-64 bg-white/5 border border-white/10 rounded-2xl p-8 text-lg text-white placeholder:text-white/20 focus:outline-none focus:border-lilac-neon transition-all resize-none mb-10 font-light leading-relaxed backdrop-blur-sm"
            />
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !userPrompt.trim()}
              className="w-full py-6 rounded-2xl text-[11px] font-bold tracking-[0.4em] text-white bg-gradient-to-r from-lilac-neon to-purple-700 disabled:opacity-20 hover:brightness-110 active:scale-[0.98] transition-all uppercase shadow-[0_0_40px_rgba(168,85,247,0.2)] flex items-center justify-center gap-4 group/btn"
            >
              {isGenerating ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                  CREAR ALTA COSTURA DIGITAL ✨
                </>
              )}
            </button>
            
            <p className="mt-8 text-[9px] text-white/30 text-center uppercase tracking-widest leading-loose">
              TIP: ESCRIBÍ EN INGLÉS PARA RESULTADOS DE ÉLITE
            </p>
          </div>
          
          {/* Subtle decorative background glow */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full -z-10 animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-lilac-neon/10 blur-[120px] rounded-full -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </main>

      {/* Modal de resultados */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-3xl overflow-y-auto"
          >
            <div className="w-full max-w-2xl flex flex-col items-center py-12 gap-8">

              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-serif italic text-white uppercase tracking-[0.2em]">C DESIGN LAB ✨</h2>
                <p className="text-[10px] text-lilac-neon uppercase tracking-[0.5em] mt-3 italic">Digital Fashion Masterpiece</p>
              </div>

              {/* Contenedor de resultado h-auto */}
              <div className="w-full rounded-[2.5rem] border border-lilac-neon/30 shadow-[0_0_80px_rgba(168,85,247,0.2)] overflow-hidden bg-black/50 h-auto relative min-h-[400px] flex items-center justify-center">
                {result.url && (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: isGenerating ? 0 : 1, scale: isGenerating ? 0.95 : 1 }}
                    src={result.url}
                    onLoad={() => setIsGenerating(false)}
                    onError={() => {
                      setResult(prev => ({ ...prev, error: true }));
                      setIsGenerating(false);
                    }}
                    className="w-full h-auto object-contain"
                    alt="C DESIGN LAB Result"
                  />
                )}
                
                {isGenerating && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md z-10">
                    <Loader2 className="w-12 h-12 text-lilac-neon animate-spin mb-4" />
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] animate-pulse">Finalizando Obra...</p>
                  </div>
                )}

                {result.error && (
                  <div className="flex flex-col items-center justify-center p-12 text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                       <span className="text-2xl">⚠️</span>
                    </div>
                    <p className="text-xs text-red-400 uppercase tracking-[0.3em] max-w-xs leading-relaxed">
                      El servidor de alta costura no responde. <br/> Intentá con una descripción más corta o probá de nuevo.
                    </p>
                    <button 
                      onClick={handleGenerate}
                      className="mt-4 px-6 py-2 border border-white/10 rounded-full text-[9px] text-white/40 uppercase tracking-widest hover:bg-white/5 transition-colors"
                    >
                      Reintentar Generación
                    </button>
                  </div>
                )}
              </div>

              {/* Advice */}
              {result.advice && (
                <div className="w-full backdrop-blur-2xl bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] relative">
                  <div className="absolute top-6 right-8 opacity-20">
                    <Sparkles className="w-5 h-5 text-lilac-neon" />
                  </div>
                  <h3 className="text-[9px] uppercase tracking-[0.5em] text-white/30 font-bold mb-4">Designer's Note</h3>
                  <p className="text-base font-serif text-white/80 leading-relaxed italic">"{result.advice}"</p>
                </div>
              )}

              {/* Botones */}
              <div className="flex flex-col gap-4 w-full">
                {result.url && (
                  <motion.a
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-6 rounded-2xl font-bold text-[11px] text-white bg-lilac-neon shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-[0.4em] flex items-center justify-center gap-3"
                  >
                    <Download className="w-4 h-4" /> DESCARGAR OBRA
                  </motion.a>
                )}
                <button
                  onClick={() => setShowResults(false)}
                  className="text-[10px] text-white/30 uppercase tracking-[0.5em] hover:text-white transition-colors py-4 text-center"
                >
                  Continuar Creando
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/98 backdrop-blur-3xl">
            <div className="text-center space-y-12 p-10 max-w-lg">
              <div className="relative w-32 h-32 mx-auto">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-t-2 border-r-2 border-lilac-neon rounded-full"
                />
                <Loader2 className="absolute inset-0 m-auto w-12 h-12 text-lilac-neon animate-spin" />
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-purple-400 animate-pulse" />
              </div>
              <motion.p 
                key={currentMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-2xl md:text-4xl font-serif italic text-white tracking-wide"
              >
                {WAITING_MESSAGES[currentMessage]}
              </motion.p>
              <div className="space-y-2">
                <div className="w-48 h-px bg-white/10 mx-auto" />
                <p className="text-[10px] text-white/20 uppercase tracking-[0.6em]">C DESIGN LAB HIGH-END IA</p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Sparkles, Loader2, ChevronLeft, Download, Send } from 'lucide-react';

const assetFiles = import.meta.glob('../assets/*.{png,jpg,jpeg,svg,webp}', { eager: true, as: 'url' });

const getAssetUrl = (name: string) => {
  const path = Object.keys(assetFiles).find(key => key.endsWith(`/${name}`));
  return path ? (assetFiles[path] as string) : '';
};

const CATEGORIES = [
  { id: 'MÁSCARAS', label: 'MÁSCARAS', icon: '🎭' },
  { id: 'MAQUILLAJE', label: 'MAQUILLAJE', icon: '💄' },
  { id: 'VESTIDOS', label: 'VESTIDOS', icon: '👗' },
];

const MOCK_GALLERY: Record<string, string[]> = {
  MÁSCARAS: [
    getAssetUrl('1.png'), getAssetUrl('2.png'), getAssetUrl('3.png'), getAssetUrl('4.png'),
    getAssetUrl('5.png'), getAssetUrl('6.png'), getAssetUrl('7.png'), getAssetUrl('8.png'),
    getAssetUrl('9.png'), getAssetUrl('10.png'), getAssetUrl('11.png'), getAssetUrl('12.png')
  ],
  VESTIDOS: [
    getAssetUrl('13.png'), getAssetUrl('14.png'), getAssetUrl('15.png'), getAssetUrl('16.png'),
    getAssetUrl('17.png'), getAssetUrl('18.png'), getAssetUrl('19.png'), getAssetUrl('20.png'),
    getAssetUrl('21.png'), getAssetUrl('22.png'), getAssetUrl('23.png'), getAssetUrl('24.png')
  ],
  MAQUILLAJE: [
    getAssetUrl('25.png'), getAssetUrl('26.png'), getAssetUrl('27.png'), getAssetUrl('28.png'),
    getAssetUrl('29.png'), getAssetUrl('30.png'), getAssetUrl('31.png'), getAssetUrl('32.png'),
    getAssetUrl('33.png'), getAssetUrl('34.png'), getAssetUrl('35.png'), getAssetUrl('36.png')
  ]
};

const WAITING_MESSAGES = [
  "C DESIGN IA está conceptualizando tu idea...",
  "Sintetizando texturas de alta costura...",
  "Nuestra IA está diseñando tu visión...",
  "Renderizando obra maestra 8K...",
];

interface GeminiResult {
  url: string | null;
  advice: string | null;
  tags: string[];
  ready: boolean;
  error: boolean;
}

export const IALab = () => {
  const [activeCategory, setActiveCategory] = useState('MÁSCARAS');
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<GeminiResult>({ url: null, advice: null, tags: [], ready: false, error: false });

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
    if (!selectedAsset || !userPrompt.trim()) return;

    setIsGenerating(true);
    setShowResults(false);
    setResult({ url: null, advice: null, tags: [], ready: false, error: false });

    try {
      const categoryStyles: Record<string, string> = {
        'MÁSCARAS': 'wearing an ornate venetian mask, masquerade ball, mysterious, dramatic lighting',
        'MAQUILLAJE': 'artistic editorial makeup, beauty campaign, high fashion, neon glow',
        'VESTIDOS': 'wearing luxury evening gown, haute couture, runway fashion, studio lighting'
      };

      const fullPrompt = `${userPrompt}, ${categoryStyles[activeCategory]}, ultra realistic, 8k, editorial photography, lila purple aesthetics, C DESIGN IA editorial`;

      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=768&height=768&nologo=true&model=flux&seed=${Date.now()}`;

      setResult({
        url: imageUrl,
        advice: `C DESIGN IA ha fusionado tu visión "${userPrompt}" con la estética ${activeCategory.toLowerCase()} para crear esta pieza única de alta costura digital.`,
        tags: [activeCategory.toLowerCase(), 'c-design-ia', 'editorial', 'haute-couture', 'flux'],
        ready: true,
        error: false
      });

      setShowResults(true);

      // Precargar imagen
      const img = new Image();
      img.src = imageUrl;

    } catch (e: any) {
      console.error('Nova Lab Error:', e);
      setResult(prev => ({ ...prev, ready: true, error: true }));
      setShowResults(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep font-sans text-text-primary p-6 md:p-12 overflow-x-hidden">
      <nav className="relative z-10 mb-12 flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-lilac-glow hover:text-white transition-colors group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Volver</span>
        </Link>
        <div className="text-right">
          <h1 className="text-3xl md:text-6xl font-serif italic text-white uppercase tracking-tighter">C DESIGN LAB</h1>
          <p className="text-[10px] text-lilac-neon mt-2 uppercase tracking-widest font-medium">IA · Premium Edition</p>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
            <h3 className="text-[10px] font-bold text-lilac-glow mb-6 uppercase tracking-[0.3em]">1. Selecciona tu Referencia de Estilo</h3>
            <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSelectedAsset(null); }}
                  className={cn(
                    "px-8 py-3 text-[10px] font-bold rounded-xl border transition-all duration-500 uppercase tracking-widest shrink-0",
                    activeCategory === cat.id
                      ? "bg-lilac-neon border-lilac-neon text-white shadow-[0_0_20px_#a855f7]"
                      : "bg-transparent border-white/5 text-white/30 hover:border-white/20 hover:text-white"
                  )}
                >
                  <span className="mr-2">{cat.icon}</span>{cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {MOCK_GALLERY[activeCategory].map((src, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedAsset(src)}
                  className={cn(
                    "aspect-square rounded-3xl overflow-hidden cursor-pointer border-2 transition-all relative group",
                    selectedAsset === src ? "border-lilac-neon shadow-[0_0_25px_#a855f7]" : "border-white/5 hover:border-white/20"
                  )}
                >
                  <img src={src} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" alt="Asset" />
                  {selectedAsset === src && (
                    <div className="absolute top-2 right-2 bg-lilac-neon rounded-full p-1.5 border border-white/20">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative group overflow-hidden">
            <h3 className="text-[10px] font-bold text-lilac-glow mb-8 uppercase tracking-[0.3em]">2. Describe tu Visión</h3>

            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Ej: Una modelo en una pasarela futurista de neón, usando este diseño con acabados de cristal y seda plateada..."
              className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-lilac-neon transition-colors resize-none mb-8 font-light leading-relaxed"
            />

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedAsset || !userPrompt.trim()}
              className="w-full py-5 rounded-2xl text-[10px] font-bold tracking-[0.3em] text-white bg-gradient-to-r from-lilac-neon to-purple-700 disabled:opacity-20 hover:brightness-110 active:scale-95 transition-all uppercase shadow-xl relative z-10 flex items-center justify-center gap-3"
            >
              {isGenerating ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>
                  <Send className="w-4 h-4" /> GENERAR CON C DESIGN IA ✨
                </>
              )}
            </button>

            <p className="mt-6 text-[9px] text-white/30 text-center uppercase tracking-widest leading-loose">
              Nuestra IA combinará tu descripción con la estética del diseño seleccionado para crear una pieza única.
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl overflow-y-auto"
          >
            <div className="w-full max-w-xl flex flex-col items-center py-10">
              <h2 className="text-3xl font-serif italic text-white mb-2 text-center uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">C DESIGN LAB ✨</h2>
              <p className="text-[10px] text-lilac-neon uppercase tracking-[0.4em] mb-10 text-center italic">Digital Fashion Creation</p>

              <div className="w-full max-h-[70vh] aspect-square md:aspect-auto md:h-[60vh] rounded-[2.5rem] border border-lilac-neon shadow-[0_0_60px_rgba(168,85,247,0.4)] relative bg-black/50 group flex items-center justify-center p-4 md:p-10">
                {result.url && (
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={result.url}
                    className="max-w-full max-h-full object-contain shadow-2xl rounded-xl"
                    alt="C DESIGN LAB Result"
                  />
                )}
                {!result.url && !result.error && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-lilac-neon animate-spin" />
                  </div>
                )}
                {result.error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/80 backdrop-blur-md">
                    <p className="text-xs text-lilac-neon uppercase tracking-[0.2em] mb-4">Aviso de Nova</p>
                    <p className="text-sm text-white/80 uppercase tracking-widest font-light leading-relaxed">
                      Nova está ajustando los detalles finales,<br />intenta de nuevo.
                    </p>
                    <button onClick={() => setShowResults(false)} className="mt-8 px-6 py-2 border border-white/10 rounded-full text-[10px] uppercase tracking-widest hover:bg-white/5 transition-colors">Volver a intentar</button>
                  </div>
                )}
              </div>

              <div className="mt-10 text-center space-y-6 w-full max-w-md">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl relative overflow-hidden group shadow-xl">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="w-6 h-6 text-lilac-neon" />
                  </div>
                  <h3 className="text-[9px] uppercase tracking-[0.4em] text-white/40 font-bold mb-4">Análisis del Diseñador</h3>
                  <p className="text-xl font-serif text-white/90 leading-relaxed italic">
                    "{result.advice || 'C DESIGN IA está analizando la composición...'}"
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  {result.tags.map((tag, i) => (
                    <span key={i} className="px-4 py-1.5 bg-white/5 border border-white/5 rounded-full text-[8px] uppercase tracking-[0.2em] text-white/30 hover:text-lilac-neon transition-colors">
                      # {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-4 mt-8">
                  {result.url && (
                    <motion.a
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-5 rounded-2xl font-bold text-xs text-white bg-lilac-neon hover:bg-lilac-glow shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3 relative z-[2010]"
                    >
                      <Download className="w-4 h-4" /> DESCARGAR LOOK
                    </motion.a>
                  )}
                  <button onClick={() => setShowResults(false)} className="text-[9px] text-white/20 uppercase tracking-[0.4em] hover:text-white transition-colors">Cerrar C DESIGN LAB</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isGenerating && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/90 backdrop-blur-xl">
            <div className="text-center space-y-8">
              <div className="relative w-24 h-24 mx-auto">
                <Loader2 className="w-24 h-24 text-lilac-neon animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-lilac-glow animate-pulse" />
              </div>
              <p className="text-2xl font-serif italic text-lilac-glow animate-pulse tracking-wide">
                {WAITING_MESSAGES[currentMessage]}
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
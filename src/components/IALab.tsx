import React, { useState, useEffect } from 'react';
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
  const [activeCategory, setActiveCategory] = useState('MÁSCARAS');
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
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

      const fullPrompt = `${userPrompt}, ${categoryStyles[activeCategory]}, ultra realistic, 8k, editorial photography, lila purple aesthetics, C DESIGN LAB editorial style, cinematic, hyperdetailed`;

      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=1080&height=1350&nologo=true&model=flux&seed=${Date.now()}`;

      setResult({
        url: imageUrl,
        advice: `C DESIGN LAB ha fusionado tu visión "${userPrompt}" con la estética ${activeCategory.toLowerCase()} para crear esta pieza única de alta costura digital.`,
        tags: [activeCategory.toLowerCase(), 'c-design-lab', 'editorial', 'haute-couture', 'flux'],
        ready: true,
        error: false
      });

      setShowResults(true);

      const img = new Image();
      img.src = imageUrl;

    } catch (e: any) {
      console.error('C Design Lab Error:', e);
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

        {/* Galería */}
        <div className="lg:col-span-8 space-y-8">
          <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
            <h3 className="text-[10px] font-bold text-lilac-glow mb-6 uppercase tracking-[0.3em]">1. Selecciona tu Referencia de Estilo</h3>
            <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
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
                  <img src={src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Asset" />
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

        {/* Panel prompt */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
            <h3 className="text-[10px] font-bold text-lilac-glow mb-8 uppercase tracking-[0.3em]">2. Describe tu Visión</h3>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Ej: blonde woman with silver jewelry, dark mysterious atmosphere, luxury fashion editorial, dramatic shadows..."
              className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-lilac-neon transition-colors resize-none mb-8 font-light leading-relaxed"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedAsset || !userPrompt.trim()}
              className="w-full py-5 rounded-2xl text-[10px] font-bold tracking-[0.3em] text-white bg-gradient-to-r from-lilac-neon to-purple-700 disabled:opacity-20 hover:brightness-110 active:scale-95 transition-all uppercase shadow-xl flex items-center justify-center gap-3"
            >
              {isGenerating ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <><Send className="w-4 h-4" /> GENERAR EN C DESIGN LAB ✨</>
              )}
            </button>
            <p className="mt-6 text-[9px] text-white/30 text-center uppercase tracking-widest leading-loose">
              Tip: escribí en inglés para mejores resultados
            </p>
          </div>
        </div>
      </div>

      {/* Modal de resultados */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl overflow-y-auto"
          >
            <div className="w-full max-w-2xl flex flex-col items-center py-8 gap-6">

              <div className="text-center">
                <h2 className="text-2xl font-serif italic text-white uppercase tracking-widest">C DESIGN LAB ✨</h2>
                <p className="text-[9px] text-lilac-neon uppercase tracking-[0.4em] mt-2 italic">Digital Fashion Creation</p>
              </div>

              {/* Imagen completa sin recorte */}
              <div className="w-full rounded-[2rem] border border-lilac-neon/40 shadow-[0_0_60px_rgba(168,85,247,0.3)] overflow-hidden bg-black/50">
                {result.url && (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={result.url}
                    className="w-full h-auto object-contain"
                    alt="C DESIGN LAB Result"
                  />
                )}
                {!result.url && !result.error && (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-10 h-10 text-lilac-neon animate-spin" />
                  </div>
                )}
                {result.error && (
                  <div className="flex items-center justify-center h-64 p-8 text-center">
                    <p className="text-xs text-red-400 uppercase tracking-widest">Error generando imagen. Intentá de nuevo.</p>
                  </div>
                )}
              </div>

              {/* Advice */}
              {result.advice && (
                <div className="w-full backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-3xl relative">
                  <div className="absolute top-4 right-4 opacity-20">
                    <Sparkles className="w-5 h-5 text-lilac-neon" />
                  </div>
                  <h3 className="text-[9px] uppercase tracking-[0.4em] text-white/40 font-bold mb-3">Análisis del Diseñador</h3>
                  <p className="text-sm font-serif text-white/90 leading-relaxed italic">"{result.advice}"</p>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 justify-center">
                {result.tags.map((tag, i) => (
                  <span key={i} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[8px] uppercase tracking-widest text-white/40">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Botones */}
              <div className="flex flex-col gap-3 w-full">
                {result.url && (
                  <motion.a
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-5 rounded-2xl font-bold text-[10px] text-white bg-lilac-neon shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:brightness-110 transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-3"
                  >
                    <Download className="w-4 h-4" /> DESCARGAR LOOK FINAL
                  </motion.a>
                )}
                <button
                  onClick={() => setShowResults(false)}
                  className="text-[9px] text-white/20 uppercase tracking-[0.4em] hover:text-white transition-colors py-2 text-center"
                >
                  Cerrar Laboratorio
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      <AnimatePresence>
        {isGenerating && (
          <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/95 backdrop-blur-2xl">
            <div className="text-center space-y-8 p-6">
              <div className="relative w-24 h-24 mx-auto">
                <Loader2 className="w-24 h-24 text-lilac-neon animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-lilac-glow animate-pulse" />
              </div>
              <p className="text-2xl md:text-3xl font-serif italic text-lilac-glow animate-pulse tracking-wide">
                {WAITING_MESSAGES[currentMessage]}
              </p>
              <p className="text-[9px] text-white/20 uppercase tracking-[0.5em]">Powered by C DESIGN IA</p>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
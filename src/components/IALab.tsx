import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Upload, Sparkles, Loader2, ChevronLeft, Download } from 'lucide-react';

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
  "Nova está analizando tus facciones...",
  "Detectando arquitectura facial Gemini...",
  "Sincronizando diseño de alta costura...",
  "Renderizando edición premium...",
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
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<GeminiResult>({ url: null, advice: null, tags: [], ready: false, error: false });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % WAITING_MESSAGES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setUserPhoto(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const renderSmartRetouch = async (userImgBase64: string, assetUrl: string, landmarks: any): Promise<string> => {
    return new Promise((resolve, reject) => {
      const userImg = new Image();
      const assetImg = new Image();
      assetImg.crossOrigin = 'anonymous';

      let loaded = 0;
      const checkLoaded = () => {
        if (++loaded === 2) {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject('No ctx');
            
            canvas.width = 1024;
            canvas.height = 1024;

            // 1. Dibujar Foto Usuario (Base)
            const scale = Math.max(canvas.width / userImg.width, canvas.height / userImg.height);
            const x = (canvas.width - userImg.width * scale) / 2;
            const y = (canvas.height - userImg.height * scale) / 2;
            ctx.drawImage(userImg, x, y, userImg.width * scale, userImg.height * scale);

            // 2. Render de Máscara Inteligente (Anclada a Gemini)
            const lx = ((landmarks.left_eye.x || 50) / 100) * canvas.width;
            const ly = ((landmarks.left_eye.y || 40) / 100) * canvas.height;
            const rx = ((landmarks.right_eye.x || 60) / 100) * canvas.width;
            const ry = ((landmarks.right_eye.y || 40) / 100) * canvas.height;
            
            const centerX = (lx + rx) / 2;
            const centerY = (ly + ry) / 2;
            const eyeDist = Math.sqrt(Math.pow(rx - lx, 2) + Math.pow(ry - ly, 2));
            const angle = Math.atan2(ry - ly, rx - lx);
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle);
            
            // Proporción áurea de la máscara
            const maskScale = (eyeDist / (canvas.width * 0.28)) || 1.0; 
            const mw = assetImg.width * maskScale;
            const mh = assetImg.height * maskScale;
            
            ctx.drawImage(assetImg, -mw/2, -mh/2.2, mw, mh);
            ctx.restore();

            resolve(canvas.toDataURL('image/jpeg', 0.95));
          } catch (e) {
            reject(e);
          }
        }
      };

      userImg.onload = checkLoaded;
      assetImg.onload = checkLoaded;
      userImg.onerror = () => reject('Error user img');
      assetImg.onerror = () => reject('Error asset img');
      userImg.src = userImgBase64;
      assetImg.src = assetUrl;
    });
  };

  const handleGenerate = async () => {
    if (!userPhoto || !selectedAsset) return;

    setIsGenerating(true);
    setShowResults(false);
    setResult({ url: null, advice: null, tags: [], ready: false, error: false });

    try {
      const cleanUserPhoto = userPhoto.replace(/^data:image\/\w+;base64,/, '');
      const absoluteAssetUrl = window.location.origin + selectedAsset;

      const response = await fetch('/.netlify/functions/procesar-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: cleanUserPhoto, template: absoluteAssetUrl })
      });

      if (!response.ok) throw new Error('Gemini Pipeline Error');
      const data = await response.json();

      // Generar Imagen Final antes de mostrar resultados
      const finalUrl = await renderSmartRetouch(userPhoto, absoluteAssetUrl, data.landmarks);

      setResult({
        url: finalUrl,
        advice: data.advice,
        tags: data.tags,
        ready: true,
        error: false
      });
      
      setShowResults(true); // Solo mostramos cuando el renderizado del canvas terminó
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
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Back</span>
        </Link>
        <div className="text-right">
          <h1 className="text-3xl md:text-6xl font-serif italic text-white uppercase tracking-tighter">Nova Lab</h1>
          <p className="text-[10px] text-lilac-neon mt-2 uppercase tracking-[0.5em] font-medium">C DESIGN IA · Premium Edition</p>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
            <div className="flex gap-6 mb-12 overflow-x-auto pb-4 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSelectedAsset(null); }}
                  className={cn(
                    "px-8 py-4 text-xs font-bold rounded-2xl border transition-all duration-500 uppercase whitespace-nowrap tracking-widest",
                    activeCategory === cat.id 
                      ? "bg-lilac-neon border-lilac-neon text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-105" 
                      : "bg-transparent border-white/5 text-white/30 hover:border-white/20 hover:text-white"
                  )}
                >
                  <span className="mr-3">{cat.icon}</span>{cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {MOCK_GALLERY[activeCategory].map((src, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedAsset(src)}
                  className={cn(
                    "aspect-square rounded-3xl overflow-hidden cursor-pointer border-2 transition-all duration-500 relative group",
                    selectedAsset === src ? "border-lilac-neon shadow-[0_0_25px_rgba(168,85,247,0.5)]" : "border-white/5 hover:border-white/20"
                  )}
                >
                  <img src={src} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" alt="Asset" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {selectedAsset === src && (
                    <div className="absolute top-3 right-3 bg-lilac-neon rounded-full p-1.5 shadow-lg">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-10">
          <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-lilac-neon/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <h3 className="text-xs font-bold text-lilac-glow mb-8 uppercase tracking-[0.3em] relative z-10">Portrait Profile</h3>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "w-56 h-56 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer overflow-hidden relative z-10 transition-all duration-700 hover:scale-105",
                userPhoto && "border-solid border-lilac-neon shadow-[0_0_30px_rgba(168,85,247,0.3)]"
              )}
            >
              {userPhoto ? (
                <img src={userPhoto} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center group-hover:scale-110 transition-transform">
                  <Upload className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <span className="text-[10px] uppercase tracking-widest text-white/40">Upload Frontal Photo</span>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handlePhotoUpload} />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !userPhoto || !selectedAsset}
              className="w-full mt-12 py-6 rounded-2xl text-[10px] font-bold tracking-[0.4em] text-white bg-gradient-to-r from-lilac-neon via-purple-600 to-indigo-700 disabled:opacity-20 hover:brightness-110 active:scale-95 transition-all uppercase shadow-xl relative z-10"
            >
              {isGenerating ? <Loader2 className="animate-spin mx-auto w-5 h-5" /> : "FUSE WITH GEMINI ✨"}
            </button>
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
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col items-center gap-6">
                <div className="w-full aspect-square rounded-[3rem] overflow-hidden border border-lilac-neon shadow-[0_0_70px_rgba(168,85,247,0.4)] relative bg-black group">
                  {result.url && (
                    <motion.img 
                      initial={{ scale: 1.1, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }} 
                      src={result.url} 
                      className="w-full h-full object-cover" 
                      alt="Resultado Nova" 
                    />
                  )}
                  {!result.url && !result.error && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-12 h-12 text-lilac-neon animate-spin" />
                    </div>
                  )}
                </div>
                
                {result.url && (
                  <motion.a 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    href={result.url} 
                    download="nova-premium-design.jpg" 
                    className="flex items-center gap-3 px-12 py-5 rounded-2xl font-bold text-xs text-white bg-lilac-neon hover:bg-lilac-glow shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all uppercase tracking-[0.2em] relative z-[2010]"
                  >
                    <Download className="w-5 h-5" /> Download Result
                  </motion.a>
                )}
              </div>

              <div className="flex flex-col gap-8 text-left h-full justify-center">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-6xl font-serif italic text-white leading-none">Nova Vision</h2>
                  <p className="text-[10px] text-lilac-neon uppercase tracking-[0.6em] font-medium">Digital Editorial Edition</p>
                </div>

                <div className="backdrop-blur-3xl bg-white/5 border border-white/10 p-10 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="w-8 h-8 text-lilac-neon" />
                  </div>
                  <h3 className="text-[10px] underline decoration-lilac-neon/50 underline-offset-8 uppercase tracking-[0.3em] text-white/50 font-bold mb-8">AI Designer Analysis</h3>
                  <p className="text-xl md:text-2xl font-serif text-lilac-glow leading-relaxed italic drop-shadow-sm">
                    "{result.advice || 'Gemini está sintetizando tu estilo...'}"
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {result.tags.map((tag, i) => (
                    <span key={i} className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest text-white/40 hover:text-lilac-neon transition-colors cursor-default">
                      # {tag}
                    </span>
                  ))}
                </div>

                <button 
                  onClick={() => setShowResults(false)} 
                  className="w-fit text-[10px] text-white/20 hover:text-white uppercase tracking-[0.4em] transition-all border-b border-white/0 hover:border-white/20 pb-1"
                >
                  DISMISS LABORATORY
                </button>
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
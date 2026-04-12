import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Upload, Sparkles, Loader2, ChevronLeft } from 'lucide-react';

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
  "Nova está analizando tus facciones para un diseño a medida...",
  "Gemini detectando puntos de luz facial...",
  "Sincronizando máscara con landmarks biométricos...",
  "Generando consejo de Retoque Premium...",
  "Renderizando visión final en alta gama...",
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
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('No ctx');
          
          canvas.width = 1024;
          canvas.height = 1365; // Proporción 3:4

          // 1. Dibujar Usuario (Base)
          const scale = Math.max(canvas.width / userImg.width, canvas.height / userImg.height);
          const x = (canvas.width - userImg.width * scale) / 2;
          const y = (canvas.height - userImg.height * scale) / 2;
          ctx.drawImage(userImg, x, y, userImg.width * scale, userImg.height * scale);

          // 2. Dibujar Máscara Inteligente usando Landmarks
          // Gemini nos da 0-1000. Traducimos a canvas.
          // Estimamos centro entre ojos
          const lx = (landmarks.left_eye.x / 1000) * canvas.width;
          const ly = (landmarks.left_eye.y / 1000) * canvas.height;
          const rx = (landmarks.right_eye.x / 1000) * canvas.width;
          const ry = (landmarks.right_eye.y / 1000) * canvas.height;
          
          const centerX = (lx + rx) / 2;
          const centerY = (ly + ry) / 2;
          const dist = Math.sqrt(Math.pow(rx - lx, 2) + Math.pow(ry - ly, 2));
          const angle = Math.atan2(ry - ly, rx - lx);
          
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(angle);
          
          // La máscara suele tener los ojos a una distancia específica. 
          // Escalamos la máscara basándonos en la distancia de los ojos del usuario.
          const maskScale = dist / (canvas.width * 0.25); // Asumiendo que los ojos en el asset están al 25% del ancho
          ctx.drawImage(assetImg, - (canvas.width * maskScale) / 2, - (canvas.height * maskScale) / 2.2, canvas.width * maskScale, canvas.height * maskScale);
          ctx.restore();

          resolve(canvas.toDataURL('image/jpeg', 0.9));
        }
      };

      userImg.onload = checkLoaded;
      assetImg.onload = checkLoaded;
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
        body: JSON.stringify({ category: activeCategory, image: cleanUserPhoto, template: absoluteAssetUrl })
      });

      if (!response.ok) throw new Error('Error en Motor Gemini');
      const data = await response.json();

      // Renderizamos localmente con la inteligencia de Gemini
      const finalUrl = await renderSmartRetouch(userPhoto, absoluteAssetUrl, data.landmarks);

      setResult({
        url: finalUrl,
        advice: data.advice,
        tags: data.tags,
        ready: true,
        error: false
      });
    } catch (e: any) {
      console.error(e);
      setResult(prev => ({ ...prev, ready: true, error: true }));
    } finally {
      setIsGenerating(false);
      setShowResults(true);
    }
  };

  const handleClose = () => {
    setShowResults(false);
    setResult({ url: null, advice: null, tags: [], ready: false, error: false });
  };

  return (
    <div className="min-h-screen bg-bg-deep font-sans text-text-primary p-6 md:p-12 selection:bg-lilac-neon/30 selection:text-lilac-glow">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-lilac-neon/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-purple-900/20 blur-[100px] rounded-full" />
      </div>

      <nav className="relative z-10 mb-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-lilac-glow hover:text-white transition-colors group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Volver al Inicio</span>
        </Link>
        <div className="text-right">
          <h1 className="text-2xl md:text-5xl font-serif italic tracking-tight text-white uppercase tracking-widest">Nova Lab</h1>
          <p className="text-[10px] text-lilac-neon uppercase tracking-[0.3em] font-medium mt-2">C DESIGN IA · Poder Gemini 1.5</p>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <div className="lg:col-span-12 xl:col-span-8 space-y-8">
          <div className="backdrop-blur-xl bg-white/5 border border-lilac-neon/20 rounded-2xl p-6 md:p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="flex gap-4 mb-8 justify-center md:justify-start">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSelectedAsset(null); }}
                  className={cn(
                    "px-6 py-3 text-[10px] md:text-xs font-bold tracking-widest rounded-lg border transition-all duration-500 relative uppercase",
                    activeCategory === cat.id ? "bg-lilac-neon/20 border-lilac-neon text-white shadow-[0_0_15px_#a855f7]" : "bg-transparent border-white/10 text-white/50 hover:border-lilac-neon/50 hover:text-white"
                  )}
                >
                  <span className="mr-2">{cat.icon}</span>
                  {cat.label}
                  {activeCategory === cat.id && (
                    <motion.div layoutId="activeTab" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-lilac-neon shadow-[0_0_8px_#a855f7]" />
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {MOCK_GALLERY[activeCategory].map((src, i) => (
                <motion.div
                  key={`${activeCategory}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedAsset(src)}
                  className={cn(
                    "aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all relative group",
                    selectedAsset === src ? "border-lilac-neon shadow-[0_0_20px_#a855f7] scale-105" : "border-transparent hover:border-lilac-neon/30"
                  )}
                >
                  <img src={src} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" alt="Option" />
                  {selectedAsset === src && (
                    <div className="absolute top-2 right-2 bg-lilac-neon shadow-[0_0_10px_#a855f7] rounded-full p-1 border border-white/20">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-12 xl:col-span-4 space-y-8">
          <div className="backdrop-blur-xl bg-white/5 border border-lilac-neon/20 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <h3 className="text-sm font-bold tracking-widest text-lilac-glow mb-6 uppercase">Tu Perfil</h3>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "w-48 h-48 rounded-full border-2 border-dashed border-lilac-neon/30 flex flex-col items-center justify-center cursor-pointer hover:border-lilac-neon hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all overflow-hidden relative group",
                userPhoto && "border-solid border-lilac-neon shadow-[0_0_20px_#a855f7]"
              )}
            >
              {userPhoto ? (
                <img src={userPhoto} className="w-full h-full object-cover" alt="User upload" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-lilac-neon mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] uppercase tracking-widest text-text-muted">Subir Foto</span>
                </>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !userPhoto || !selectedAsset}
              className={cn(
                "w-full mt-10 py-5 rounded-xl text-xs font-bold tracking-[0.3em] transition-all duration-500 relative overflow-hidden group uppercase text-white",
                isGenerating || !userPhoto || !selectedAsset ? "bg-white/5 text-text-muted cursor-not-allowed" : "bg-gradient-to-r from-[#a855f7] to-[#9c27b0] shadow-[0_0_30px_rgba(168,85,247,0.4)]"
              )}
            >
              {isGenerating ? "ANALIZANDO..." : "REVELAR DISEÑO ✨"}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isGenerating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-lilac-neon animate-spin mx-auto mb-6" />
              <motion.p key={currentMessage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-lg font-serif text-lilac-glow">
                {WAITING_MESSAGES[currentMessage]}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResults && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg overflow-y-auto">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 py-8 items-center font-sans">
              <div className="flex flex-col items-center">
                <h2 className="text-3xl font-serif italic text-white mb-2 text-center uppercase tracking-widest">Nova Lab ✨</h2>
                <div className="w-full aspect-[3/4] rounded-[2rem] overflow-hidden border border-lilac-neon/40 shadow-[0_0_60px_rgba(168,85,247,0.5)] relative bg-black">
                  {result.url && <img src={result.url} className="w-full h-full object-cover" alt="Resultado Nova" />}
                  {result.error && <p className="p-8 text-center text-red-400">Error en el renderizado</p>}
                </div>
              </div>

              <div className="space-y-6 text-left">
                <div className="backdrop-blur-xl bg-white/5 border border-lilac-neon/20 p-6 rounded-2xl">
                  <h3 className="text-[10px] uppercase tracking-widest text-lilac-neon font-bold mb-4">Nova Stylist Advice</h3>
                  <p className="text-sm text-lilac-glow leading-relaxed italic">"{result.advice}"</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {result.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-lilac-neon/10 border border-lilac-neon/30 rounded-full text-[8px] uppercase tracking-widest text-lilac-glow">
                      # {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-8 flex flex-col gap-4">
                   {result.url && (
                    <a href={result.url} download="nova-premium.jpg" className="w-full py-4 rounded-xl text-center text-xs font-bold tracking-[0.2em] text-white bg-gradient-to-r from-[#a855f7] to-[#9c27b0] shadow-[0_0_30px_#a855f7] hover:scale-105 transition-transform uppercase">
                      Descargar Retoque ✨
                    </a>
                  )}
                  <button onClick={handleClose} className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-all text-center">Cerrar Laboratorio</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
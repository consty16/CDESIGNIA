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
  "Nova está analizando tus facciones...",
  "Calculando puntos de anclaje biométricos...",
  "Sincronizando diseño con Gemini...",
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
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('No ctx');
          
          canvas.width = 1024;
          canvas.height = 1024;

          // 1. Dibujar Foto Usuario Escalada
          const scale = Math.max(canvas.width / userImg.width, canvas.height / userImg.height);
          const x = (canvas.width - userImg.width * scale) / 2;
          const y = (canvas.height - userImg.height * scale) / 2;
          ctx.drawImage(userImg, x, y, userImg.width * scale, userImg.height * scale);

          // 2. Posicionamiento Inteligente (Coordenadas 0-100)
          // Calculamos el centro de los ojos
          const lx = (landmarks.left_eye.x / 100) * canvas.width;
          const ly = (landmarks.left_eye.y / 100) * canvas.height;
          const rx = (landmarks.right_eye.x / 100) * canvas.width;
          const ry = (landmarks.right_eye.y / 100) * canvas.height;
          
          const centerX = (lx + rx) / 2;
          const centerY = (ly + ry) / 2;
          const eyeDist = Math.sqrt(Math.pow(rx - lx, 2) + Math.pow(ry - ly, 2));
          const angle = Math.atan2(ry - ly, rx - lx);
          
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(angle);
          
          // Escalamos la máscara proporcionalmente a la distancia de los ojos
          // El asset original suele tener una distancia ocular 'standard' a escala 1:1
          const maskScale = eyeDist / (canvas.width * 0.28); 
          const mw = assetImg.width * maskScale;
          const mh = assetImg.height * maskScale;
          
          ctx.drawImage(assetImg, -mw/2, -mh/2.2, mw, mh);
          ctx.restore();

          resolve(canvas.toDataURL('image/jpeg', 0.9));
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

      if (!response.ok) throw new Error('Gemini Error');
      const data = await response.json();

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

  return (
    <div className="min-h-screen bg-bg-deep font-sans text-text-primary p-6 md:p-12">
      <nav className="relative z-10 mb-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-lilac-glow hover:text-white transition-colors group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Volver</span>
        </Link>
        <div className="text-right">
          <h1 className="text-2xl md:text-5xl font-serif italic text-white uppercase tracking-widest">Nova Lab</h1>
          <p className="text-[10px] text-lilac-neon mt-2 uppercase tracking-widest">C DESIGN IA · Premium</p>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSelectedAsset(null); }}
                  className={cn(
                    "px-6 py-3 text-[10px] font-bold rounded-lg border transition-all uppercase whitespace-nowrap",
                    activeCategory === cat.id ? "bg-lilac-neon/20 border-lilac-neon text-white" : "bg-transparent border-white/10 text-white/50"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {MOCK_GALLERY[activeCategory].map((src, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedAsset(src)}
                  className={cn(
                    "aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all",
                    selectedAsset === src ? "border-lilac-neon scale-105" : "border-transparent"
                  )}
                >
                  <img src={src} className="w-full h-full object-cover" alt="Asset" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center">
            <h3 className="text-xs font-bold text-lilac-glow mb-6 uppercase tracking-widest">Tu Foto</h3>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "w-48 h-48 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer overflow-hidden relative",
                userPhoto && "border-solid border-lilac-neon"
              )}
            >
              {userPhoto ? <img src={userPhoto} className="w-full h-full object-cover" /> : <Upload className="w-8 h-8 text-white/20" />}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handlePhotoUpload} />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !userPhoto || !selectedAsset}
              className="w-full mt-10 py-5 rounded-xl text-xs font-bold tracking-widest text-white bg-gradient-to-r from-lilac-neon to-purple-600 disabled:opacity-30 transition-all uppercase"
            >
              {isGenerating ? <Loader2 className="animate-spin mx-auto w-5 h-5" /> : "Fusionar con Gemini ✨"}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-xl flex flex-col items-center py-10">
              <div className="w-full aspect-square rounded-3xl overflow-hidden border border-lilac-neon shadow-2xl relative bg-black">
                {result.url && <img src={result.url} className="w-full h-full object-cover" />}
              </div>

              <div className="mt-8 text-center space-y-6 max-w-md">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl relative">
                  <Sparkles className="absolute -top-3 -left-3 w-6 h-6 text-lilac-neon" />
                  <p className="text-sm text-lilac-glow italic leading-relaxed">
                    "{result.advice || 'Generando consejo personalizado...'}"
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  {result.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[9px] uppercase tracking-widest text-white/40">#{tag}</span>
                  ))}
                </div>

                <div className="flex flex-col gap-4">
                  {result.url && (
                    <a href={result.url} download="nova-ia.jpg" className="w-full py-4 rounded-xl font-bold text-xs text-white bg-lilac-neon uppercase tracking-widest">
                      Descargar Resultado
                    </a>
                  )}
                  <button onClick={() => setShowResults(false)} className="text-[10px] text-white/30 uppercase tracking-widest">Cerrar</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isGenerating && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
             <div className="text-center">
                <Loader2 className="w-12 h-12 text-lilac-neon animate-spin mx-auto mb-6" />
                <p className="text-lg font-serif text-lilac-glow animate-pulse">{WAITING_MESSAGES[currentMessage]}</p>
             </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
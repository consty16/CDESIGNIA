import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Upload, Sparkles, Loader2, ChevronLeft, Image as ImageIcon } from 'lucide-react';

// Cargador de archivos dinámico para compatibilidad con producción (Vite)
const assetFiles = import.meta.glob('../assets/*.{png,jpg,jpeg,svg,webp}', { eager: true, as: 'url' });

const getAssetUrl = (name: string) => {
  // Buscamos el archivo que termine exactamente con el nombre solicitado
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
  "Nova está ajustando los cristales lilas...",
  "Fusionando identidades inteligentes...",
  "Calculando el espectro de neón perfecto...",
  "Interconectando redes visuales de alta gama...",
  "Optimizando la esencia del diseño tucumano...",
];

export const IALab = () => {
  const [activeCategory, setActiveCategory] = useState('MÁSCARAS');
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [resultImage, setResultImage] = useState<string | null>(null);
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
      reader.onload = (prev) => setUserPhoto(prev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!userPhoto || !selectedAsset) {
      alert("Por favor sube tu foto y selecciona un estilo.");
      return;
    }

    setIsGenerating(true);
    setResultImage(null);

    const toBase64 = (url: string): Promise<string> =>
      fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        }));

    try {
      const templateBase64 = await toBase64(selectedAsset);

      const response = await fetch("/.netlify/functions/procesar-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: activeCategory,
          image: userPhoto.replace(/^data:image\/\w+;base64,/, ""),
          template: templateBase64.replace(/^data:image\/\w+;base64,/, "")
        }),
      });

      if (response.status === 404) {
        throw new Error("No se pudo encontrar la función de IA. Si estás en modo desarrollo local, asegúrate de estar usando 'netlify dev' en lugar de 'npm run dev'.");
      }

      const responseText = await response.text();

      if (!response.ok) {
        console.error("Error en la respuesta de la IA:", responseText);
        throw new Error(responseText || `Error (${response.status}): La IA no pudo procesar la imagen`);
      }

      setResultImage(`data:image/png;base64,${responseText}`);
    } catch (error: any) {
      console.error("Error generating magic:", error);

      // Mensaje amigable para el usuario
      const displayError = error.message.includes("Failed to fetch")
        ? "No se pudo conectar con el servidor de IA. Verifica tu conexión o si el sitio está desplegado."
        : error.message;

      alert("Aviso del Laboratorio: " + displayError);
      setResultImage(selectedAsset);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep font-sans text-text-primary p-6 md:p-12 selection:bg-lilac-neon/30 selection:text-lilac-glow">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-lilac-neon/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-purple-900/20 blur-[100px] rounded-full" />
      </div>

      <nav className="relative z-10 mb-12 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2 text-lilac-glow hover:text-white transition-colors group"
          onClick={(e) => {
            // Aseguramos la navegación forzada si el router no responde como se espera
            if (window.location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              // Si no estamos en la raíz y queremos ir a index.html en una multi-page app
              window.location.href = '/';
            }
          }}
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Volver al Inicio</span>
        </Link>
        <div className="text-right">
          <h1 className="text-2xl md:text-5xl font-serif italic tracking-tight text-white">Laboratorio IA</h1>
          <p className="text-[10px] text-lilac-neon uppercase tracking-[0.3em] font-medium mt-2">C DESIGN IA · Premium Agency</p>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <div className="lg:col-span-12 xl:col-span-8 space-y-8">
          <div className="backdrop-blur-xl bg-white/5 border border-lilac-neon/20 rounded-2xl p-6 md:p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="flex gap-4 mb-8 justify-center md:justify-start">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSelectedAsset(null);
                  }}
                  className={cn(
                    "px-6 py-3 text-[10px] md:text-xs font-bold tracking-widest rounded-lg border transition-all duration-500 relative group uppercase",
                    activeCategory === cat.id
                      ? "bg-lilac-neon/20 border-lilac-neon text-white shadow-[0_0_15px_#a855f7]"
                      : "bg-transparent border-white/10 text-white/50 hover:border-lilac-neon/50 hover:text-white"
                  )}
                >
                  <span className="mr-2">{cat.icon}</span>
                  {cat.label}
                  {activeCategory === cat.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-lilac-neon shadow-[0_0_8px_#a855f7]"
                    />
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
                    selectedAsset === src
                      ? "border-lilac-neon shadow-[0_0_20px_#a855f7] scale-105"
                      : "border-transparent hover:border-lilac-neon/30"
                  )}
                >
                  <img src={src} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-lilac-neon/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
                <img src={userPhoto} className="w-full h-full object-cover" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-lilac-neon mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] uppercase tracking-widest text-text-muted">Subir Foto de frente</span>
                </>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[10px] uppercase font-bold text-white tracking-widest">Cambiar</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
            <p className="text-[10px] text-text-muted mt-6 max-w-[200px] leading-relaxed">
              * Para mejores resultados, usa una foto con buena iluminación y de frente.
            </p>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !userPhoto || !selectedAsset}
              className={cn(
                "w-full mt-10 py-5 rounded-xl text-xs font-bold tracking-[0.3em] transition-all duration-500 relative overflow-hidden group uppercase",
                isGenerating || !userPhoto || !selectedAsset
                  ? "bg-white/5 text-text-muted cursor-not-allowed border border-white/5"
                  : "bg-gradient-to-r from-[#a855f7] to-[#9c27b0] text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.7)] hover:scale-[1.02]"
              )}
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[45deg]" />
              {isGenerating ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>TRANSFORMANDO...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" /> GENERAR MAGIA ✨
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {(isGenerating || resultImage) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-[#0a0a0a]/95 backdrop-blur-md"
          >
            <div className="max-w-2xl w-full flex flex-col items-center">
              {isGenerating ? (
                <div className="text-center">
                  <div className="relative w-32 h-32 mb-8 mx-auto">
                    <div className="absolute inset-0 border-4 border-lilac-neon/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-lilac-neon border-t-transparent rounded-full animate-spin shadow-[0_0_15px_#a855f7]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-lilac-glow animate-pulse" />
                    </div>
                  </div>
                  <motion.p
                    key={currentMessage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-lg md:text-xl font-serif text-lilac-glow drop-shadow-[0_0_8px_rgba(216,180,254,0.5)]"
                  >
                    {WAITING_MESSAGES[currentMessage]}
                  </motion.p>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full flex flex-col items-center"
                >
                  <div className="relative aspect-square w-full max-w-md rounded-2xl overflow-hidden border border-lilac-neon shadow-[0_0_50px_rgba(168,85,247,0.4)] mb-8">
                    <img src={resultImage!} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-black/60 backdrop-blur-sm text-center">
                      <p className="text-[10px] uppercase tracking-widest text-lilac-glow">Resultado Generado por Nova IA</p>
                    </div>
                  </div>
                  <div className="flex gap-4 w-full justify-center">
                    <button
                      onClick={() => setResultImage(null)}
                      className="px-8 py-3 bg-white/5 border border-white/20 rounded-lg text-xs font-bold tracking-widest hover:bg-white/10 transition-all uppercase"
                    >
                      CERRAR
                    </button>
                    <a
                      href={resultImage!}
                      download="magic-result.jpg"
                      className="px-8 py-3 bg-lilac-neon text-white rounded-lg text-xs font-bold tracking-widest shadow-[0_0_15px_#a855f7] hover:brightness-110 transition-all flex items-center gap-2 uppercase"
                    >
                      DESCARGAR ✨
                    </a>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

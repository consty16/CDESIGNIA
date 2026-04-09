import React, { useState } from 'react';
import { cn } from '../lib/utils';

const Lightbox = ({ isOpen, onClose, src, title, type = 'image' }: { isOpen: boolean, onClose: () => void, src: string, title: string, type?: 'image' | 'web' | 'video' }) => {
  if (!isOpen) return null;
  return (
    <div 
      className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button 
        className="absolute top-6 right-6 text-white/50 hover:text-white text-3xl transition-colors z-10"
        onClick={onClose}
      >
        ✕
      </button>
      <div className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center gap-4" onClick={e => e.stopPropagation()}>
        <div className="relative w-full h-[85vh] flex items-center justify-center bg-bg-secondary rounded-xl overflow-hidden border border-white/10 shadow-2xl">
          {type === 'image' ? (
            <img 
              src={src} 
              alt={title} 
              className="max-w-full max-h-full object-contain"
              referrerPolicy="no-referrer"
            />
          ) : type === 'video' ? (
            <video 
              src={src} 
              controls 
              autoPlay 
              className="max-w-full max-h-full"
            >
              Tu navegador no soporta el elemento de video.
            </video>
          ) : (
            <div className="w-full h-full flex flex-col">
              <div className="bg-bg-tertiary border-b border-white/5 p-3 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <div className="flex-1 bg-black/20 rounded px-3 py-1 text-[10px] text-text-muted truncate">
                  {src}
                </div>
                <a 
                  href={src} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[10px] text-lilac hover:underline"
                >
                  Abrir en pestaña nueva ↗
                </a>
              </div>
              <iframe 
                src={src} 
                title={title} 
                className="w-full h-full bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
          )}
        </div>
        <div className="text-center">
          <h3 className="text-xl font-serif text-white mb-1">{title}</h3>
          <p className="text-xs text-lilac uppercase tracking-[0.2em]">
            {type === 'web' ? 'Vista Previa Web — Nota: Algunos sitios pueden bloquear el acceso por seguridad' : type === 'video' ? 'Video Influencer — CDesign IA' : 'Vista Previa — CDesign IA'}
          </p>
        </div>
      </div>
    </div>
  );
};

interface Project {
  title: string;
  sub: string;
  icon: string;
  category: string;
  url?: string;
  video?: string;
}

const projects: Project[] = [
  { title: "ALEX", sub: "Influencer Virtual", icon: "◈", category: 'influencers', video: "/ALEX1.mp4" },
  { title: "ALI", sub: "Influencer Virtual", icon: "◈", category: 'influencers', video: "/ALI3.mp4" },
  { title: "NOVA", sub: "Influencer Virtual", icon: "◈", category: 'influencers', video: "/NOVA2.mp4" },
  { title: "Todo Piedras", sub: "Tienda de Gemas", icon: "◇", category: 'trabajos' },
  { title: "Librería Cúspide", sub: "Identidad visual", icon: "◈", category: 'trabajos' },
  { title: "ÁNGEL", sub: "Humor IA", icon: "❋", category: 'humor', video: "/angel.mp4" },
  { title: "BUBU", sub: "Humor IA", icon: "❋", category: 'humor', video: "/bubu.mp4" },
  { title: "CABALLEROS DEL ZODIACO", sub: "Humor IA", icon: "❋", category: 'humor', video: "/caballerosdelzodiaco.mp4" },
  { title: "C DESIGN IA", sub: "Humor IA", icon: "❋", category: 'humor', video: "/cdesignia.mp4" },
  { title: "DARIA", sub: "Humor IA", icon: "❋", category: 'humor', video: "/daria.mp4" },
  { title: "DORA", sub: "Humor IA", icon: "❋", category: 'humor', video: "/dora.mp4" },
  { title: "DUDU", sub: "Humor IA", icon: "❋", category: 'humor', video: "/dudu.mp4" },
  { title: "EINSTEIN", sub: "Humor IA", icon: "❋", category: 'humor', video: "/einstein.mp4" },
  { title: "GOKU", sub: "Humor IA", icon: "❋", category: 'humor', video: "/goku.mp4" },
  { title: "ICE CREAM", sub: "Humor IA", icon: "❋", category: 'humor', video: "/icecream.mp4" },
  { title: "MALÉFICA", sub: "Humor IA", icon: "❋", category: 'humor', video: "/malefica.mp4" },
  { title: "RANMA", sub: "Humor IA", icon: "❋", category: 'humor', video: "/ranma.mp4" },
  { title: "SAILOR MOON", sub: "Humor IA", icon: "❋", category: 'humor', video: "/sailormoon.mp4" },
  { title: "SAILOR MOON S", sub: "Humor IA", icon: "❋", category: 'humor', video: "/sailormoons.mp4" },
  { title: "SHENLONG", sub: "Humor IA", icon: "❋", category: 'humor', video: "/shenlong.mp4" },
  { title: "SHREK", sub: "Humor IA", icon: "❋", category: 'humor', video: "/shrek.mp4" },
  { title: "ESPACIAL", sub: "Humor IA", icon: "❋", category: 'humor', video: "/spacial.mp4" },
  { title: "TOMY & JERRY", sub: "Humor IA", icon: "❋", category: 'humor', video: "/tomyjerry.mp4" },
  { title: "BUBU MODEL", sub: "Humor IA", icon: "❋", category: 'humor', video: "/bubumodels.mp4" },
  { title: "DUDITO", sub: "Humor IA", icon: "❋", category: 'humor', video: "/dudito.mp4" },
  { title: "DUDU & BUBU", sub: "Humor IA", icon: "❋", category: 'humor', video: "/duduandbubu.mp4" },
  { title: "DUDU BAILARÍN", sub: "Humor IA", icon: "❋", category: 'humor', video: "/dudubailarin.mp4" },
  { title: "DUKU", sub: "Humor IA", icon: "❋", category: 'humor', video: "/duku.mp4" },
  { title: "EFECTO DRONE 1", sub: "Humor IA", icon: "❋", category: 'humor', video: "/efectodrone1.mp4" },
  { title: "EFECTO DRONE 2", sub: "Humor IA", icon: "❋", category: 'humor', video: "/efectodrone2.mp4" },
  { title: "EFECTO DRONE 3", sub: "Humor IA", icon: "❋", category: 'humor', video: "/efectodrone3.mp4" },
  { title: "EFECTO DRONE 4", sub: "Humor IA", icon: "❋", category: 'humor', video: "/efectodrone4.mp4" },
  { title: "EFECTO DRONE 5", sub: "Humor IA", icon: "❋", category: 'humor', video: "/efectodrone5.mp4" },
  { title: "EFECTO DRONE 6", sub: "Humor IA", icon: "❋", category: 'humor', video: "/efectodrone6.mp4" },
  { title: "GOKU EN ACCIÓN", sub: "Humor IA", icon: "❋", category: 'humor', video: "/gokuenaccion.mp4" },
  { title: "HALLOWEEN", sub: "Humor IA", icon: "❋", category: 'humor', video: "/halloween.mp4" },
  { title: "RUBIA KIDS", sub: "Humor IA", icon: "❋", category: 'humor', video: "/rubiakids.mp4" },
  { title: "SERENA", sub: "Humor IA", icon: "❋", category: 'humor', video: "/serena.mp4" },
  { title: "SHENLONG NEW YEAR", sub: "Humor IA", icon: "❋", category: 'humor', video: "/shenglongnewyear.mp4" },
  { title: "FORTINO", sub: "Trabajo Destacado", icon: "◈", category: 'trabajos', video: "/fortino.mp4" },
  { title: "Galería Florida", sub: "Publicidad IA", icon: "◈", category: 'trabajos', video: "/GALERIA.mp4" },
  { title: "Dist. Giar Mayorista", sub: "Publicidad Inteligente", icon: "◇", category: 'trabajos' },
  { title: "Bless Inmobiliaria", sub: "Branding & Publicidad", icon: "◆", category: 'trabajos' },
  { title: "Panther Distribuciones", sub: "Identidad visual", icon: "◈", category: 'trabajos' },
  { title: "Raiders El Portal", sub: "Tucumán", icon: "❋", category: 'trabajos' },
  { title: "Flip Hub Cocinas", sub: "Publicidad IA", icon: "◇", category: 'trabajos' },
  { title: "Storni Resto Bar", sub: "Gastronomía", icon: "◈", category: 'trabajos' },
  { title: "Publicidad Inteligente", sub: "Campaña IA", icon: "◆", category: 'trabajos' },
  { title: "SC Security", sub: "Security Consulting", icon: "◈", category: 'trabajos' },
  { title: "Citroën", sub: "Publicidad IA Autos", icon: "◆", category: 'trabajos' },
  { title: "Google AI Studio", sub: "E-commerce IA", icon: "◇", category: 'trabajos' },
  { title: "Identidad Corporativa", sub: "Branding integral", icon: "◈", category: 'trabajos' },
  { title: "ALBERT", sub: "Personaje IA", icon: "◈", category: 'personajes', video: "/albert.mp4" },
  { title: "ANDROIDE IA", sub: "Personaje IA", icon: "◈", category: 'personajes', video: "/androideaia.mp4" },
  { title: "DA VINCI", sub: "Personaje IA", icon: "◈", category: 'personajes', video: "/davinci.mp4" },
  { title: "DE PAUL", sub: "Personaje IA", icon: "◈", category: 'personajes', video: "/depaul.mp4" },
  { title: "EINSTEIN", sub: "Personaje IA", icon: "◈", category: 'personajes', video: "/einstein.mp4" },
  { title: "EL SR. DE LOS CUBANITOS 1", sub: "Personaje IA", icon: "◈", category: 'personajes', video: "/elsrdeloscubanitos1.mp4" },
  { title: "EL SR. DE LOS CUBANITOS 2", sub: "Personaje IA", icon: "◈", category: 'personajes', video: "/elsrdeloscubanitos2.mp4" },
  { title: "FRANCISCO", sub: "Personaje IA", icon: "◈", category: 'personajes', video: "/francisco.mp4" },
  { title: "GALILEO GALILEI", sub: "Personaje IA", icon: "◈", category: 'personajes', video: "/galileogalilei.mp4" },
  { title: "HIJA Y PADRE", sub: "Personaje IA", icon: "◈", category: 'personajes', video: "/hijaypadre.mp4" },
  { title: "JUAN PABLO II", sub: "Personaje IA", icon: "◈", category: 'personajes', video: "/juanpabloII.mp4" },
  { title: "JUAN PABLO & FRANCISCO", sub: "Personaje IA", icon: "◈", category: 'personajes', video: "/juanpabloyfrancisco.mp4" },
  { title: "MAFALDA", sub: "Personaje IA", icon: "◈", category: 'personajes', video: "/mafalda.mp4" },
  { title: "MERCEDES SOSA", sub: "Personaje IA", icon: "◈", category: 'personajes', video: "/mercedessosa.mp4" },
  { title: "MESSI EN FLIP", sub: "Personaje IA", icon: "◈", category: 'personajes', video: "/messienflip.mp4" },
  { title: "MARIE CURIE", sub: "Personaje IA", icon: "◈", category: 'personajes', video: "/mriecurie.mp4" },
  { title: "NEWTON", sub: "Personaje IA", icon: "◈", category: 'personajes', video: "/newton.mp4" },
  { title: "NIKOLA TESLA", sub: "Personaje IA", icon: "◈", category: 'personajes', video: "/nikolatesla.mp4" },
  { title: "PAPA NOEL", sub: "Personaje IA", icon: "◈", category: 'personajes', video: "/papanoel.mp4" },
  { title: "SALEM", sub: "Personaje IA", icon: "◈", category: 'personajes', video: "/salem.mp4" },
  { title: "STEPHEN", sub: "Personaje IA", icon: "◈", category: 'personajes', video: "/stephen.mp4" },
  { title: "TEDDY", sub: "Personaje IA", icon: "◈", category: 'personajes', video: "/teddy.mp4" },
  { title: "WOMEN ANDROIDE", sub: "Personaje IA", icon: "◈", category: 'personajes', video: "/womenandroide.mp4" },
];

export const MuestrasContent = () => {
  const [selectedItem, setSelectedItem] = useState<{src: string, title: string, type: 'image' | 'video'} | null>(null);
  const [filter, setFilter] = useState('humor');

  const categories = [
    { id: 'humor', label: 'Humor' },
    { id: 'personajes', label: 'Personajes' },
  ];

  const filteredProjects = projects.filter(p => p.category === filter);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={cn(
              "px-5 py-2 text-[10px] uppercase tracking-widest rounded-full border transition-all duration-300",
              filter === cat.id 
                ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.8)] font-bold" 
                : "bg-transparent text-white border-white/30 hover:border-white hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((p, i) => (
            <div
              key={i}
              className="bg-[#1a0b2e] border border-lilac/10 aspect-square relative overflow-hidden group cursor-pointer hover:border-lilac-dim transition-all hover:scale-[1.02] rounded-lg block"
            >
              {p.video ? (
                <div className="w-full h-full relative">
                  <video
                    src={p.video}
                    className="w-full h-full object-contain transition-all"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseOut={(e) => {
                      const v = e.target as HTMLVideoElement;
                      v.pause();
                      v.currentTime = 0;
                    }}
                  />
                  {/* Controles: Play/Pause + Volumen */}
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)'}}>
                    <button
                      className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-[11px] hover:bg-white/40 transition-colors flex-shrink-0"
                      title="Play / Pause"
                      onClick={(e) => {
                        e.stopPropagation();
                        const container = (e.currentTarget as HTMLElement).closest('.relative');
                        const v = container?.querySelector('video') as HTMLVideoElement;
                        const btn = e.currentTarget as HTMLButtonElement;
                        if (v) {
                          if (v.paused) { v.play(); btn.textContent = 'Ⅱ'; }
                          else { v.pause(); btn.textContent = '▶'; }
                        }
                      }}
                    >▶</button>
                    <button
                      className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-[11px] hover:bg-white/40 transition-colors flex-shrink-0"
                      title="Silenciar / Activar sonido"
                      onClick={(e) => {
                        e.stopPropagation();
                        const container = (e.currentTarget as HTMLElement).closest('.relative');
                        const v = container?.querySelector('video') as HTMLVideoElement;
                        const btn = e.currentTarget as HTMLButtonElement;
                        if (v) {
                          v.muted = !v.muted;
                          btn.textContent = v.muted ? '🔇' : '🔊';
                        }
                      }}
                    >🔇</button>
                    <div className="text-[8px] text-white/60 uppercase tracking-widest truncate">{p.title}</div>
                  </div>
                </div>
              ) : (
                <img 
                  src={`https://picsum.photos/seed/${p.title.replace(/\s+/g, '')}/600/600`} 
                  alt={p.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain transition-opacity"
                  onClick={() => setSelectedItem({ 
                    src: `https://picsum.photos/seed/${p.title.replace(/\s+/g, '')}/1200/1200`, 
                    title: p.title,
                    type: 'image'
                  })}
                />
              )}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent pointer-events-none" 
                onClick={() => setSelectedItem({ 
                  src: p.video || `https://picsum.photos/seed/${p.title.replace(/\s+/g, '')}/1200/1200`, 
                  title: p.title,
                  type: p.video ? 'video' : 'image'
                })}
              />
              <div className="absolute top-4 right-4 text-xl text-lilac/40 group-hover:text-lilac transition-colors pointer-events-none">
                {p.icon}
              </div>
              <div 
                className="absolute bottom-0 left-0 right-0 p-5 cursor-pointer"
                onClick={() => setSelectedItem({ 
                  src: p.video || `https://picsum.photos/seed/${p.title.replace(/\s+/g, '')}/1200/1200`, 
                  title: p.title,
                  type: p.video ? 'video' : 'image'
                })}
              >
                <div className="text-sm text-text-primary font-bold mb-1 group-hover:text-lilac transition-colors">{p.title}</div>
                <div className="text-[9px] text-lilac uppercase tracking-[0.2em] font-medium">{p.sub}</div>
              </div>
            </div>
          ))}
        </div>
      <Lightbox 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        src={selectedItem?.src || ''} 
        title={selectedItem?.title || ''} 
        type={selectedItem?.type}
      />
    </>
  );
};

export const InstagramContent = () => {
  return (
    <div className="py-12">
      <div className="text-center">
        <div className="text-5xl mb-4 text-lilac-dim">◉</div>
        <h3 className="text-xl font-serif text-text-primary mb-2">@cdesign_ia</h3>
        <p className="max-w-md mx-auto text-sm text-text-secondary leading-relaxed mb-8">
          Seguinos en Instagram para ver nuestro contenido más reciente: publicidades con IA, virtual influencers, branding y más.
        </p>
        <a
          href="https://www.instagram.com/cdesign_ia/?hl=es"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white px-10 py-4 text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-all rounded-full shadow-lg shadow-pink-500/20 hover:scale-105"
        >
          Ver Perfil en Instagram ↗
        </a>
      </div>
    </div>
  );
};

export const TikTokContent = () => {
  return (
    <div className="py-12">
      <div className="text-center">
        <div className="text-5xl mb-4 text-lilac-dim">▶</div>
        <h3 className="text-xl font-serif text-text-primary mb-2">@cdesign_ia</h3>
        <p className="max-w-md mx-auto text-sm text-text-secondary leading-relaxed mb-8">
          Explorá nuestro universo creativo en TikTok: procesos de IA, virtual influencers y las últimas tendencias en diseño generativo.
        </p>
        <a
          href="https://www.tiktok.com/@cdesign_ia?is_from_webapp=1&sender_device=pc"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-[#fe2c55] text-white px-10 py-4 text-xs uppercase tracking-widest font-bold hover:bg-[#e6254c] transition-all rounded-full shadow-lg shadow-[#fe2c55]/20 hover:scale-105"
        >
          Seguinos en TikTok ↗
        </a>
      </div>
    </div>
  );
};

const tools = [
  // Recomendadas
  { name: "Claude AI", cat: "IA Texto", icon: "🧠", url: "https://claude.ai" },
  { name: "ChatGPT", cat: "IA Texto", icon: "💬", url: "https://chat.openai.com" },
  { name: "Gemini AI", cat: "IA Texto", icon: "🌟", url: "https://gemini.google.com" },
  { name: "Grok", cat: "IA Texto", icon: "✖️", url: "https://x.ai" },
  { name: "DeepSeek", cat: "IA Texto", icon: "🐋", url: "https://www.deepseek.com" },
  { name: "Microsoft Copilot", cat: "IA Texto", icon: "🌀", url: "https://copilot.microsoft.com" },
  { name: "Qwen", cat: "IA Texto", icon: "🐉", url: "https://qwenlm.github.io" },

  // Google Labs
  { name: "Firebase Console", cat: "Google Labs", icon: "🔥", url: "https://console.firebase.google.com" },
  { name: "Flutter", cat: "Google Labs", icon: "💙", url: "https://flutter.dev" },
  { name: "Google Search Console", cat: "Google Labs", icon: "🔍", url: "https://search.google.com/search-console" },
  { name: "Google Cloud Console", cat: "Google Labs", icon: "☁️", url: "https://console.cloud.google.com" },
  { name: "Google Stitch", cat: "Google Labs", icon: "🧵", url: "https://stitch.withgoogle.com/" },
  { name: "Gemma", cat: "Google Labs", icon: "💎", url: "https://ai.google.dev/gemma" },
  { name: "Google IMA SDK", cat: "Google Labs", icon: "📺", url: "https://developers.google.com/interactive-media-ads" },
  { name: "ImageFX", cat: "Google Labs", icon: "🖼️", url: "https://aitestkitchen.withgoogle.com/tools/image-fx" },
  { name: "VideoFX", cat: "Google Labs", icon: "🎬", url: "https://aitestkitchen.withgoogle.com/tools/video-fx" },
  { name: "Google Vids", cat: "Google Labs", icon: "📹", url: "https://vids.google.com" },
  { name: "Google Gravity", cat: "Google Labs", icon: "🪐", url: "https://experiments.withgoogle.com/" },
  { name: "NotebookLM", cat: "Google Labs", icon: "📓", url: "https://notebooklm.google.com" },
  { name: "Google Fonts", cat: "Google Labs", icon: "🔠", url: "https://fonts.google.com" },
  { name: "Google Merchant Center", cat: "Google Labs", icon: "🛍️", url: "https://www.google.com/retail/solutions/merchant-center/" },
  { name: "Google Perfil de Negocio", cat: "Google Labs", icon: "🏪", url: "https://www.google.com/business/" },
  { name: "Google Ads", cat: "Google Labs", icon: "🎯", url: "https://ads.google.com/" },
  { name: "Google AdMob", cat: "Google Labs", icon: "📱", url: "https://admob.google.com/" },
  { name: "Pomelo", cat: "Google Labs", icon: "🍊", url: "https://www.pomelo.la/" },

  // IA Content Creator
  { name: "HeyGen", cat: "IA Content Creator", icon: "🗣️", url: "https://www.heygen.com/" },
  { name: "Pollo AI", cat: "IA Content Creator", icon: "🐥", url: "https://pollo.ai/" },
  { name: "SeeDance", cat: "IA Content Creator", icon: "💃", url: "https://seedance.ai/" },
  { name: "Kaiber", cat: "IA Content Creator", icon: "🎨", url: "https://kaiber.ai/" },
  { name: "Pika", cat: "IA Content Creator", icon: "🎥", url: "https://pika.art/" },
  { name: "AI Studios", cat: "IA Content Creator", icon: "👤", url: "https://www.deepbrain.io/aistudios" },
  { name: "Creatify AI", cat: "IA Content Creator", icon: "📈", url: "https://www.creatify.ai/" },
  { name: "Runway", cat: "IA Content Creator", icon: "🎬", url: "https://runwayml.com/" },
  { name: "PixVerse", cat: "IA Content Creator", icon: "🌌", url: "https://pixverse.ai/" },
  { name: "Canva", cat: "IA Content Creator", icon: "🎨", url: "https://www.canva.com/" },
  { name: "Adobe Express", cat: "IA Content Creator", icon: "✨", url: "https://www.adobe.com/express/" },
  { name: "Adobe Firefly", cat: "IA Content Creator", icon: "🔥", url: "https://www.adobe.com/sensei/generative-ai/firefly.html" },
  { name: "Microsoft Designer", cat: "IA Content Creator", icon: "🎨", url: "https://designer.microsoft.com/" },
  { name: "Flair AI", cat: "IA Content Creator", icon: "👔", url: "https://flair.ai/" },
  { name: "Claid AI", cat: "IA Content Creator", icon: "📸", url: "https://claid.ai/" },
  { name: "Krea AI", cat: "IA Content Creator", icon: "🎨", url: "https://www.krea.ai/" },
  { name: "Leonardo AI", cat: "IA Content Creator", icon: "🎨", url: "https://leonardo.ai/" },
  { name: "ElevenLabs", cat: "IA Content Creator", icon: "🎙️", url: "https://elevenlabs.io/" },
  { name: "Meta AI", cat: "IA Content Creator", icon: "♾️", url: "https://www.meta.ai/" },
];

export const ToolsContent = () => {
  return (
    <div className="space-y-10">
      <div>
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-lilac mb-6 flex items-center gap-3">
          <span className="w-8 h-[1px] bg-lilac/30"></span>
          RECOMENDADAS
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tools.filter(t => ["Gemini AI", "Grok", "DeepSeek", "Microsoft Copilot", "Qwen", "Claude AI", "ChatGPT"].includes(t.name)).map((t, i) => (
            <a
              key={i}
              href={t.url}
              target="_blank"
              rel="noreferrer"
              className="bg-bg-tertiary border border-lilac/10 p-5 flex flex-col items-center gap-2 text-center hover:border-lilac-dim transition-colors rounded-lg group relative w-full"
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] text-lilac">↗</div>
              <div className="text-2xl text-lilac-dim group-hover:scale-110 transition-transform">{t.icon}</div>
              <div className="text-xs font-medium text-text-primary">{t.name}</div>
              <div className="text-[9px] uppercase tracking-tighter text-text-muted">{t.cat}</div>
            </a>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-lilac mb-6 flex items-center gap-3">
          <span className="w-8 h-[1px] bg-lilac/30"></span>
          GOOGLE LABS
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tools.filter(t => t.cat === "Google Labs").map((t, i) => (
            <a
              key={i}
              href={t.url}
              target="_blank"
              rel="noreferrer"
              className="bg-bg-tertiary border border-lilac/10 p-5 flex flex-col items-center gap-2 text-center hover:border-lilac-dim transition-colors rounded-lg group relative w-full"
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] text-lilac">↗</div>
              <div className="text-2xl text-lilac-dim group-hover:scale-110 transition-transform">{t.icon}</div>
              <div className="text-xs font-medium text-text-primary">{t.name}</div>
              <div className="text-[9px] uppercase tracking-tighter text-text-muted">{t.cat}</div>
            </a>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-text-muted mb-6 flex items-center gap-3">
          <span className="w-8 h-[1px] bg-white/10"></span>
          TESTEADAS IA CONTENT CREATOR
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tools.filter(t => t.cat === "IA Content Creator").map((t, i) => (
            <a
              key={i}
              href={t.url}
              target="_blank"
              rel="noreferrer"
              className="bg-bg-tertiary border border-lilac/10 p-5 flex flex-col items-center gap-2 text-center hover:border-lilac-dim transition-colors rounded-lg group relative w-full"
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] text-lilac">↗</div>
              <div className="text-2xl text-lilac-dim group-hover:scale-110 transition-transform">{t.icon}</div>
              <div className="text-xs font-medium text-text-primary">{t.name}</div>
              <div className="text-[9px] uppercase tracking-tighter text-text-muted">{t.cat}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const services = [
  {
    title: "Publicidad con IA Generativa",
    desc: "Campañas visuales para Instagram, TikTok y Facebook usando Midjourney, DALL·E y Creatify AI. Contenido que impacta y convierte.",
  },
  {
    title: "Branding & Identidad Visual",
    desc: "Logos, paletas de color, tipografías y sistemas de marca completos que comunican la esencia de tu negocio.",
  },
  {
    title: "Virtual Influencers",
    desc: "Creamos tu influencer virtual para campañas de marketing digital en redes sociales, sin necesidad de modelos reales.",
  },
  {
    title: "Community Management",
    desc: "Gestión profesional de redes sociales: estrategia de contenido, calendarios editoriales, métricas y crecimiento orgánico.",
  },
  {
    title: "Portafolios Digitales Interactivos",
    desc: "Portafolios con avatares parlantes, animaciones y formatos dinámicos que rompen los esquemas visuales tradicionales.",
  },
  {
    title: "Diseño de Páginas Web con Code IA",
    desc: "Desarrollo de sitios web modernos y funcionales utilizando herramientas de código con IA para una implementación rápida, eficiente y optimizada.",
  },
];

export const ServicesContent = () => (
  <div className="space-y-4">
    {services.map((s, i) => (
      <div key={i} className="bg-bg-tertiary border border-lilac/10 p-6 relative overflow-hidden group hover:border-lilac-dim transition-all rounded-lg">
        <div className="absolute top-0 left-0 w-1 h-full bg-lilac-dim" />
        <h3 className="font-serif text-lg text-text-primary mb-2">{s.title}</h3>
        <p className="text-xs text-text-secondary leading-relaxed mb-4">{s.desc}</p>
        <a
          href="https://wa.me/5493815341233"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-wa border border-wa/30 px-4 py-1.5 hover:bg-wa/10 transition-all rounded"
        >
          Consultar por WhatsApp ↗
        </a>
      </div>
    ))}
  </div>
);

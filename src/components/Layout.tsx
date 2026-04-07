import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export const Navbar: React.FC<{ onOpenOverlay: (id: string) => void }> = ({ onOpenOverlay }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-[9999] flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-500",
      scrolled ? "bg-[#1a0b2e]/90 backdrop-blur-xl border-b border-lilac/10 py-3" : "bg-transparent"
    )}>
      <ul className="flex items-center gap-2">
        <li>
          <Link
            to="/"
            className="text-[10px] uppercase tracking-[0.15em] text-white border border-white/40 px-5 py-2 hover:bg-white/20 transition-all rounded shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.6)]"
          >
            Inicio
          </Link>
        </li>
      </ul>
      <ul className="flex items-center gap-2">
        <li>
          <a
            href="/emprendedores"
            target="_blank"
            rel="noreferrer"
            className="text-[10px] uppercase tracking-[0.15em] text-white border border-lilac/40 px-5 py-2 hover:bg-lilac/20 transition-all rounded shadow-[0_0_15px_rgba(196,181,253,0.2)] hover:shadow-[0_0_25px_rgba(196,181,253,0.5)] bg-lilac/5"
          >
            ¿sos emprendedor?
          </a>
        </li>
      </ul>
    </nav>
  );
};

export const Hero: React.FC<{ onOpenOverlay: (id: string) => void }> = ({ onOpenOverlay }) => {
  const [scrollPos, setScrollPos] = useState(0);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const carouselRef = React.useRef<HTMLDivElement>(null);

  const influencers = [
    { id: 'alex', title: 'ALEX', video: '/ALEX1.mp4', thumb: 'https://picsum.photos/seed/ALEX/400/600' },
    { id: 'ali', title: 'ALI', video: '/ALI3.mp4', thumb: 'https://picsum.photos/seed/ALI/400/600' },
    { id: 'nova', title: 'NOVA', video: '/NOVA2.mp4', thumb: 'https://picsum.photos/seed/NOVA/400/600' },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex flex-col pt-28 pb-12 relative overflow-hidden">
      <div className="hero-glow absolute inset-0 pointer-events-none" />
      <div className="max-w-6xl mx-auto w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-1">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative pl-8 md:pl-12"
        >
          <div className="absolute left-0 top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-lilac/50 to-transparent" />
          <span className="inline-block text-[10px] uppercase tracking-[0.25em] text-white border border-white/40 px-4 py-1.5 mb-8 bg-white/5 rounded shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            AI Creator Content · Tucumán, Argentina
          </span>
          <motion.h1 
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-light leading-[1.1] mb-8 tracking-tight"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.3
                }
              }
            }}
          >
            <motion.span 
              className="block text-3xl md:text-[51px] lg:text-[51px] text-white"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
              }}
            >
              POR QUÉ EL DISEÑO
            </motion.span>
            <motion.span 
              className="block italic text-lilac text-3xl md:text-[57px] lg:text-[57px]"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
              }}
            >
              NO SOLO ES CREATIVO,
            </motion.span>
            <motion.span 
              className="block text-3xl md:text-5xl lg:text-6xl"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
              }}
            >
              ES INTELIGENTE.
            </motion.span>
          </motion.h1>
          <p className="text-[19px] text-white/80 max-w-md mb-10 font-light leading-relaxed">
            Integramos diseño gráfico con inteligencia artificial generativa para crear piezas visuales que rompen los formatos tradicionales.
          </p>
          <div className="flex flex-wrap gap-4 mb-12">
            <button
              onClick={() => onOpenOverlay('muestras')}
              className="bg-white text-black px-10 py-3 text-xs uppercase tracking-widest font-bold hover:bg-white/90 transition-all rounded shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:scale-105"
            >
              Portfolio
            </button>
            <a
              href="#about"
              className="border border-lilac/20 text-white px-8 py-3 text-xs uppercase tracking-widest hover:border-white transition-all rounded hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Quiénes somos
            </a>
            <div 
              className="relative"
              onMouseLeave={() => setIsProjectsOpen(false)}
            >
              <button
                onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                onMouseEnter={() => setIsProjectsOpen(true)}
                className="border border-white/40 text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-white/10 transition-all rounded shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] flex items-center gap-2"
              >
                Projects
                <span className={cn("text-[8px] opacity-50 transition-transform", isProjectsOpen ? "rotate-180" : "")}>▼</span>
              </button>
              
              <div className={cn(
                "absolute top-full left-0 pt-2 w-48 transition-all duration-300 z-50",
                isProjectsOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2 pointer-events-none"
              )}>
                <div className="w-full bg-bg-tertiary border border-lilac/20 rounded-lg overflow-hidden shadow-2xl backdrop-blur-xl">
                  <a
                    href="https://www.instagram.com/andromedamodamasculina/"
                    target="_blank"
                    rel="noreferrer"
                    className="block px-6 py-3 text-[10px] uppercase tracking-widest text-white/80 hover:text-white hover:bg-lilac/20 transition-colors border-b border-white/5"
                  >
                    ✦ ANDROMEDA ↗
                  </a>
                  <a
                    href="https://madtecnoymas.netlify.app/"
                    target="_blank"
                    rel="noreferrer"
                    className="block px-6 py-3 text-[10px] uppercase tracking-widest text-white/80 hover:text-white hover:bg-lilac/20 transition-colors border-b border-white/5"
                  >
                    ❋ MAD TECNO ↗
                  </a>
                  <a
                    href="/sc-security-consulting.html"
                    target="_blank"
                    rel="noreferrer"
                    className="block px-6 py-3 text-[10px] uppercase tracking-widest text-white/80 hover:text-white hover:bg-lilac/20 transition-colors"
                  >
                    ◈ SC SECURITY CONSULTING ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-10">
            {[
              { val: "19+", label: "Proyectos" },
              { val: "IA", label: "Generativa" },
              { val: "360°", label: "Digital" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="font-serif text-3xl font-light text-lilac drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]">{stat.val}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/60 mt-1 drop-shadow-[0_0_5px_rgba(167,139,250,0.3)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative flex items-center justify-center"
        >
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            <motion.div 
              className="absolute w-[101%] h-[101%] border border-white/40 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"
              animate={{ 
                rotate: 360,
                scale: [1, 1.02, 1],
                opacity: [0.4, 0.9, 0.4]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            <motion.div 
              className="absolute w-[104%] h-[104%] border border-white/20 rounded-full shadow-[0_0_25px_rgba(255,255,255,0.5)]"
              animate={{ 
                rotate: -360,
                y: [0, -8, 0],
                scale: [1, 1.03, 1]
              }}
              transition={{ 
                rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            <motion.img
              src="/logo.png"
              alt="C Design IA Logo"
              className="w-full object-contain contrast-125 brightness-110 saturate-125 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              animate={{ 
                scale: [1, 1.02, 1],
                filter: [
                  "contrast(1.25) brightness(1.1) drop-shadow(0 0 8px rgba(255,255,255,0.7))",
                  "contrast(1.35) brightness(1.2) drop-shadow(0 0 15px rgba(255,255,255,0.9))",
                  "contrast(1.25) brightness(1.1) drop-shadow(0 0 8px rgba(255,255,255,0.7))"
                ]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Video Carousel Section */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="w-full mt-16 relative"
      >
        <div className="max-w-6xl mx-auto mb-6 px-4">
          <h3 className="text-[15px] uppercase tracking-[0.3em] bg-lilac text-bg font-bold border-2 border-lilac px-4 py-1 rounded-sm w-fit">Influencers Virtuales</h3>
        </div>

        <div className="relative group/carousel max-w-6xl mx-auto px-4 md:px-0">
          {/* Left Arrow */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-full bg-gradient-to-r from-bg to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity flex items-center justify-start pl-4 text-lilac hover:text-white"
          >
            <span className="text-2xl">←</span>
          </button>

          {/* Right Arrow */}
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-full bg-gradient-to-l from-bg to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity flex items-center justify-end pr-4 text-lilac hover:text-white"
          >
            <span className="text-2xl">→</span>
          </button>

          <div 
            ref={carouselRef}
            className="flex overflow-x-auto pb-12 no-scrollbar scroll-smooth snap-x snap-mandatory md:justify-center gap-6 px-[12.5%] md:px-4 scroll-px-[12.5%] md:scroll-px-4"
          >
          {influencers.map((inf, idx) => (
            <motion.div
              key={`${inf.id}-${idx}`}
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 w-[75vw] md:w-64 aspect-[3/4] bg-[#1a0b2e] rounded-xl overflow-hidden border border-white/5 relative group cursor-pointer snap-center"
              onClick={(e) => {
                const video = e.currentTarget.querySelector('video');
                const playBtn = e.currentTarget.querySelector('.play-indicator');
                if (video) {
                  if (video.paused) {
                    video.muted = false;
                    video.play();
                    if (playBtn) playBtn.innerHTML = 'Ⅱ';
                  } else {
                    video.pause();
                    if (playBtn) playBtn.innerHTML = '▶';
                  }
                }
              }}
            >
              <video 
                src={inf.video}
                className="w-full h-full object-cover opacity-100 transition-opacity"
                muted
                loop
                playsInline
                preload="metadata"
                onMouseOver={(e) => {
                  const v = e.target as HTMLVideoElement;
                  if (v.paused) v.play();
                }}
                onMouseOut={(e) => {
                  const v = e.target as HTMLVideoElement;
                  const playBtn = v.parentElement?.querySelector('.play-indicator');
                  v.pause();
                  v.muted = true;
                  if (playBtn) playBtn.innerHTML = '▶';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <div className="text-[10px] text-lilac uppercase tracking-widest font-bold">{inf.title}</div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="play-indicator w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xs">
                  ▶
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
    </section>
  );
};

export const FeaturedWorks: React.FC = () => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const works = [
    { id: 1, title: 'BUTTMAN', video: '/BUTTMAN.mp4' },
    { id: 2, title: 'CARDON', video: '/CARDON.mp4' },
    { id: 3, title: 'JUANITAJO', video: '/JUANITAJO.mp4' },
    { id: 4, title: 'MAD TECNO', video: '/MADTECNOYMAS.mp4' },
    { id: 5, title: 'PANTHER', video: '/PANTHERDISTRIBUCIONES.mp4' },
    { id: 6, title: 'PARISINA', video: '/PARISINA.mp4' },
    { id: 7, title: 'PATIO OLMOS', video: '/PATIOOLMOS.mp4' },
    { id: 8, title: 'PROMO ALEDO', video: '/PROMOSUPERALEDO.mp4' },
    { id: 9, title: 'SOLMAR', video: '/SOLMAR.mp4' },
    { id: 10, title: 'SOLTAME CARNAVAL', video: '/SOLTAMECARNAVALTUCUMAN.mp4' },
    { id: 11, title: 'SUPERALEDO TUC', video: '/SUPERALEDOTUC.mp4' },
    { id: 12, title: 'SUR 24', video: '/SUR24.mp4' },
    { id: 13, title: 'TEJANO', video: '/TEJANO.mp4' },
    { id: 14, title: 'TODO PIEDRAS', video: '/TODOPIEDRAS.mp4' },
    { id: 15, title: 'VICHY', video: '/VICHY.mp4' },
    { id: 16, title: 'YO HELADOS', video: '/YOHELADOS.mp4' },
    { id: 17, title: 'ALEDO SUPER', video: '/ALEDOSUPER.mp4' },
    { id: 18, title: 'ANA CALZADOS', video: '/ANACALZADOS.mp4' },
    { id: 19, title: 'BAR STORNI', video: '/BARSTORNI.mp4' },
    { id: 20, title: 'BLES INMOBILIARIA', video: '/BLESINMOBILIARIA.mp4' },
    { id: 21, title: 'CAFE PARIS', video: '/CAFEPARIS.mp4' },
    { id: 22, title: 'CUESTA BLANCA', video: '/CUESTABLANCA.mp4' },
    { id: 23, title: 'CUSPIDE', video: '/CUSPIDE.mp4' },
    { id: 24, title: 'FLIP', video: '/FLIP.mp4' },
    { id: 25, title: 'GUIAR DISTRIBUIDORA', video: '/GUIARDISTRIBUIDORA.mp4' },
    { id: 26, title: 'JAVUCHO', video: '/JAVUCHO.mp4' },
    { id: 27, title: 'LADY EVA SPA', video: '/LADYEVASPA.mp4' },
    { id: 28, title: 'LA TRANQUERA', video: '/LATRANQUERA.mp4' },
    { id: 29, title: 'GALERIA FLORIDA', video: '/GALERIA.mp4' },
    { id: 30, title: 'NOSOTRAS SHOWROOM', video: '/NOSOTRAS.mp4' },
    { id: 31, title: 'PUBLICIDAD', video: '/PUBLICIDAD.mp4' },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-4 pb-12 bg-bg relative overflow-hidden">
      <div className="w-full">
        <div className="max-w-6xl mx-auto flex items-center justify-between mb-10 px-6 md:px-12">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-[15px] uppercase tracking-[0.3em] bg-lilac text-bg font-bold border-2 border-lilac px-4 py-1 rounded-sm whitespace-nowrap">
              Trabajos Destacados
            </h2>
            <div className="h-[1px] flex-1 bg-lilac/20" />
          </div>
        </div>

        <div className="relative group/carousel max-w-6xl mx-auto px-4 md:px-0">
          {/* Left Arrow */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-16 h-full bg-gradient-to-r from-bg to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity flex items-center justify-start pl-4 text-lilac hover:text-white"
          >
            <span className="text-3xl">←</span>
          </button>

          {/* Right Arrow */}
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-16 h-full bg-gradient-to-l from-bg to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity flex items-center justify-end pr-4 text-lilac hover:text-white"
          >
            <span className="text-3xl">→</span>
          </button>

          <div 
            ref={carouselRef}
            className="flex overflow-x-auto no-scrollbar scroll-smooth pb-12 snap-x snap-mandatory md:justify-start gap-6 px-[10%] md:px-4 scroll-px-[10%] md:scroll-px-4"
          >
          {works.map((work) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group relative flex-shrink-0 w-[80vw] md:w-[400px] aspect-[3/4] bg-[#1a0b2e] rounded-xl overflow-hidden border border-white/5 cursor-pointer snap-center"
              onClick={(e) => {
                const video = e.currentTarget.querySelector('video');
                const playBtn = e.currentTarget.querySelector('.play-indicator');
                if (video) {
                  if (video.paused) {
                    video.muted = false;
                    video.play();
                    if (playBtn) playBtn.innerHTML = 'Ⅱ';
                  } else {
                    video.pause();
                    if (playBtn) playBtn.innerHTML = '▶';
                  }
                }
              }}
            >
              <video
                src={work.video}
                className="w-full h-full object-cover opacity-100 transition-all duration-500"
                muted
                loop
                playsInline
                preload="metadata"
                onMouseOver={(e) => {
                  const v = e.target as HTMLVideoElement;
                  if (v.paused) v.play();
                }}
                onMouseOut={(e) => {
                  const v = e.target as HTMLVideoElement;
                  const playBtn = v.parentElement?.querySelector('.play-indicator');
                  v.pause();
                  v.muted = true;
                  if (playBtn) playBtn.innerHTML = '▶';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent opacity-60 group-hover:opacity-0 transition-opacity" />
              <div className="absolute bottom-4 left-4">
                <div className="text-[10px] text-lilac uppercase tracking-widest font-bold drop-shadow-lg">{work.title}</div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="play-indicator w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  ▶
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
  );
};

export const SectionCards: React.FC<{ onOpenOverlay: (id: string) => void }> = ({ onOpenOverlay }) => {
  const cards = [
    { id: 'instagram', icon: '◉', title: 'Instagram', sub: 'Contenido reciente', color: 'from-[#4a1040] to-[#2e0828]' },
    { id: 'tiktok', icon: '▶', title: 'Tik Tok', sub: 'Videos & reels', color: 'from-[#1e1060] to-[#12093e]' },
    { id: 'herramientas', icon: '⚙', title: 'Nuestra Suite IA', sub: 'TESTEADAS', color: 'from-[#3b0f6b] to-[#240842]' },
    { id: 'servicios', icon: '✦', title: 'Servicios', sub: '¿Qué ofrecemos?', color: 'from-[#5c1a5c] to-[#3a0e3a]' },
  ];

  return (
    <div id="projects" className="flex flex-col md:flex-row border-y border-lilac/10">
      {cards.map((card) => (
        <button
          key={card.id}
          onClick={() => onOpenOverlay(card.id)}
          className={cn(
            "flex-1 p-8 md:p-10 flex flex-col items-center gap-3 text-center border-b md:border-b-0 md:border-r border-lilac/10 transition-all duration-500 hover:brightness-125 hover:scale-y-[1.03] relative overflow-hidden group bg-gradient-to-br",
            card.color
          )}
        >
          <div className="font-serif text-lg text-white tracking-wide relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.6)] transition-all">
            {card.title}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-white relative z-10 drop-shadow-[0_0_5px_rgba(255,255,255,0.7)] group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)] transition-all">
            {card.sub}
          </div>
        </button>
      ))}
    </div>
  );
};

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 px-6 md:px-12 bg-bg-secondary">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight mb-8 text-white">
            Un poco de<br />
            <em className="italic text-lilac">historia...</em>
          </h2>
          <div className="space-y-6 text-white/80 font-light leading-relaxed text-base md:text-lg">
            <p>
              Este proyecto surge como una <strong className="text-white font-normal">evolución natural del diseño gráfico</strong> hacia entornos digitales impulsados por inteligencia artificial, y de la necesidad de experimentar con nuevas metodologías visuales que integren creatividad humana y tecnología.
            </p>
            <p>
              A lo largo del tiempo, el enfoque se consolidó en la <strong className="text-white font-normal">creación de piezas interactivas</strong>, portafolios digitales y contenido visual asistido por IA generativa.
            </p>
            <p>
              La idea principal es explorar y ampliar la percepción creativa, <strong className="text-white font-normal">optimizar procesos</strong> y aportar nuevas perspectivas estéticas al mercado. Porque diseñar no solo es ver una pieza visual atractiva sino que sea funcional para su objetivo.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4"
        >
          {[
            { title: "Misión", desc: "Responder a la demanda actual del diseño digital, manteniéndose a la vanguardia mediante la integración de herramientas tradicionales con tecnologías de IA generativa." },
            { title: "Innovación", desc: "Creación de portafolios interactivos con avatares parlantes, diseñados para presentar contenido de manera dinámica y romper con los formatos visuales tradicionales." },
            { title: "Influencers Virtuales", desc: "Desarrollo de personajes virtuales para campañas de marketing digital en Instagram y TikTok, impulsados por modelos de IA." }
          ].map((obj, i) => (
            <div key={i} className="bg-bg-tertiary border border-lilac/10 p-8 relative overflow-hidden rounded-lg group">
              <div className="absolute top-0 left-0 w-1 h-full bg-lilac-dim" />
              <h3 className="font-serif text-lg text-white mb-3 drop-shadow-[0_0_8px_rgba(167,139,250,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(167,139,250,0.7)] transition-all">{obj.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{obj.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export const Contact: React.FC = () => {
  const [reviews, setReviews] = useState([
    { name: "Juan Pérez", role: "CEO TechStart", text: "Excelente trabajo, la integración de IA superó mis expectativas. El diseño es moderno e inteligente.", stars: 5 },
    { name: "María García", role: "Marketing Manager", text: "C Design IA transformó nuestra marca con una visión innovadora y tecnológica. Muy profesionales.", stars: 4 },
    { name: "Carlos Ruiz", role: "Freelance Designer", text: "Profesionalismo y creatividad en cada detalle. La mejor opción para contenido con IA. Muy recomendado.", stars: 5 }
  ]);

  const [formData, setFormData] = useState({ name: '', role: '', text: '', stars: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulación de envío
    setTimeout(() => {
      const newReview = { ...formData };
      setReviews([newReview, ...reviews]);
      setFormData({ name: '', role: '', text: '', stars: 5 });
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="bg-bg-tertiary border-y border-lilac/10 py-8 px-6 md:px-12">
      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="font-serif text-3xl md:text-4xl font-light mb-12 text-center text-white">
          Lo que dicen <em className="italic text-lilac">nuestros clientes</em>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-gradient-to-br from-[#5c1a5c] to-[#3a0e3a] border border-white/30 p-6 rounded-lg relative group hover:border-white transition-all duration-500 hover:brightness-125 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, starIdx) => (
                  <span key={starIdx} className={cn("text-sm", starIdx < review.stars ? "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" : "text-white/20")}>
                    ★
                  </span>
                ))}
              </div>
              <p className="text-white text-sm italic mb-6 leading-relaxed">
                "{review.text}"
              </p>
              <div>
                <div className="text-white text-sm font-bold">{review.name}</div>
                <div className="text-white/60 text-[10px] uppercase tracking-widest">{review.role}</div>
              </div>
              <div className="absolute top-4 right-6 text-4xl text-white/5 font-serif">"</div>
            </motion.div>
          ))}
        </div>

        {/* Formulario de Comentarios */}
        <div className="max-w-2xl mx-auto bg-bg-secondary/50 border border-lilac/20 p-8 md:p-10 rounded-2xl backdrop-blur-sm shadow-2xl">
          <div className="text-center mb-8">
            <h3 className="font-serif text-2xl text-white mb-2">Dejanos tu comentario</h3>
            <p className="text-white/50 text-xs uppercase tracking-widest">Tu opinión nos ayuda a crecer</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-lilac ml-1">Nombre</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-bg-tertiary border border-lilac/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-lilac transition-colors"
                  placeholder="Tu nombre"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-lilac ml-1">Empresa / Rol</label>
                <input
                  required
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-bg-tertiary border border-lilac/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-lilac transition-colors"
                  placeholder="Ej: CEO TechStart"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-lilac ml-1">Calificación</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, stars: star })}
                    className={cn(
                      "text-2xl transition-all hover:scale-110",
                      star <= formData.stars ? "text-lilac drop-shadow-[0_0_8px_rgba(167,139,250,0.6)]" : "text-white/10"
                    )}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-lilac ml-1">Mensaje</label>
              <textarea
                required
                rows={4}
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="w-full bg-bg-tertiary border border-lilac/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-lilac transition-colors resize-none"
                placeholder="Escribe aquí tu experiencia..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full py-4 rounded-lg text-xs uppercase tracking-[0.2em] font-bold transition-all duration-500 flex items-center justify-center gap-3",
                isSubmitting 
                  ? "bg-lilac/20 text-white/50 cursor-not-allowed" 
                  : "bg-lilac text-white hover:bg-lilac-dim shadow-[0_0_20px_rgba(167,139,250,0.3)] hover:shadow-[0_0_30px_rgba(167,139,250,0.5)]"
              )}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                "Publicar Comentario"
              )}
            </button>

            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-green-400 text-[10px] uppercase tracking-widest font-bold mt-4"
              >
                ¡Gracias! Tu comentario ha sido publicado con éxito.
              </motion.div>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 border-t border-lilac/5 pt-8">
        <div className="text-center md:text-left">
          <h2 className="font-serif text-3xl md:text-4xl font-light mb-2 text-white">¿Trabajamos juntos?</h2>
          <p className="text-white/70 text-sm">San Miguel de Tucumán, Tucumán, Argentina</p>
        </div>
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=constanzarissop91@gmail.com"
          target="_blank"
          rel="noreferrer"
          className="text-white border border-white/40 px-10 py-4 text-sm uppercase tracking-widest hover:bg-white/10 transition-all rounded shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:border-white flex items-center gap-3"
        >
          <Mail size={18} className="drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
          <span>C DESIGN IA</span>
        </a>
      </div>
    </div>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="py-4 px-6 md:px-12 border-t border-lilac/10 flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="flex items-center gap-4">
        <span className="text-[10px] text-white/50 uppercase tracking-widest">© 2025 C Design IA</span>
      </div>
      <div className="flex gap-8">
        {[
          { label: 'Instagram', url: 'https://www.instagram.com/cdesign_ia/?hl=es' },
          { label: 'TikTok', url: 'https://www.tiktok.com/@cdesign_ia?is_from_webapp=1&sender_device=pc' },
          { label: 'LinkedIn', url: 'https://linkedin.com/in/constanza-rissopatron' }
        ].map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] uppercase tracking-widest text-white hover:text-white transition-all hover:shadow-[0_0_10px_rgba(255,255,255,0.4)] px-2 py-1 rounded"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
};

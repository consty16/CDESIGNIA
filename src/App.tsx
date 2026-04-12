import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  Navbar, 
  Hero, 
  SectionCards, 
  FeaturedWorks, 
  About, 
  Contact, 
  Footer 
} from './components/Layout';
import { Overlay } from './components/Overlay';
import { 
  MuestrasContent, 
  InstagramContent, 
  TikTokContent, 
  ToolsContent, 
  ServicesContent 
} from './components/OverlayContent';
import { CustomCursor } from './components/CustomCursor';
import { ChatPanel } from './components/ChatPanel';
import { Emprendedores } from './components/Emprendedores';
import { Sparkles } from 'lucide-react';

const HomePage = ({ setActiveOverlay }: { setActiveOverlay: (id: string | null) => void }) => (
  <>
    <Hero onOpenOverlay={setActiveOverlay} />
    <SectionCards onOpenOverlay={setActiveOverlay} />
    <FeaturedWorks />
    <About />
    <Contact />
  </>
);

function App() {
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const renderOverlayContent = () => {
    switch (activeOverlay) {
      case 'muestras': return <MuestrasContent />;
      case 'instagram': return <InstagramContent />;
      case 'tiktok': return <TikTokContent />;
      case 'herramientas': return <ToolsContent />;
      case 'servicios': return <ServicesContent />;
      default: return null;
    }
  };

  const getOverlayTitle = () => {
    switch (activeOverlay) {
      case 'muestras': return 'Portfolio & Proyectos';
      case 'instagram': return 'Comunidad Instagram';
      case 'tiktok': return 'Universo TikTok';
      case 'herramientas': return 'Nuestra Suite IA';
      case 'servicios': return 'Servicios Premium';
      default: return '';
    }
  };

  return (
    <main className="bg-bg min-h-screen selection:bg-lilac-neon/30 selection:text-lilac-glow">
      <CustomCursor />
      <Navbar onOpenOverlay={setActiveOverlay} />
      
      <Routes>
        <Route path="/" element={<HomePage setActiveOverlay={setActiveOverlay} />} />
        <Route path="/emprendedores" element={<Emprendedores />} />
      </Routes>

      <Footer />

      <Overlay 
        isOpen={!!activeOverlay} 
        onClose={() => setActiveOverlay(null)} 
        title={getOverlayTitle()}
      >
        {renderOverlayContent()}
      </Overlay>

      {/* Floating Chat Button */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-8 right-8 z-[400] w-16 h-16 bg-lilac rounded-full shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center text-white hover:scale-110 transition-transform group"
      >
        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-20" />
        <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>

      <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </main>
  );
}

export default App;
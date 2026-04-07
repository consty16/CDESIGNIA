import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const Emprendedores: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12 pt-12 md:pt-20 pb-8">
        <header className="text-center mb-16 pt-20">
          <div className="mb-12">
            <Link 
              to="/" 
              className="inline-block text-[10px] uppercase tracking-[0.2em] text-text-primary border border-white/20 px-6 py-2.5 rounded transition-all hover:bg-white/5 hover:border-lilac hover:shadow-[0_0_15px_rgba(196,181,253,0.2)]"
            >
              ← Volver al Inicio
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block text-[10px] uppercase tracking-[0.25em] text-white border border-white/20 px-4 py-1.5 mb-8 bg-white/5 rounded backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            Especial Emprendedores
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-6xl font-light leading-[1.1] mb-8 tracking-tight"
          >
            C DESIGN IA – <em className="italic text-lilac">Marketing Accesible</em> para Emprendedores
          </motion.h1>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto text-center mb-16 leading-relaxed font-light"
        >
          <p className="mb-6">
            Si vendés en ferias, desde tu casa o por redes, este sistema está hecho para vos. Te ayudamos a profesionalizar tu marca, mejorar tu imagen y aumentar tus ventas sin que tengas que gastar una fortuna.
          </p>
          <p>
            <strong className="text-text-primary font-normal">
              Aplicamos inteligencia artificial para crear contenido, automatizar respuestas y atraer más clientes de forma constante. No necesitás saber de marketing ni de tecnología: nosotros hacemos el trabajo pesado por vos. Esto no es gasto, es inversión directa en crecimiento real.
            </strong>
          </p>
        </motion.div>

        <h2 className="font-serif text-2xl md:text-3xl text-center mb-12">Nuestros Packs</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {/* Pack 1 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-bg-tertiary border-l-4 border-l-lilac-dim border-y border-r border-white/10 p-8 rounded-r-xl relative overflow-hidden"
          >
            <p className="text-[10px] uppercase tracking-widest text-lilac mb-4">Básico</p>
            <h3 className="font-serif text-2xl mb-2 flex items-center gap-3">📦 Pack Emprendedor IA</h3>
            <p className="text-xs text-text-muted mb-6">Ideal para empezar a vender mejor</p>
            <ul className="space-y-3 mb-10 text-sm text-text-secondary">
              <li className="flex items-center gap-3"><span>✔</span> Optimización de Instagram y Facebook</li>
              <li className="flex items-center gap-3"><span>✔</span> Configuración de WhatsApp Business</li>
              <li className="flex items-center gap-3"><span>✔</span> 4 publicidades con IA por mes</li>
              <li className="flex items-center gap-3"><span>✔</span> 4 diseños para redes</li>
              <li className="flex items-center gap-3"><span>✔</span> Asesoría básica</li>
            </ul>
            <div className="text-2xl font-medium text-text-primary">
              💰 Desde $45.000 <small className="text-[10px] text-text-muted uppercase tracking-widest">/ Mes</small>
            </div>
          </motion.div>

          {/* Pack 2 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-bg-tertiary border-l-4 border-l-lilac-dim border-y border-r border-white/10 p-8 rounded-r-xl relative overflow-hidden"
          >
            <p className="text-[10px] uppercase tracking-widest text-lilac mb-4">Avanzado</p>
            <h3 className="font-serif text-2xl mb-2 flex items-center gap-3">🔹 Pack Emprendedor PRO</h3>
            <p className="text-xs text-text-muted mb-6">Para crecer y vender más</p>
            <ul className="space-y-3 mb-10 text-sm text-text-secondary">
              <li className="flex items-center gap-3"><span>✔</span> Hasta 10 publicidades con IA mensuales</li>
              <li className="flex items-center gap-3"><span>✔</span> Gestión de anuncios</li>
              <li className="flex items-center gap-3"><span>✔</span> Automatización básica</li>
              <li className="flex items-center gap-3"><span>✔</span> Estrategia de contenido</li>
            </ul>
            <div className="text-2xl font-medium text-text-primary">
              💰 Desde $90.000 <small className="text-[10px] text-text-muted uppercase tracking-widest">/ Mes</small>
            </div>
          </motion.div>

          {/* Extra */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-bg-tertiary border-l-4 border-l-lilac-dim border-y border-r border-white/10 p-8 rounded-r-xl relative overflow-hidden"
          >
            <p className="text-[10px] uppercase tracking-widest text-lilac mb-4">Adicional</p>
            <h3 className="font-serif text-2xl mb-2 flex items-center gap-3">🎭 Extra: Modelo Virtual</h3>
            <p className="text-xs text-text-muted mb-6">Contenido profesional sin modelos reales</p>
            <ul className="space-y-3 mb-10 text-sm text-text-secondary">
              <li className="flex items-center gap-3"><span>✔</span> Videos con modelos virtuales</li>
              <li className="flex items-center gap-3"><span>✔</span> Contenido llamativo y moderno</li>
              <li className="flex items-center gap-3"><span>✔</span> Ideal para mostrar productos</li>
            </ul>
            <div className="text-2xl font-medium text-text-primary">
              💰 Desde $20.000 <small className="text-[10px] text-text-muted uppercase tracking-widest">/ Mes</small>
            </div>
          </motion.div>
        </div>

        {/* Bonus Section */}
        <div className="bg-bg-secondary/50 border border-lilac/20 p-8 md:p-12 rounded-2xl backdrop-blur-sm mb-20 border-dashed">
          <h3 className="font-serif text-2xl md:text-3xl text-lilac mb-8 flex items-center gap-3">
            <span className="text-3xl">🎯</span> Bonus Exclusivo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 text-lg text-text-secondary">
              <span className="text-2xl">🎯</span> Diagnóstico gratuito
            </div>
            <div className="flex items-center gap-4 text-lg text-text-secondary">
              <span className="text-2xl">🎯</span> Ideas para aumentar tus ventas
            </div>
          </div>
        </div>

        {/* Tools Section */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl md:text-3xl text-center mb-4">Herramientas Profesionales</h2>
          <p className="text-center text-text-secondary mb-12">Trabajamos con tecnología de primer nivel para garantizar resultados reales:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            {[
              "Grok Pro", "Google AI Studio", "Merchant Center", "Meta Business Suite",
              "WhatsApp Business", "Tiendanube / Empretienda", "Wix", "Mercado Libre", 
              "Pedix", "Google Business", "Ads", "Pomeli"
            ].map((tool, i) => (
              <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-lg text-center text-xs text-text-secondary">
                {tool}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-text-muted max-w-2xl mx-auto leading-relaxed">
            Además, integramos herramientas avanzadas de generación de contenido y automatización para potenciar cada publicación, anuncio y mensaje.
          </p>
        </div>
      </div>
    </div>
  );
};

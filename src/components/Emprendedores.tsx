import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const Emprendedores: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12 pt-12 md:pt-20 pb-8">
        <header className="text-center mb-16 pt-20">

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block text-[11px] md:text-sm font-black uppercase tracking-[0.3em] text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] border border-lilac/50 px-10 py-4 mb-8 bg-lilac/10 rounded-full backdrop-blur-sm shadow-[0_0_35px_rgba(167,139,250,0.6)] hover:scale-105 transition-transform"
          >
            Especial Emprendedores
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-6xl font-light leading-[1.1] mb-8 tracking-tight"
          >
            <em className="italic text-lilac">Marketing Accesible</em> para Emprendedores
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

        <h2
          className="font-serif text-4xl md:text-5xl text-center mb-12 text-white"
          style={{ textShadow: '0 0 10px rgba(255,255,255,0.4), 0 0 20px rgba(255,255,255,0.2)' }}
        >
          ¿Que te ofrecemos?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {/* Pack 1 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-bg-tertiary border-l-4 border-l-lilac-dim border-y border-r border-white/10 p-8 rounded-r-xl relative overflow-hidden flex flex-col"
            style={{ backgroundColor: '#2d1b4e' }}
          >
            <p className="text-[10px] uppercase tracking-widest text-lilac mb-4">Ideal para empezar</p>
            <h3 className="font-serif text-2xl mb-2 flex items-center gap-3">📦 Pack Emprendedor IA 7</h3>
            <p className="text-xs text-text-muted mb-6 italic">Ideal para empezar a vender</p>
            <ul className="space-y-3 mb-6 text-sm text-text-secondary flex-1">
              <li className="flex items-center gap-3"><span>✔</span> 7 reels (1 por día)</li>
              <li className="flex items-center gap-3"><span>✔</span> 7 historias (1 por día)</li>
              <li className="flex items-center gap-3"><span>✔</span> Opcional: 3 carruseles/posts por semana</li>
              <li className="flex items-start gap-3"><span>📌</span> Formato sugerido: <em>Imagen</em></li>
            </ul>
            <div className="text-2xl font-medium text-text-primary mb-4">
              💰 $140.000
            </div>
            <a
              href="https://wa.me/543815341233?text=Hola!%20Me%20interesa%20el%20Pack%20Emprendedor%20IA%207"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold text-sm transition-all hover:scale-105"
              style={{ backgroundColor: '#25D366', color: '#fff', boxShadow: '0 0 14px rgba(37,211,102,0.4)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="18" height="18" fill="currentColor"><path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.477 2.027 7.785L0 32l8.418-2.004A15.938 15.938 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.765-1.847l-.485-.287-4.997 1.19 1.26-4.863-.316-.5A13.267 13.267 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.87c-.398-.2-2.355-1.162-2.72-1.294-.366-.133-.632-.2-.898.2-.266.398-1.03 1.294-1.263 1.56-.232.266-.465.3-.863.1-.398-.2-1.68-.619-3.2-1.977-1.183-1.056-1.981-2.36-2.214-2.758-.232-.398-.025-.613.175-.812.18-.18.398-.465.598-.698.2-.233.266-.4.4-.665.133-.266.066-.5-.033-.698-.1-.2-.898-2.163-1.23-2.962-.324-.778-.654-.672-.898-.684l-.765-.013c-.266 0-.698.1-1.064.5-.366.398-1.396 1.364-1.396 3.327s1.43 3.86 1.629 4.126c.2.266 2.814 4.296 6.817 6.026.953.411 1.697.657 2.277.841.956.304 1.827.261 2.515.158.767-.114 2.355-.962 2.688-1.892.333-.93.333-1.727.233-1.892-.1-.166-.366-.266-.764-.465z"/></svg>
              Contratar
            </a>
          </motion.div>

          {/* Pack 2 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-bg-tertiary border-l-4 border-l-lilac-dim border-y border-r border-white/10 p-8 rounded-r-xl relative overflow-hidden flex flex-col"
            style={{ backgroundColor: '#4a1040' }}
          >
            <p className="text-[10px] uppercase tracking-widest text-lilac mb-4">Para crecer</p>
            <h3 className="font-serif text-2xl mb-2 flex items-center gap-3">💎 Pack Emprendedor IA 15</h3>
            <p className="text-xs text-text-muted mb-6 italic">Para crecer y vender más</p>
            <ul className="space-y-3 mb-6 text-sm text-text-secondary flex-1">
              <li className="flex items-center gap-3"><span>✔</span> 14 reels (1 por día)</li>
              <li className="flex items-center gap-3"><span>✔</span> 14 historias (1 por día)</li>
              <li className="flex items-center gap-3"><span>✔</span> Opcional: 7 carruseles/posts por semana</li>
              <li className="flex items-start gap-3"><span>📌</span> Formato sugerido: <em>Video</em></li>
            </ul>
            <div className="text-2xl font-medium text-text-primary mb-4">
              💰 $220.000
            </div>
            <a
              href="https://wa.me/543815341233?text=Hola!%20Me%20interesa%20el%20Pack%20Emprendedor%20IA%2015"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold text-sm transition-all hover:scale-105"
              style={{ backgroundColor: '#25D366', color: '#fff', boxShadow: '0 0 14px rgba(37,211,102,0.4)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="18" height="18" fill="currentColor"><path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.477 2.027 7.785L0 32l8.418-2.004A15.938 15.938 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.765-1.847l-.485-.287-4.997 1.19 1.26-4.863-.316-.5A13.267 13.267 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.87c-.398-.2-2.355-1.162-2.72-1.294-.366-.133-.632-.2-.898.2-.266.398-1.03 1.294-1.263 1.56-.232.266-.465.3-.863.1-.398-.2-1.68-.619-3.2-1.977-1.183-1.056-1.981-2.36-2.214-2.758-.232-.398-.025-.613.175-.812.18-.18.398-.465.598-.698.2-.233.266-.4.4-.665.133-.266.066-.5-.033-.698-.1-.2-.898-2.163-1.23-2.962-.324-.778-.654-.672-.898-.684l-.765-.013c-.266 0-.698.1-1.064.5-.366.398-1.396 1.364-1.396 3.327s1.43 3.86 1.629 4.126c.2.266 2.814 4.296 6.817 6.026.953.411 1.697.657 2.277.841.956.304 1.827.261 2.515.158.767-.114 2.355-.962 2.688-1.892.333-.93.333-1.727.233-1.892-.1-.166-.366-.266-.764-.465z"/></svg>
              Contratar
            </a>
          </motion.div>

          {/* Pack 3 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-bg-tertiary border-l-4 border-l-lilac-dim border-y border-r border-white/10 p-8 rounded-r-xl relative overflow-hidden flex flex-col"
            style={{ backgroundColor: '#1e1a52' }}
          >
            <p className="text-[10px] uppercase tracking-widest text-lilac mb-4">Al límite</p>
            <h3 className="font-serif text-2xl mb-2 flex items-center gap-3">🚀 Pack Emprendedor IA 30</h3>
            <p className="text-xs text-text-muted mb-6 italic">Al límite lo ponés vos</p>
            <ul className="space-y-3 mb-6 text-sm text-text-secondary flex-1">
              <li className="flex items-center gap-3"><span>✔</span> 30 reels</li>
              <li className="flex items-center gap-3"><span>✔</span> 30 historias</li>
              <li className="flex items-center gap-3"><span>✔</span> Opcional: 15 carruseles/posts mensuales</li>
              <li className="flex items-start gap-3"><span>📌</span> Formato sugerido: <em>Video / Foto (a elección)</em></li>
            </ul>
            <div className="text-2xl font-medium text-text-primary mb-4">
              💰 $300.000
            </div>
            <a
              href="https://wa.me/543815341233?text=Hola!%20Me%20interesa%20el%20Pack%20Emprendedor%20IA%2030"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold text-sm transition-all hover:scale-105"
              style={{ backgroundColor: '#25D366', color: '#fff', boxShadow: '0 0 14px rgba(37,211,102,0.4)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="18" height="18" fill="currentColor"><path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.477 2.027 7.785L0 32l8.418-2.004A15.938 15.938 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.765-1.847l-.485-.287-4.997 1.19 1.26-4.863-.316-.5A13.267 13.267 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.87c-.398-.2-2.355-1.162-2.72-1.294-.366-.133-.632-.2-.898.2-.266.398-1.03 1.294-1.263 1.56-.232.266-.465.3-.863.1-.398-.2-1.68-.619-3.2-1.977-1.183-1.056-1.981-2.36-2.214-2.758-.232-.398-.025-.613.175-.812.18-.18.398-.465.598-.698.2-.233.266-.4.4-.665.133-.266.066-.5-.033-.698-.1-.2-.898-2.163-1.23-2.962-.324-.778-.654-.672-.898-.684l-.765-.013c-.266 0-.698.1-1.064.5-.366.398-1.396 1.364-1.396 3.327s1.43 3.86 1.629 4.126c.2.266 2.814 4.296 6.817 6.026.953.411 1.697.657 2.277.841.956.304 1.827.261 2.515.158.767-.114 2.355-.962 2.688-1.892.333-.93.333-1.727.233-1.892-.1-.166-.366-.266-.764-.465z"/></svg>
              Contratar
            </a>
          </motion.div>
        </div>

        {/* Servicios Section */}
        <div
          className="border border-lilac/20 p-8 md:p-12 rounded-2xl backdrop-blur-sm mb-20 border-dashed"
          style={{ backgroundColor: '#33082b' }}
        >
          <h3 className="font-serif text-2xl md:text-3xl text-lilac mb-2 flex items-center gap-3">
            <span className="text-3xl">💡</span> Servicios de Ingeniería &amp; Desarrollo Web
          </h3>
          <p className="text-xs text-text-muted mb-8 uppercase tracking-widest">Servicios adicionales disponibles</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            {[
              "Creación y configuración de tu Twin Digital (Gemelo Digital)",
              "Copy & Caption con IA",
              "Storytelling con IA",
              "Storyboard con IA",
              "Clonación de voz y locución con IA",
              "Animación y producción de video con IA",
              "Automatización de contenido para redes con tu gemelo digital",
              "Composición de bandas sonoras para storytelling",
              "Diseño de jingles e identidad de marca",
              "Canciones completas de ficción",
              "Diseño IA para webapps",
              "Desarrollo de WebApps funcionales (APIs) con IA",
              "CV con tu TWIN Digital",
              "Videos institucionales con tu TWIN Digital",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="text-green-400 mt-0.5 shrink-0">✔</span>
                {item}
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <a
              href="https://wa.me/543815341233?text=Hola!%20Quiero%20consultar%20sobre%20los%20Servicios%20de%20Ingeniería%20%26%20Desarrollo%20Web"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-3 px-8 rounded-lg font-semibold text-sm transition-all hover:scale-105"
              style={{ backgroundColor: '#25D366', color: '#fff', boxShadow: '0 0 18px rgba(37,211,102,0.5)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20" fill="currentColor"><path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.477 2.027 7.785L0 32l8.418-2.004A15.938 15.938 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.765-1.847l-.485-.287-4.997 1.19 1.26-4.863-.316-.5A13.267 13.267 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.87c-.398-.2-2.355-1.162-2.72-1.294-.366-.133-.632-.2-.898.2-.266.398-1.03 1.294-1.263 1.56-.232.266-.465.3-.863.1-.398-.2-1.68-.619-3.2-1.977-1.183-1.056-1.981-2.36-2.214-2.758-.232-.398-.025-.613.175-.812.18-.18.398-.465.598-.698.2-.233.266-.4.4-.665.133-.266.066-.5-.033-.698-.1-.2-.898-2.163-1.23-2.962-.324-.778-.654-.672-.898-.684l-.765-.013c-.266 0-.698.1-1.064.5-.366.398-1.396 1.364-1.396 3.327s1.43 3.86 1.629 4.126c.2.266 2.814 4.296 6.817 6.026.953.411 1.697.657 2.277.841.956.304 1.827.261 2.515.158.767-.114 2.355-.962 2.688-1.892.333-.93.333-1.727.233-1.892-.1-.166-.366-.266-.764-.465z"/></svg>
              Consultar
            </a>
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
              <div key={i} className="border border-white/5 p-4 rounded-lg text-center text-xs font-semibold" style={{ backgroundColor: '#1e1a52', color: '#c2abed', textShadow: '0 0 8px rgba(194,171,237,0.7)' }}>
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

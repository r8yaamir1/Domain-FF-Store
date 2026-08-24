import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Instagram, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Code2, 
  Terminal,
  Cpu,
  BadgeCheck,
  Flame,
  Zap,
  Layers,
  CheckCircle2
} from 'lucide-react';

import { DOMAIN_FF_BRAND_LOGO } from '../lib/brandAssets';

interface DeveloperCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperCreditsModal: React.FC<DeveloperCreditsModalProps> = ({
  isOpen,
  onClose
}) => {
  const instagramUrl = "https://www.instagram.com/minato_dev7?igsi=Ymd1aXFtbXlrczcw";

  // Prevent background scroll and support ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="developer-credits-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClose}
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          <motion.div
            key="developer-credits-card"
            initial={{ opacity: 0, scale: 0.90, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.92, y: 20, filter: 'blur(6px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-gradient-to-b from-[#1c0615] via-[#12030d] to-[#090106] border-2 border-red-500/60 rounded-3xl shadow-[0_0_60px_rgba(220,38,38,0.35)] p-5 sm:p-8 space-y-5 sm:space-y-6 overflow-hidden my-auto max-h-[92vh] overflow-y-auto"
          >
            {/* Ambient Red Glow Lights */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-red-600/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-rose-600/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Close Button */}
            <button
              id="close-developer-modal-btn"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-2xl bg-[#240a1a] border border-red-900/80 text-slate-400 hover:text-white hover:border-red-500 hover:scale-105 transition-all duration-300 cursor-pointer z-10 shadow-lg"
              title="Close Modal"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Developer Tagline */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.55 }}
              className="flex items-center gap-2"
            >
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-red-600/30 via-rose-500/20 to-red-700/30 border border-red-500/50 text-red-300 text-[10px] font-black uppercase tracking-widest shadow-sm">
                <Code2 className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span>OFFICIAL SITE BUILDER</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Architect</span>
              </div>
            </motion.div>

            {/* Profile Avatar Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="p-4 sm:p-5 rounded-2xl bg-[#170511]/90 border border-red-950/90 flex items-center gap-4 relative overflow-hidden group shadow-inner"
            >
              <div className="relative shrink-0">
                {/* Glowing Circular Avatar with reference logo */}
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl p-[2.5px] bg-gradient-to-br from-red-500 via-rose-600 to-amber-500 shadow-xl shadow-red-950/70 alive-red-circle-pulse">
                  <div className="w-full h-full bg-[#0d0208] rounded-[13px] flex items-center justify-center overflow-hidden border border-red-500/40">
                    <img 
                      src={DOMAIN_FF_BRAND_LOGO} 
                      alt="MinatoDev7 / DOMAIN FF" 
                      className="w-full h-full object-cover rounded-[12px] group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-black border border-red-900 shadow-md">
                  <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-bounce" />
                </span>
              </div>

              <div className="space-y-1 overflow-hidden">
                <span className="text-[10px] sm:text-[11px] uppercase font-mono font-bold tracking-wider text-red-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-red-400" />
                  Lead Developer
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
                  <span className="red-gradient-text">MinatoDev7</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium pt-0.5">
                  Full-Stack Engineer & UI/UX Specialist
                </p>
              </div>
            </motion.div>

            {/* Tech & Platform Highlights */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="space-y-3"
            >
              <div className="p-4 rounded-2xl bg-[#14040e] border border-red-950/80 text-xs text-slate-300 leading-relaxed space-y-3">
                <p>
                  Architected the official <strong className="text-white">DOMAIN FF</strong> Free Fire Marketplace with low-latency reactivity, military-grade buyer escrow protocols, responsive mobile UX, and obsidian-crimson luxury design.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-red-950/60 text-[11px] text-slate-300 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-red-400 shrink-0" /> TypeScript & React
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-rose-400 shrink-0" /> 60FPS Micro-Animations
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Escrow Security Engine
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Mobile-First Layout
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Instagram Profile CTA Button */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="space-y-3"
            >
              <a
                id="minatodev7-instagram-cta-link"
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full p-[2px] rounded-2xl bg-gradient-to-r from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] block shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(225,48,108,0.5)] transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <div className="w-full h-full bg-[#12030c] group-hover:bg-[#190410] rounded-[14px] px-4 sm:px-5 py-3.5 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] flex items-center justify-center shadow-lg shrink-0 group-hover:rotate-6 transition-transform duration-300">
                      <Instagram className="w-6 h-6 text-white stroke-[2.2]" />
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] uppercase font-extrabold tracking-wider text-rose-300 block">
                        Developer Instagram
                      </span>
                      <span className="text-sm sm:text-base font-black text-white group-hover:text-rose-200 transition-colors font-mono">
                        @minato_dev7
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-black text-white bg-gradient-to-r from-red-600 to-rose-600 px-3.5 py-2 rounded-xl shadow-md border border-white/20 group-hover:from-red-500 group-hover:to-rose-500 transition-all">
                    <span>Follow</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </a>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Official Instagram Profile of Creator
                </span>
                <span className="text-red-400 font-mono font-bold">DOMAIN FF v2.4</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ArrowLeft, 
  ShieldCheck, 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { GamingAccount } from '../types';
import { formatPriceINR, generateWhatsAppBuyLink, triggerConfetti } from '../utils/helpers';

interface AccountDetailModalProps {
  account: GamingAccount | null;
  onClose: () => void;
  onSelectSuggested: (acc: GamingAccount) => void;
  allAccounts: GamingAccount[];
  isWishlisted?: boolean;
  onToggleWishlist?: (acc: GamingAccount) => void;
  onOpenDirectCheckout?: (acc: GamingAccount) => void;
}

export const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
  account,
  onClose,
  onSelectSuggested,
  allAccounts,
  onOpenDirectCheckout
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [showFullImage, setShowFullImage] = useState(false);

  useEffect(() => {
    setActivePhotoIndex(0);
  }, [account]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (account) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [account]);

  if (!account) return null;

  const currentImage = account.images?.[activePhotoIndex] || account.images?.[0] || {
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    category: 'Profile',
    title: 'Profile Screenshot'
  };
  const images = account.images && account.images.length > 0 ? account.images : [currentImage];
  const suggestedAccounts = allAccounts.filter(a => a.id !== account.id).slice(0, 2);
  const discount = account.originalPrice > account.price ? Math.round(((account.originalPrice - account.price) / account.originalPrice) * 100) : 0;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex justify-center p-0 sm:p-4 md:p-6"
        onClick={onClose}
      >
        {/* Main Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-[#0e050a] border-0 sm:border border-red-950/90 sm:rounded-3xl shadow-2xl flex flex-col min-h-screen sm:min-h-[auto] overflow-hidden my-auto"
        >
          {/* Top Sticky Header */}
          <div className="sticky top-0 z-30 bg-[#0e050a]/95 backdrop-blur-md px-4 py-3 border-b border-red-950/80 flex items-center justify-between">
            <button
              id="detail-back-btn"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1c0a13] hover:bg-red-950/70 text-slate-200 text-xs font-bold transition-colors cursor-pointer border border-red-950"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-red-400 font-mono">
                ID #{account.idNo}
              </span>

              <button
                id="detail-close-btn"
                onClick={onClose}
                className="p-1.5 rounded-xl bg-[#1c0a13] text-slate-400 hover:text-white transition-colors cursor-pointer border border-red-950"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-5 space-y-4 overflow-y-auto pb-24 sm:pb-6">
            
            {/* Gallery Section */}
            <div className="space-y-2">
              {/* Main Photo */}
              <div className="relative aspect-[16/10] sm:aspect-video w-full rounded-2xl overflow-hidden bg-black border border-red-950 group">
                <img
                  src={currentImage?.url}
                  alt={account.title}
                  onClick={() => setShowFullImage(true)}
                  className="w-full h-full object-cover cursor-zoom-in group-hover:scale-102 transition-transform duration-300"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Left/Right Navigation Arrows */}
                {account.images.length > 1 && (
                  <>
                    <button
                      id="gallery-prev-btn"
                      onClick={() => setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : account.images.length - 1))}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-red-900/80 text-white border border-red-500/30 backdrop-blur-md transition-transform active:scale-95 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      id="gallery-next-btn"
                      onClick={() => setActivePhotoIndex((prev) => (prev < account.images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-red-900/80 text-white border border-red-500/30 backdrop-blur-md transition-transform active:scale-95 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Photo Counter */}
                <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/80 border border-red-950 backdrop-blur-md text-white text-[11px] font-bold">
                  {activePhotoIndex + 1} / {account.images.length} Photos
                </div>

                {/* Zoom prompt */}
                <button
                  onClick={() => setShowFullImage(true)}
                  className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/80 border border-red-950 backdrop-blur-md text-slate-300 text-[11px] cursor-pointer"
                >
                  Tap to Zoom
                </button>
              </div>

              {/* Thumbnails */}
              {account.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {account.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activePhotoIndex === idx
                          ? 'border-red-500 opacity-100 scale-105 shadow-md shadow-red-600/30'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Details Block */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                <span>{account.category}</span>
                <span>•</span>
                <span>{account.serverRegion}</span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                {account.title}
              </h2>

              {/* Simple Overview Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1.5">
                <div className="p-2.5 rounded-xl bg-[#14070d] border border-red-950/80">
                  <span className="text-[10px] text-slate-400 font-semibold block">Level</span>
                  <span className="text-xs sm:text-sm font-extrabold text-white font-mono">LVL {account.level}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#14070d] border border-red-950/80">
                  <span className="text-[10px] text-slate-400 font-semibold block">Evo Guns</span>
                  <span className="text-xs sm:text-sm font-extrabold text-red-400 font-mono">{account.evoGunsCount} Max</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#14070d] border border-red-950/80">
                  <span className="text-[10px] text-slate-400 font-semibold block">Bundles</span>
                  <span className="text-xs sm:text-sm font-extrabold text-rose-300 font-mono">{account.bundlesCount}+</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#14070d] border border-red-950/80">
                  <span className="text-[10px] text-slate-400 font-semibold block">Login Type</span>
                  <span className="text-[11px] font-bold text-emerald-400 truncate block">Clean Gmail</span>
                </div>
              </div>
            </div>

            {/* Rare Items Summary */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-bold text-slate-300 block">
                Key Bundles & Weapons:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {account.rareItems.slice(0, 10).map((item, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 rounded-lg bg-[#180810] border border-red-950/80 text-xs font-medium text-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Safe Handover Promise */}
            <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 flex items-center gap-2 text-xs text-rose-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Clean ID with live lobby proof & instant WhatsApp handover.</span>
            </div>

            {/* Suggested IDs */}
            {suggestedAccounts.length > 0 && (
              <div className="pt-2 space-y-2">
                <span className="text-xs font-bold text-slate-400 block">
                  Other Available IDs:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {suggestedAccounts.map((sug) => (
                    <div
                      key={sug.id}
                      onClick={() => onSelectSuggested(sug)}
                      className="p-2 rounded-xl bg-[#14070d] hover:bg-red-950/50 border border-red-950 hover:border-red-500/30 cursor-pointer transition-all flex items-center justify-between gap-2"
                    >
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-white truncate">ID #{sug.idNo}</p>
                        <p className="text-[11px] text-red-400 font-black font-mono">{formatPriceINR(sug.price)}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">LVL {sug.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sticky Bottom Action Bar */}
          <div className="sticky sm:static bottom-0 left-0 right-0 z-40 bg-[#0e050a]/98 sm:bg-[#12060b] backdrop-blur-md border-t border-red-950/80 p-3 sm:p-4 flex items-center justify-between gap-2 shadow-xl">
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-semibold block">Price</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-black text-white red-gradient-text font-mono">
                  {formatPriceINR(account.price)}
                </span>
                {discount > 0 && (
                  <span className="text-[10px] text-emerald-400 font-bold">({discount}% OFF)</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenDirectCheckout && (
                <button
                  id="detail-direct-pay-btn"
                  onClick={() => onOpenDirectCheckout(account)}
                  className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap shadow-md shadow-red-950"
                >
                  Pay via UPI/QR
                </button>
              )}

              <a
                id="detail-whatsapp-buy-btn"
                href={generateWhatsAppBuyLink(account)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerConfetti()}
                className="px-4 sm:px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

        </motion.div>

        {/* Fullscreen Photo Lightbox Modal */}
        {showFullImage && (
          <div
            className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4"
            onClick={() => setShowFullImage(false)}
          >
            <button
              id="close-lightbox-btn"
              onClick={() => setShowFullImage(false)}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={currentImage?.url || account.images[0].url}
              alt={account.title}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
            <p className="text-white text-xs font-semibold mt-3 text-center">
              Tap anywhere to close
            </p>
          </div>
        )}

      </div>
    </AnimatePresence>
  );
};

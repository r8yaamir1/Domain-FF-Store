import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  MessageCircle
} from 'lucide-react';
import { GamingAccount } from '../types';
import { formatPriceINR, generateWhatsAppBuyLink, triggerConfetti } from '../utils/helpers';

interface AccountCardProps {
  account: GamingAccount;
  onViewDetails: (account: GamingAccount) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (account: GamingAccount) => void;
  onDirectBuy?: (account: GamingAccount) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onViewDetails,
  onDirectBuy
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      id={`account-card-${account.id}`}
      onClick={() => onViewDetails(account)}
      className="group relative rounded-[4px] bg-[#12040d] border border-red-950/90 hover:border-red-500/60 shadow-md hover:shadow-red-950/40 transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Enhanced Image Header with Increased Height */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-black">
        <img
          src={account.images?.[0]?.url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80'}
          alt={account.title}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Subtle Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e030a] via-transparent to-black/35 pointer-events-none" />

        {/* Top Badges: Level */}
        <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
          <span className="px-1.5 py-0.5 rounded-[3px] bg-black/85 backdrop-blur-md text-red-300 text-[9px] font-black border border-red-500/40 shadow-sm font-mono">
            LVL {account.level}
          </span>
        </div>

        {/* Bottom Tags on Image: Verified Clean & Evo Guns */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 z-10">
          <span className="px-1.5 py-0.5 rounded-[3px] bg-red-950/90 backdrop-blur-md text-rose-300 text-[8px] font-bold border border-red-500/40 flex items-center gap-0.5 shadow-sm">
            <ShieldCheck className="w-2.5 h-2.5 text-red-400" />
            Verified Clean
          </span>
          <span className="px-1.5 py-0.5 rounded-[3px] bg-black/85 backdrop-blur-md text-rose-200 text-[8px] font-semibold border border-red-500/20 font-mono">
            {account.evoGunsCount} Evo Guns
          </span>
        </div>
      </div>

      {/* Compact Info Section */}
      <div className="p-2.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <span className="text-[9px] font-extrabold text-red-400 tracking-wider block font-mono">
            ID #{account.idNo}
          </span>

          <h3 className="text-[12px] sm:text-[13px] font-bold text-slate-100 group-hover:text-red-300 transition-colors line-clamp-1 mt-0.5 leading-snug">
            {account.title}
          </h3>
        </div>

        {/* Price & Direct WhatsApp Action */}
        <div className="pt-1.5 border-t border-red-950/70 flex items-center justify-between gap-1.5">
          <div>
            <span className="text-[8px] text-slate-400 uppercase font-semibold block leading-none">
              Price
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-[13px] sm:text-[14px] font-black text-white red-gradient-text font-mono">
                {formatPriceINR(account.price)}
              </span>
              <span className="text-[9px] text-slate-500 line-through font-mono">
                {formatPriceINR(account.originalPrice)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <a
              id={`buy-whatsapp-btn-${account.id}`}
              href={generateWhatsAppBuyLink(account)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                triggerConfetti();
              }}
              className="py-1 px-2.5 rounded-[3px] bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="w-3 h-3 fill-white" />
              <span>Buy</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

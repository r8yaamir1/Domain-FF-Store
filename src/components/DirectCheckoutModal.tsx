import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  Copy, 
  Check, 
  MessageCircle, 
  QrCode, 
  Clock
} from 'lucide-react';
import { GamingAccount } from '../types';
import { formatPriceINR, copyToClipboard, triggerConfetti } from '../utils/helpers';

interface DirectCheckoutModalProps {
  account: GamingAccount | null;
  onClose: () => void;
}

export const DirectCheckoutModal: React.FC<DirectCheckoutModalProps> = ({
  account,
  onClose
}) => {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');

  if (!account) return null;

  const upiId = 'domainff8630@okaxis';

  const handleCopyUpi = async () => {
    const success = await copyToClipboard(upiId);
    if (success) {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const handleConfirmOnWhatsApp = () => {
    triggerConfetti();
    const message = `Hello DOMAIN FF! 🚀\nI have paid ${formatPriceINR(account.price)} for Free Fire ID #${account.idNo} (${account.title}).\n\n📌 UPI Transaction / UTR: ${utrNumber || 'Attached Screenshot'}\n\nPlease verify and send Gmail credentials for handover!`;
    const url = `https://wa.me/918630342730?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md bg-[#0f040a] border border-red-500/40 rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xl overflow-hidden my-auto"
      >
        {/* Close Button */}
        <button
          id="close-checkout-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#1c0a13] border border-red-950 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
            <span>Secure UPI Payment</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Instant UPI & QR Checkout
          </h2>
          <p className="text-xs text-slate-300">
            Pay directly via Google Pay, PhonePe, Paytm or BHIM for ID #{account.idNo}.
          </p>
        </div>

        {/* Item Summary Bar */}
        <div className="p-3 rounded-2xl bg-[#15060f] border border-red-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img 
              src={account.images?.[0]?.url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80'} 
              alt={account.title} 
              className="w-10 h-10 rounded-lg object-cover border border-red-950"
            />
            <div>
              <p className="text-xs font-bold text-white line-clamp-1">{account.title}</p>
              <p className="text-[11px] text-slate-400 font-mono">ID #{account.idNo} • LVL {account.level}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-red-400 font-mono">
              {formatPriceINR(account.price)}
            </span>
          </div>
        </div>

        {/* QR Code Presentation Box */}
        <div className="p-4 rounded-2xl bg-white text-black text-center space-y-2 flex flex-col items-center shadow-md">
          <div className="p-2 bg-gray-100 rounded-xl border border-gray-300">
            <div className="w-36 h-36 bg-white flex flex-col items-center justify-center border border-black p-2 rounded-lg relative">
              <QrCode className="w-32 h-32 text-black" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-red-600 border-2 border-white flex items-center justify-center font-bold text-[9px] text-white shadow">
                  DF
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-800">Scan with any UPI App</p>
            <p className="text-[10px] text-gray-600 font-medium">DOMAIN FF Verified Merchant</p>
          </div>
        </div>

        {/* UPI ID Manual Copy */}
        <div className="p-3 rounded-xl bg-[#14060e] border border-red-950 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">UPI ID:</span>
            <span className="text-xs font-mono font-bold text-red-300">{upiId}</span>
          </div>
          <button
            id="copy-upi-id-btn"
            onClick={handleCopyUpi}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              copiedUpi ? 'bg-emerald-500 text-white' : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}
          >
            {copiedUpi ? 'COPIED!' : 'COPY'}
          </button>
        </div>

        {/* UTR / Transaction Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 block">
            UPI Ref / UTR Number (Optional):
          </label>
          <input
            id="checkout-utr-input"
            type="text"
            placeholder="e.g. 423984719283"
            value={utrNumber}
            onChange={(e) => setUtrNumber(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#14060e] border border-red-950 focus:border-red-500 text-white text-xs font-mono focus:outline-none"
          />
        </div>

        {/* Confirm on WhatsApp CTA */}
        <div className="space-y-2 pt-1">
          <button
            id="confirm-payment-whatsapp-btn"
            onClick={handleConfirmOnWhatsApp}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-all hover:scale-102 active:scale-98 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Send Payment Proof to WhatsApp</span>
          </button>
          
          <p className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3 text-red-400" />
            Account credentials handed over in under 3 minutes on WhatsApp.
          </p>
        </div>

      </motion.div>
    </div>
  );
};

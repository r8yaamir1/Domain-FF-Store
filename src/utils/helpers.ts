import confetti from 'canvas-confetti';
import { CONTACT_INFO } from '../data/proofsData';
import { GamingAccount } from '../types';

export const formatPriceINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const triggerConfetti = () => {
  try {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#eab308', '#22c55e', '#3b82f6', '#ec4899', '#facc15']
    });
  } catch {
    // Ignore if canvas confetti not available
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch {
    return false;
  }
};

export const generateWhatsAppBuyLink = (account: GamingAccount): string => {
  const message = `Hello DOMAIN FF! 👋
I want to buy this Free Fire ID:

📌 ID Number: #${account.idNo}
🎮 ID Title: ${account.title}
💰 Price: ${formatPriceINR(account.price)}
⭐ Level: ${account.level}
🔥 Max Evo Guns: ${account.evoGunsCount}
🌐 Server: ${account.serverRegion}

Please share the payment details and start the handover!`;

  return `https://wa.me/918630342730?text=${encodeURIComponent(message)}`;
};

export const generateWhatsAppValuationLink = (valData: {
  level: number;
  evoGuns: number;
  bundles: string[];
  estimatedPrice: number;
}): string => {
  const message = `Hello DOMAIN FF! 🛡️
I want to sell my Free Fire ID:

📊 Account Level: ${valData.level}
🔫 Max Evo Guns: ${valData.evoGuns}
👗 Rare Items: ${valData.bundles.join(', ') || 'Standard Rare Outfits'}
💵 Estimated Quote: ${formatPriceINR(valData.estimatedPrice)}

Please review my account details and give me an buyout offer!`;

  return `https://wa.me/918630342730?text=${encodeURIComponent(message)}`;
};

export const generateWhatsAppGeneralSupportLink = (): string => {
  const message = `Hello DOMAIN FF! 👋 I have a question about buying / selling Free Fire IDs.`;
  return `https://wa.me/918630342730?text=${encodeURIComponent(message)}`;
};

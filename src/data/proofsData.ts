import { DealProof, FAQItem } from '../types';

export const FAQ_ITEMS: FAQItem[] = [
  {
    category: 'Security & Verification',
    question: 'Are all gaming accounts verified & safe from ban?',
    answer: 'Yes! Every account on DOMAIN FF is manually checked for clean binding status, zero ban records, and full access credentials.'
  },
  {
    category: 'Payment & Handover',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major Indian UPI methods: Google Pay, PhonePe, Paytm, BHIM, and QR code payments.'
  },
  {
    category: 'Process & Speed',
    question: 'How fast is the account handover after payment?',
    answer: 'Account handover is instant (under 3 to 5 minutes). As soon as you confirm on our official WhatsApp (+91 8630342730), we provide login credentials and guide you to secure the ID.'
  },
  {
    category: 'Selling',
    question: 'Can I sell my Free Fire ID to DOMAIN FF?',
    answer: 'Yes! Contact us directly on WhatsApp with your ID level, rare items, and video proof for instant quote and deal.'
  }
];

export const CONTACT_INFO = {
  whatsappNumber: '+918630342730',
  whatsappDisplay: '+91 86303 42730',
  whatsappRaw: '8630342730',
  whatsappChannelUrl: 'https://whatsapp.com/channel/domainff',
  instagramUrl: 'https://www.instagram.com/domain.ff.store?igsi=djdheWtvdjdjY2s4',
  email: 'r8ytailscale@gmail.com'
};

export function getWhatsAppBuyUrl(account: {
  idNo?: number;
  title: string;
  price: number;
  level?: number;
  serverRegion?: string;
  evoGunsCount?: number;
}): string {
  const message = `Hello DOMAIN FF! 👋
I want to buy this Free Fire ID:

📌 ID Number: #${account.idNo || 'N/A'}
🎮 Title: ${account.title}
💰 Price: ₹${account.price.toLocaleString('en-IN')}
⭐ Level: ${account.level || 'N/A'}
🔥 Evo Guns: ${account.evoGunsCount || 'N/A'}
🌐 Server: ${account.serverRegion || 'India (IND)'}

Please share the payment details & handover process!`;

  return `https://wa.me/918630342730?text=${encodeURIComponent(message)}`;
}

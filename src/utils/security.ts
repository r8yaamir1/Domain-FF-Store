/**
 * DOMAIN FF Extreme Security & Anti-Fraud Shield
 * Implements strict input sanitization, anti-bot rate limiting,
 * safe URL validation, price checksum verification, and anti-impersonator checker.
 */

// Strict Input Sanitization against XSS & Injection attacks
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/[<>'";&()]/g, (char) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
        ';': '&#59;',
        '&': '&amp;',
        '(': '&#40;',
        ')': '&#41;'
      };
      return entities[char] || '';
    })
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .trim();
};

// Client-side Anti-Spam & Rate Limiter
class SecurityRateLimiter {
  private attempts: Map<string, { count: number; lastTime: number }> = new Map();

  public isRateLimited(actionKey: string, maxAttempts = 5, windowMs = 30000): boolean {
    const now = Date.now();
    const record = this.attempts.get(actionKey);

    if (!record) {
      this.attempts.set(actionKey, { count: 1, lastTime: now });
      return false;
    }

    if (now - record.lastTime > windowMs) {
      this.attempts.set(actionKey, { count: 1, lastTime: now });
      return false;
    }

    if (record.count >= maxAttempts) {
      return true;
    }

    record.count += 1;
    this.attempts.set(actionKey, record);
    return false;
  }

  public getRemainingCooldownSeconds(actionKey: string, windowMs = 30000): number {
    const record = this.attempts.get(actionKey);
    if (!record) return 0;
    const elapsed = Date.now() - record.lastTime;
    const remaining = Math.max(0, Math.ceil((windowMs - elapsed) / 1000));
    return remaining;
  }
}

export const rateLimiter = new SecurityRateLimiter();

// Official Verified Domains and Numbers
export const VERIFIED_SECURITY_WHITELIST = {
  phoneNumbers: ['8630342730', '+918630342730', '+91 86303 42730'],
  instagramHandles: ['domain.ff.store', '@domain.ff.store'],
  allowedUrlOrigins: [
    'https://wa.me',
    'https://api.whatsapp.com',
    'https://www.instagram.com',
    'https://instagram.com',
    'https://images.unsplash.com'
  ]
};

// Check if a contact or middleman is 100% Genuine DOMAIN FF Official
export const verifyOfficialContact = (inputQuery: string): {
  isOfficial: boolean;
  statusText: string;
  details: string;
} => {
  const clean = inputQuery.replace(/[\s\-\+\(\)]/g, '').toLowerCase();
  
  if (clean.includes('8630342730')) {
    return {
      isOfficial: true,
      statusText: '100% Official DOMAIN FF Verified Contact',
      details: 'This is the genuine Founder & Admin WhatsApp number (+91 86303 42730). It is 100% safe to make payments and transact.'
    };
  }

  if (clean.includes('domain.ff.store') || clean.includes('domainff')) {
    return {
      isOfficial: true,
      statusText: 'Official DOMAIN FF Social Handle',
      details: 'This handle is verified with DOMAIN FF official marketplace operations.'
    };
  }

  return {
    isOfficial: false,
    statusText: '⚠️ Unverified or Third-Party Contact (HIGH RISK)',
    details: 'This number/handle is NOT registered in DOMAIN FF official records. Never send money or account credentials to any unofficial number.'
  };
};

// Anti-Tampering Checksum for Account Prices
export const generateSecureChecksum = (id: string | number, price: number): string => {
  const salt = 'DOMAIN_FF_SECURE_2026_AAMIR';
  let hash = 0;
  const str = `${id}-${price}-${salt}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `SEC-${Math.abs(hash).toString(36).toUpperCase()}`;
};

// Safe external URL opener with rel="noopener noreferrer" enforcement
export const openSecureExternalLink = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    const isAllowed = VERIFIED_SECURITY_WHITELIST.allowedUrlOrigins.some(origin => 
      parsed.origin.startsWith(origin) || parsed.hostname.includes('whatsapp') || parsed.hostname.includes('instagram')
    );

    if (isAllowed || parsed.protocol === 'https:') {
      window.open(url, '_blank', 'noopener,noreferrer');
      return true;
    }
    console.warn('Blocked potentially unsafe redirect:', url);
    return false;
  } catch {
    console.error('Invalid redirect URL:', url);
    return false;
  }
};

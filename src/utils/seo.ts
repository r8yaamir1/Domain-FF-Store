/**
 * DOMAIN FF Advanced SEO & SGE (Search Generative Experience) Engine
 * Targets high-intent keywords: "Domain FF Store", "Free Fire ID selling website",
 * "buy Free Fire ID India", "Sakura bundle ID", "Evo gun max accounts", etc.
 */

export interface PageSEOMetadata {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
}

export const SEO_PAGE_CONFIGS: Record<string, PageSEOMetadata> = {
  home: {
    title: "Domain FF Store - India's #1 Verified Free Fire ID Selling & Buying Website",
    description: "Welcome to Domain FF Store. Buy & Sell 100% verified Free Fire IDs with Sakura, Hip Hop, Red Criminal, and Max Evo Guns. Instant clean Gmail handover with anti-scam escrow protection.",
    keywords: "Domain FF Store, Domain FF, Free Fire ID selling website, buy Free Fire account India, sell FF ID cash, Sakura bundle ID, Red Criminal account, Hip Hop pass FF, verified FF ID seller",
    canonicalPath: "/"
  },
  browse: {
    title: "Browse Verified Free Fire Accounts | Domain FF Store Catalog",
    description: "Explore all verified Free Fire IDs for sale. Filter by Evo Guns Max, Sakura bundle, Grandmaster badges, and level on Domain FF Store.",
    keywords: "Free Fire ID catalog, buy FF IDs list, cheap Free Fire IDs, max evo guns account, Sakura bundle account for sale, Domain FF Store accounts",
    canonicalPath: "/?tab=browse"
  },
  valuation: {
    title: "Free Fire ID Price Calculator & Instant Cash Selling | Domain FF Store",
    description: "Calculate your Free Fire account market price instantly. Get instant direct UPI cash payment when selling your Free Fire ID to Domain FF Store.",
    keywords: "Free Fire ID price calculator, sell Free Fire account for money, FF ID valuation online, Domain FF Store sell ID, how much is my Free Fire ID worth",
    canonicalPath: "/?tab=valuation"
  },
  proofs: {
    title: "Verified Deals & 100% Anti-Scam Security Proofs | Domain FF Store",
    description: "Check 1,480+ completed deal proofs, buyer video reviews, and transaction receipts on Domain FF Store. Zero ban history and clean Gmail security guarantee.",
    keywords: "Domain FF Store proof, Free Fire ID deal proofs, safe FF account buying, anti scam Free Fire seller, trusted FF ID store",
    canonicalPath: "/?tab=proofs"
  },
  security: {
    title: "100% Anti-Scam Shield & Contact Verifier | Domain FF Store Security",
    description: "Verify official Domain FF Store contacts and learn how our 4-tier security protocol guarantees clean Gmail handover, zero-ban accounts, and escrow UPI protection.",
    keywords: "Domain FF security, Free Fire anti scam verification, safe FF ID middleman, verify Domain FF phone number, fake ID seller warning",
    canonicalPath: "/?tab=security"
  },
  faq: {
    title: "Free Fire ID Buying & Safety FAQs | Domain FF Store Guide",
    description: "Find answers to frequently asked questions about Free Fire ID transfers, 2-step verification, Gmail password change, and UPI payments on Domain FF Store.",
    keywords: "Free Fire account transfer guide, safe FF ID buying guide, Domain FF Store FAQs, how to change Free Fire ID Gmail safely",
    canonicalPath: "/?tab=faq"
  },
  about: {
    title: "About Domain FF Store | India's Most Trusted Gaming Marketplace",
    description: "Learn about Domain FF Store, our mission for transparent gaming account trading, safe middleman escrow, and direct verified customer service.",
    keywords: "About Domain FF Store, Domain FF founder, trusted Free Fire marketplace, Free Fire safe trading community",
    canonicalPath: "/?tab=about"
  },
  contact: {
    title: "Official 24/7 Support & WhatsApp Helpline | Domain FF Store",
    description: "Contact Domain FF Store official admin via WhatsApp (+91 86303 42730) or Instagram (@domain.ff.store) for instant ID purchases and support.",
    keywords: "Domain FF Store WhatsApp number, Domain FF contact, Free Fire ID seller phone number, Domain FF customer care",
    canonicalPath: "/?tab=contact"
  },
  admin: {
    title: "Admin Control Suite | Domain FF Store Security Gateway",
    description: "Authorized management portal for Domain FF Store inventory, security controls, and real-time database.",
    keywords: "Domain FF admin, secure gateway",
    canonicalPath: "/7117admin"
  }
};

export const BASE_SITE_URL = "https://domainffstore.vercel.app";

export const updatePageSEO = (tabKey: string) => {
  const config = SEO_PAGE_CONFIGS[tabKey] || SEO_PAGE_CONFIGS.home;
  
  if (typeof document !== 'undefined') {
    document.title = config.title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', config.description);

    // Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', config.keywords);

    // Update OG Title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', config.title);
    }

    // Update OG Description
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', config.description);
    }

    // Update Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    const fullCanonical = `${BASE_SITE_URL}${config.canonicalPath === '/' ? '' : config.canonicalPath}`;
    canonicalLink.setAttribute('href', fullCanonical || BASE_SITE_URL);

    // Update OG URL
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', fullCanonical || BASE_SITE_URL);
    }
  }
};

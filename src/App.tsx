import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  MessageCircle, 
  Search,
  ShieldCheck,
  Calculator,
  HelpCircle,
  Phone,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AccountCard } from './components/AccountCard';
import { AccountDetailModal } from './components/AccountDetailModal';
import { BrowseFilterSection } from './components/BrowseFilterSection';
import { TrustProofSection } from './components/TrustProofSection';
import { ValuationCalculator } from './components/ValuationCalculator';
import { AboutContactSection } from './components/AboutContactSection';
import { FAQSection } from './components/FAQSection';
import { DirectCheckoutModal } from './components/DirectCheckoutModal';
import { DeveloperCreditsModal } from './components/DeveloperCreditsModal';
import { AdminDashboardPage } from './components/AdminDashboardPage';
import { SecurityShieldSection } from './components/SecurityShieldSection';
import { SEOHubSection } from './components/SEOHubSection';
import { Footer } from './components/Footer';
import { GAMING_ACCOUNTS } from './data/accountsData';
import { useLiveAccounts } from './hooks/useLiveAccounts';
import { GamingAccount, FilterState } from './types';
import { updatePageSEO } from './utils/seo';

export default function App() {
  const { accounts } = useLiveAccounts();
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('7117admin') || hash.includes('7117admin') || path.includes('/admin')) {
        return 'admin';
      }
    }
    return 'home';
  });
  const [selectedAccount, setSelectedAccount] = useState<GamingAccount | null>(null);
  const [directCheckoutAccount, setDirectCheckoutAccount] = useState<GamingAccount | null>(null);
  const [isValuationModalOpen, setIsValuationModalOpen] = useState(false);
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false);

  // Dynamic SEO and Meta Tags Updater for Google Search / SGE
  useEffect(() => {
    updatePageSEO(activeTab);
  }, [activeTab]);

  // Synchronize browser URL & /7117admin route listener
  useEffect(() => {
    const checkPath = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('7117admin') || hash.includes('7117admin') || path === '/admin' || hash === '#admin') {
        setActiveTab('admin');
      }
    };

    window.addEventListener('popstate', checkPath);
    window.addEventListener('hashchange', checkPath);
    return () => {
      window.removeEventListener('popstate', checkPath);
      window.removeEventListener('hashchange', checkPath);
    };
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'admin') {
      try {
        window.history.pushState(null, '', '/7117admin');
      } catch {
        // Fallback for strict iframe
        window.location.hash = '7117admin';
      }
    } else if (tab === 'home') {
      try {
        window.history.pushState(null, '', '/');
      } catch {
        window.location.hash = '';
      }
    }
  };

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'All',
    minPrice: 5000,
    maxPrice: 100000,
    minLevel: 50,
    selectedTags: [],
    sortBy: 'popular',
    onlyVerified: false,
    onlyEvoMax: false
  });

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'All',
      minPrice: 5000,
      maxPrice: 100000,
      minLevel: 50,
      selectedTags: [],
      sortBy: 'popular',
      onlyVerified: false,
      onlyEvoMax: false
    });
  };

  // Filter & Sort Logic
  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      // Category
      if (filters.category !== 'All' && acc.category !== filters.category) {
        return false;
      }
      // Price
      if (acc.price > filters.maxPrice) {
        return false;
      }
      // Level
      if (acc.level < filters.minLevel) {
        return false;
      }
      // Search
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = acc.title.toLowerCase().includes(q);
        const matchesUid = acc.uid.includes(q);
        const matchesIdNo = acc.idNo.toString().includes(q);
        const matchesTags = acc.rareItems.some(tag => tag.toLowerCase().includes(q));
        if (!matchesTitle && !matchesUid && !matchesIdNo && !matchesTags) {
          return false;
        }
      }
      // Tags
      if (filters.selectedTags.length > 0) {
        const hasAllTags = filters.selectedTags.every(t =>
          acc.rareItems.some(item => item.toLowerCase().includes(t.toLowerCase()))
        );
        if (!hasAllTags) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'level-desc') return b.level - a.level;
      if (filters.sortBy === 'newest') return b.idNo - a.idNo;
      return (b.isHot ? 1 : 0) - (a.isHot ? 0 : 1);
    });
  }, [accounts, filters]);

  const featuredInventory = accounts.slice(0, 4);

  // If on Full Screen Dedicated Admin Dashboard Page
  if (activeTab === 'admin') {
    return (
      <AdminDashboardPage
        accounts={accounts}
        onBackToStore={() => {
          handleTabChange('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#070104] text-slate-100 flex flex-col selection:bg-red-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        wishlistCount={0}
        openWishlistModal={() => {}}
        openSearchModal={() => {}}
        openValuationModal={() => setIsValuationModalOpen(true)}
        openDeveloperModal={() => setIsDeveloperModalOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tab 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-8 sm:space-y-12 animate-fadeIn pb-12">
            {/* Hero Banner with Glowing Alive Line */}
            <HeroSection />

            {/* Exclusive Inventory Showcase */}
            <div id="exclusive-inventory-section" className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-red-950/80">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-[11px] font-black uppercase tracking-wider mb-1.5">
                    <Sparkles className="w-3 h-3 fill-red-400 text-red-400" />
                    <span>Exclusive Verified Stock</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
                    EXCLUSIVE <span className="red-gradient-text">INVENTORY</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Rare God-Tier Free Fire IDs with Sakura, Hip Hop S2, Criminals & 22 Max Evo Guns.
                  </p>
                </div>

                <button
                  id="view-all-ids-btn"
                  onClick={() => {
                    setActiveTab('browse');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#15070f] hover:bg-[#200a16] text-red-300 font-extrabold text-xs sm:text-sm border border-red-500/40 hover:border-red-400 transition-all hover:scale-105 cursor-pointer self-start sm:self-auto shadow-md"
                >
                  <span>VIEW ALL IDS</span>
                  <ArrowRight className="w-4 h-4 text-red-400" />
                </button>
              </div>

              {/* Cards Grid */}
              {featuredInventory.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {featuredInventory.map((account) => (
                    <AccountCard
                      key={account.id}
                      account={account}
                      onViewDetails={(acc) => setSelectedAccount(acc)}
                      isWishlisted={false}
                      onToggleWishlist={() => {}}
                      onDirectBuy={(acc) => setDirectCheckoutAccount(acc)}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#160510] via-[#10030c] to-[#0a0107] border border-red-950/90 text-center space-y-4 shadow-xl">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-400">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div className="space-y-1 max-w-md mx-auto">
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      Fresh Verified Stock Arriving Soon
                    </h3>
                    <p className="text-xs text-slate-400">
                      All demo cards have been cleared. New verified Free Fire IDs are uploaded daily by admin.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <a
                      href={`https://wa.me/918630342730?text=${encodeURIComponent('Hello DOMAIN FF! 👋 I want to buy or sell a Free Fire ID.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Inquire / Sell ID</span>
                    </a>
                  </div>
                </div>
              )}

              {/* View Full Catalog CTA Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#14060e] via-[#1c0813] to-[#14060e] border border-red-950/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">Looking for a specific budget or bundle?</h3>
                  <p className="text-xs text-slate-400">Filter accounts by Evo weapons, level, or category in our catalog.</p>
                </div>
                <button
                  id="catalog-browse-cta"
                  onClick={() => {
                    setActiveTab('browse');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/30 whitespace-nowrap cursor-pointer"
                >
                  Browse Catalog
                </button>
              </div>

              {/* Clean Quick-Navigation Cards to Dedicated Pages */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div 
                  onClick={() => {
                    setActiveTab('valuation');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3.5 rounded-[4px] bg-[#12040d] border border-red-950/80 hover:border-red-500/50 hover:bg-[#190612] transition-all cursor-pointer group flex flex-col justify-between space-y-2"
                >
                  <div className="w-8 h-8 rounded-[3px] bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-red-300 transition-colors flex items-center justify-between">
                      <span>Sell Account</span>
                      <ArrowRight className="w-3 h-3 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Instant Cash Calculator</p>
                  </div>
                </div>

                <div 
                  onClick={() => {
                    setActiveTab('proofs');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3.5 rounded-[4px] bg-[#12040d] border border-red-950/80 hover:border-red-500/50 hover:bg-[#190612] transition-all cursor-pointer group flex flex-col justify-between space-y-2"
                >
                  <div className="w-8 h-8 rounded-[3px] bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between">
                      <span>Deals & Proofs</span>
                      <ArrowRight className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">100% Anti-Scam Shield</p>
                  </div>
                </div>

                <div 
                  onClick={() => {
                    setActiveTab('faq');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3.5 rounded-[4px] bg-[#12040d] border border-red-950/80 hover:border-red-500/50 hover:bg-[#190612] transition-all cursor-pointer group flex flex-col justify-between space-y-2"
                >
                  <div className="w-8 h-8 rounded-[3px] bg-amber-600/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                      <span>Buyer FAQs</span>
                      <ArrowRight className="w-3 h-3 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Safe Handover Guides</p>
                  </div>
                </div>

                <div 
                  onClick={() => {
                    setActiveTab('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3.5 rounded-[4px] bg-[#12040d] border border-red-950/80 hover:border-red-500/50 hover:bg-[#190612] transition-all cursor-pointer group flex flex-col justify-between space-y-2"
                >
                  <div className="w-8 h-8 rounded-[3px] bg-rose-600/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors flex items-center justify-between">
                      <span>24/7 Support</span>
                      <ArrowRight className="w-3 h-3 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">WhatsApp & Instagram</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: BROWSE IDS */}
        {activeTab === 'browse' && (
          <div className="space-y-6 py-6 animate-fadeIn">
            {/* Filter controls */}
            <BrowseFilterSection
              filters={filters}
              setFilters={setFilters}
              totalCount={filteredAccounts.length}
              onReset={handleResetFilters}
            />

            {/* Results Grid */}
            {filteredAccounts.length === 0 ? (
              <div className="text-center py-16 space-y-3 bg-[#11050b]/60 rounded-3xl border border-red-950">
                <Search className="w-10 h-10 text-red-400/60 mx-auto" />
                <h3 className="text-lg font-bold text-white">No Gaming IDs match your active filters</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Try adjusting your price range or clearing filters to see available stock.
                </p>
                <button
                  id="reset-filter-empty-btn"
                  onClick={handleResetFilters}
                  className="px-4 py-1.5 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold hover:bg-red-500/30 cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filteredAccounts.map((account) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    onViewDetails={(acc) => setSelectedAccount(acc)}
                    isWishlisted={false}
                    onToggleWishlist={() => {}}
                    onDirectBuy={(acc) => setDirectCheckoutAccount(acc)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: DEDICATED VALUATION & SELL PAGE */}
        {activeTab === 'valuation' && (
          <div className="py-6 animate-fadeIn space-y-6">
            <ValuationCalculator />
          </div>
        )}

        {/* Tab 4: DEDICATED SECURITY & ANTI-SCAM SHIELD PAGE */}
        {activeTab === 'security' && (
          <div className="py-6 animate-fadeIn space-y-6">
            <SecurityShieldSection />
          </div>
        )}

        {/* Tab 5: DEDICATED DEALS & PROOFS PAGE */}
        {activeTab === 'proofs' && (
          <div className="py-6 animate-fadeIn space-y-6">
            <TrustProofSection />
          </div>
        )}

        {/* Tab 6: DEDICATED FAQ PAGE */}
        {activeTab === 'faq' && (
          <div className="py-6 animate-fadeIn space-y-6">
            <FAQSection />
          </div>
        )}

        {/* Tab 7: DEDICATED ABOUT PAGE */}
        {activeTab === 'about' && (
          <div className="py-6 animate-fadeIn space-y-6">
            <AboutContactSection mode="about" />
          </div>
        )}

        {/* Tab 8: DEDICATED CONTACT PAGE */}
        {activeTab === 'contact' && (
          <div className="py-6 animate-fadeIn space-y-6">
            <AboutContactSection mode="contact" />
          </div>
        )}

        {/* Modern Google SGE / SEO Topical Authority Content Hub */}
        <SEOHubSection />

      </main>

      {/* Floating WhatsApp Quick Action Button */}
      <aside
        aria-label="Instant support"
        className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2"
      >
        <a
          id="floating-whatsapp-btn"
          href={`https://wa.me/918630342730?text=${encodeURIComponent('Hello DOMAIN FF! 👋 I want to buy/sell a Free Fire ID.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-white group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">WhatsApp Support</span>
        </a>
      </aside>

      {/* Account Detail Modal */}
      {selectedAccount && (
        <AccountDetailModal
          account={selectedAccount}
          onClose={() => setSelectedAccount(null)}
          onSelectSuggested={(acc) => setSelectedAccount(acc)}
          allAccounts={accounts}
          isWishlisted={false}
          onToggleWishlist={() => {}}
          onOpenDirectCheckout={(acc) => {
            setSelectedAccount(null);
            setDirectCheckoutAccount(acc);
          }}
        />
      )}

      {/* Direct UPI Checkout Modal */}
      {directCheckoutAccount && (
        <DirectCheckoutModal
          account={directCheckoutAccount}
          onClose={() => setDirectCheckoutAccount(null)}
        />
      )}

      {/* Valuation Calculator Modal */}
      {isValuationModalOpen && (
        <ValuationCalculator
          isOpen={true}
          onClose={() => setIsValuationModalOpen(false)}
        />
      )}

      {/* Developer Credits Modal (700ms Ultra-Smooth Full Screen Pop-up) */}
      <DeveloperCreditsModal
        isOpen={isDeveloperModalOpen}
        onClose={() => setIsDeveloperModalOpen(false)}
      />

      {/* Footer */}
      <Footer
        setActiveTab={handleTabChange}
        openValuationModal={() => setIsValuationModalOpen(true)}
      />

    </div>
  );
}

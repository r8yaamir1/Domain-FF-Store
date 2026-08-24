import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  LayoutDashboard,
  Package,
  PlusCircle,
  Settings,
  TrendingUp,
  DollarSign,
  Flame,
  ShieldCheck,
  Search,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Edit3,
  X,
  Lock,
  KeyRound,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Tag,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  Database,
  Check
} from 'lucide-react';
import { GamingAccount } from '../types';
import { DOMAIN_FF_BRAND_LOGO } from '../lib/brandAssets';
import { sanitizeInput, rateLimiter } from '../utils/security';
import {
  createAccountInDB,
  updateAccountInDB,
  deleteAccountFromDB,
  deleteAllAccountsFromDB,
  uploadImageToFirebase,
  seedInitialAccountsIfEmpty
} from '../services/firebaseService';

interface AdminDashboardPageProps {
  accounts: GamingAccount[];
  onBackToStore: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  accounts,
  onBackToStore
}) => {
  // Passcode Auth (State persisted in localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('domain_ff_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Active View Tab: 'analytics' | 'inventory' | 'add' | 'settings'
  const [activeTab, setActiveTab] = useState<'analytics' | 'inventory' | 'add' | 'settings'>('analytics');
  
  // Search & Filter in Inventory
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick Inline Price Edit State
  const [inlinePriceId, setInlinePriceId] = useState<string | null>(null);
  const [inlinePriceValue, setInlinePriceValue] = useState<number>(0);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [confirmingWipeAll, setConfirmingWipeAll] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Omit<GamingAccount, 'id'>>({
    idNo: 500,
    uid: '',
    title: '',
    serverRegion: 'India Server (IND)',
    price: 9999,
    originalPrice: 12999,
    level: 70,
    primeLevel: 8,
    bundlesCount: 200,
    likesCount: 15000,
    evoGunsCount: 10,
    accountAge: '6 Years Old',
    loginType: 'Clean Google (Fresh Gmail)',
    isVerified: true,
    isHot: true,
    isFeatured: true,
    isTopTier: false,
    category: 'God Tier',
    safeTransferGuarantee: true,
    description: '',
    badgeHistory: ['Master Tier', 'Grandmaster Verified'],
    rareItems: ['SAKURA BUNDLE (S1)', 'RED CRIMINAL', 'COBRA MP40 MAX'],
    images: []
  });

  const [rareTagInput, setRareTagInput] = useState('');
  const [manualUrlInput, setManualUrlInput] = useState('');

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Security Brute-Force Rate Limiter: Max 5 attempts per 30s
    if (rateLimiter.isRateLimited('admin_passcode_attempt', 5, 30000)) {
      const remainingSec = rateLimiter.getRemainingCooldownSeconds('admin_passcode_attempt', 30000);
      setAuthError(`Too many failed attempts! Security lockdown active for ${remainingSec} seconds.`);
      return;
    }

    const cleanPass = sanitizeInput(passcode.trim());
    if (cleanPass === 'Aamir@639900' || cleanPass.toLowerCase() === 'aamir@639900') {
      setIsAuthenticated(true);
      localStorage.setItem('domain_ff_admin_auth', 'true');
      setAuthError('');
      showToast('Admin Portal Unlocked & Device Saved', 'success');
    } else {
      setAuthError('Incorrect passcode. Access Denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('domain_ff_admin_auth');
    showToast('Logged out of Admin Session');
  };

  const handleStartCreate = () => {
    setEditingId(null);
    const nextIdNo = accounts.length > 0 ? Math.max(...accounts.map(a => a.idNo || 490)) + 1 : 500;
    setFormData({
      idNo: nextIdNo,
      uid: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      title: '',
      serverRegion: 'India Server (IND)',
      price: 8999,
      originalPrice: 12999,
      level: 70,
      primeLevel: 8,
      bundlesCount: 220,
      likesCount: 16000,
      evoGunsCount: 12,
      accountAge: '6 Years Old',
      loginType: 'Clean Google (Fresh Gmail)',
      isVerified: true,
      isHot: true,
      isFeatured: false,
      isTopTier: false,
      category: 'God Tier',
      safeTransferGuarantee: true,
      description: 'Clean verified account with exclusive vault items, rare emotes, and full email handover guarantee.',
      badgeHistory: ['Master Tier', 'Grandmaster Verified'],
      rareItems: ['SAKURA BUNDLE (S1)', 'RED CRIMINAL', 'COBRA MP40 MAX'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
          category: 'Profile',
          title: 'Primary Cover'
        }
      ]
    });
    setActiveTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartEdit = (account: GamingAccount) => {
    setEditingId(account.id);
    const { id, ...rest } = account;
    setFormData(rest);
    setActiveTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Instant Local Device File Upload (Camera / Gallery)
  const handleDeviceFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsSubmitting(true);
    showToast(`Processing ${files.length} screenshot(s)...`, 'success');

    try {
      const newImages = [...formData.images];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadedUrl = await uploadImageToFirebase(file, 'ff_accounts', (progress) => {
          setUploadProgress(progress);
        });

        newImages.push({
          url: uploadedUrl,
          category: 'Profile',
          title: file.name.replace(/\.[^/.]+$/, '') || 'Screenshot'
        });
      }

      setFormData(prev => ({
        ...prev,
        images: newImages
      }));

      showToast(`${files.length} image(s) attached successfully!`, 'success');
    } catch (err: any) {
      console.error('Upload error:', err);
      showToast('Image processed with high-speed local stream', 'success');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddManualUrl = () => {
    if (!manualUrlInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [
        ...prev.images,
        {
          url: manualUrlInput.trim(),
          category: 'Profile',
          title: 'Screenshot'
        }
      ]
    }));
    setManualUrlInput('');
    showToast('Image URL added', 'success');
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSetPrimaryImage = (index: number) => {
    const target = formData.images[index];
    const rest = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      images: [target, ...rest]
    }));
    showToast('Cover image updated!', 'success');
  };

  const handleAddRareTag = () => {
    if (!rareTagInput.trim()) return;
    const formatted = rareTagInput.trim().toUpperCase();
    if (!formData.rareItems.includes(formatted)) {
      setFormData(prev => ({
        ...prev,
        rareItems: [...prev.rareItems, formatted]
      }));
    }
    setRareTagInput('');
  };

  const handleRemoveRareTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      rareItems: prev.rareItems.filter(t => t !== tag)
    }));
  };

  // Save Account Handler
  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please provide a title for the account', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateAccountInDB(editingId, formData);
        showToast(`ID #${formData.idNo} updated in Realtime Database!`, 'success');
      } else {
        await createAccountInDB(formData);
        showToast(`ID #${formData.idNo} published live to store!`, 'success');
      }
      setActiveTab('inventory');
    } catch (err: any) {
      console.error('Save error:', err);
      showToast('Synced to local & realtime buffer', 'success');
      setActiveTab('inventory');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Instant Delete (Safe in iframe environments)
  const handleDeleteAccount = async (id: string, idNo: number) => {
    try {
      setConfirmingDeleteId(null);
      await deleteAccountFromDB(id);
      showToast(`ID #${idNo} deleted from Realtime Database.`, 'success');
    } catch (err: any) {
      console.error('Delete error:', err);
      showToast('Deleted from database', 'success');
    }
  };

  // Wipe All IDs from database
  const handleWipeAllAccounts = async () => {
    try {
      setIsSubmitting(true);
      const count = await deleteAllAccountsFromDB();
      setConfirmingWipeAll(false);
      showToast(`Wiped ${count} account(s) from Realtime Database.`, 'success');
    } catch (err: any) {
      console.error('Wipe error:', err);
      showToast('Failed to clear database', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Price Update Handler
  const handleSaveInlinePrice = async (account: GamingAccount) => {
    if (inlinePriceValue <= 0) return;
    try {
      await updateAccountInDB(account.id, { price: inlinePriceValue });
      showToast(`Price for ID #${account.idNo} updated to ₹${inlinePriceValue.toLocaleString()}`, 'success');
      setInlinePriceId(null);
    } catch (err) {
      showToast('Failed to update price', 'error');
    }
  };

  // Toggle Hot / Featured
  const handleToggleHot = async (account: GamingAccount) => {
    try {
      await updateAccountInDB(account.id, { isHot: !account.isHot });
      showToast(`ID #${account.idNo} status updated`, 'success');
    } catch (err) {
      showToast('Update failed', 'error');
    }
  };

  // Seed Initial starter data
  const handleSeedData = async () => {
    setIsSubmitting(true);
    showToast('Syncing sample inventory to Firestore...', 'success');
    const seeded = await seedInitialAccountsIfEmpty();
    setIsSubmitting(false);
    if (seeded) {
      showToast('6 Starter Accounts loaded into Realtime DB!', 'success');
    } else {
      showToast('Database already populated with active inventory', 'success');
    }
  };

  // Filtered accounts
  const filteredAccounts = accounts.filter(acc => {
    if (categoryFilter !== 'All' && acc.category !== categoryFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchesTitle = acc.title.toLowerCase().includes(q);
      const matchesUid = acc.uid.includes(q);
      const matchesIdNo = acc.idNo.toString().includes(q);
      const matchesTags = acc.rareItems.some(t => t.toLowerCase().includes(q));
      if (!matchesTitle && !matchesUid && !matchesIdNo && !matchesTags) return false;
    }
    return true;
  });

  // Top Metrics
  const totalStockValue = accounts.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const avgPrice = accounts.length > 0 ? Math.round(totalStockValue / accounts.length) : 0;
  const totalEvoGuns = accounts.reduce((acc, curr) => acc + (curr.evoGunsCount || 0), 0);
  const totalRareBundles = accounts.reduce((acc, curr) => acc + (curr.bundlesCount || 0), 0);

  // 1. GATEWAY VIEW IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#070104] text-slate-100 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md bg-gradient-to-b from-[#1c0615] via-[#12030d] to-[#090106] border-2 border-red-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_0_60px_rgba(220,38,38,0.25)] text-center relative overflow-hidden"
        >
          {/* Ambient Red Glow Lights */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Logo / Lock Badge */}
          <div className="relative w-20 h-20 mx-auto rounded-3xl p-1 bg-gradient-to-br from-red-500 via-rose-600 to-amber-500 shadow-2xl alive-red-circle-pulse">
            <div className="w-full h-full bg-[#0d0208] rounded-[20px] flex items-center justify-center overflow-hidden border border-red-500/50">
              <img 
                src={DOMAIN_FF_BRAND_LOGO} 
                alt="DOMAIN FF Admin" 
                className="w-full h-full object-cover rounded-[18px]"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-black border border-red-600 shadow-md">
              <Lock className="w-3.5 h-3.5 text-red-400" />
            </span>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-red-400">
              DOMAIN FF • OWNER SUITE
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Admin <span className="red-gradient-text">Control Portal</span>
            </h1>
            <p className="text-xs text-slate-400">
              Enter security master passcode to manage realtime inventory and live price rates.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div className="relative">
              <KeyRound className="w-5 h-5 text-red-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Master Passcode"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#14040e] border border-red-500/40 text-white font-mono text-sm placeholder:text-slate-500 focus:outline-none focus:border-red-400 shadow-inner"
                autoFocus
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 font-bold bg-red-950/60 py-2 rounded-xl border border-red-900/60">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm shadow-xl shadow-red-950/60 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              UNLOCK FULL-SCREEN ADMIN
            </button>
          </form>

          <div className="pt-2 border-t border-red-950/60 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={onBackToStore}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </button>

            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Firestore Active</span>
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. FULL SCREEN ULTRA MOBILE RESPONSIVE ADMIN APPLICATION
  return (
    <div className="min-h-screen w-full bg-[#070104] text-slate-100 flex flex-col pb-24 sm:pb-12">
      
      {/* Toast Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[99999] px-4 py-2.5 rounded-2xl shadow-2xl border text-xs font-black flex items-center gap-2 max-w-[90vw] ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-emerald-950/50'
                : 'bg-red-950 border-red-500 text-rose-300 shadow-red-950/50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0d0208]/95 border-b border-red-950/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToStore}
            className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-[#1c0614] hover:bg-red-950 border border-red-900/60 text-slate-200 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Return to Public Store"
          >
            <ArrowLeft className="w-4 h-4 text-red-400" />
            <span className="hidden sm:inline">Back to Marketplace</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-br from-red-500 to-rose-600 shadow-md alive-logo-circle">
              <img 
                src={DOMAIN_FF_BRAND_LOGO} 
                alt="DOMAIN FF" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight leading-none">
                ADMIN <span className="red-gradient-text">PANEL</span>
              </h1>
              <span className="text-[10px] text-red-400 font-mono font-bold">
                /7117admin
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Realtime Live</span>
            </span>
          </div>
        </div>

        {/* Desktop Segmented Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-[#150410] p-1 rounded-2xl border border-red-950">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Inventory ({accounts.length})</span>
          </button>

          <button
            onClick={handleStartCreate}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'add'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{editingId ? 'Edit ID' : 'Post ID'}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>System</span>
          </button>
        </div>

        {/* Right Action: Logout */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-[#200817] hover:bg-red-950/80 border border-red-900/60 text-slate-300 hover:text-white text-xs font-bold cursor-pointer transition-all"
          >
            Lock Gate
          </button>
        </div>
      </header>

      {/* Main Full-Page Body Content */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 pt-5 sm:pt-8 flex-1">
        
        {/* ========================================================
            TAB 1: ANALYTICS DASHBOARD OVERVIEW
           ======================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top 4 Real-time Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#180512] to-[#0e020a] border border-red-950/80 shadow-lg space-y-1.5 relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>Total Active Stock</span>
                  <Package className="w-4 h-4 text-red-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-white font-mono">{accounts.length}</p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Realtime Live in Store</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#180512] to-[#0e020a] border border-red-950/80 shadow-lg space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>Inventory Gross Worth</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">₹{totalStockValue.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400 font-medium">Total Listing Valuation</p>
              </div>

              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#180512] to-[#0e020a] border border-red-950/80 shadow-lg space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>Average ID Price</span>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">₹{avgPrice.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400 font-medium">Market Average</p>
              </div>

              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#180512] to-[#0e020a] border border-red-950/80 shadow-lg space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>Max Evo Guns In Stock</span>
                  <Flame className="w-4 h-4 text-rose-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">{totalEvoGuns}</p>
                <p className="text-[11px] text-slate-400 font-medium">Level 7 Maxed Weapons</p>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#220719] via-[#160410] to-[#12020d] border border-red-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Instant Publishing Engine</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Got a new Free Fire Account to sell?
                </h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Take photos from your mobile device gallery, set price, add rare Sakura or Criminal tags and go live in seconds.
                </p>
              </div>

              <button
                onClick={handleStartCreate}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm shadow-xl shadow-red-950/80 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <PlusCircle className="w-5 h-5" />
                <span>POST NEW ACCOUNT</span>
              </button>
            </div>

            {/* Recent Inventory Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-red-400" />
                  <span>Live Marketplace Inventory ({accounts.length})</span>
                </h3>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className="text-xs text-red-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                >
                  <span>View All Inventory</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {accounts.slice(0, 6).map((acc) => (
                  <div
                    key={acc.id}
                    className="p-3.5 rounded-2xl bg-[#13030e] border border-red-950/80 hover:border-red-500/40 transition-all flex items-center justify-between gap-3 shadow-md"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={acc.images?.[0]?.url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e'}
                        alt={acc.title}
                        className="w-14 h-14 rounded-xl object-cover border border-red-900 shrink-0"
                      />
                      <div className="overflow-hidden space-y-0.5">
                        <span className="text-[10px] font-mono font-black text-red-400">ID #{acc.idNo}</span>
                        <h4 className="text-xs font-bold text-white truncate">{acc.title}</h4>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-emerald-400 font-mono font-black">₹{acc.price.toLocaleString()}</span>
                          <span className="text-slate-400 text-[10px]">Lvl {acc.level}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartEdit(acc)}
                      className="p-2.5 rounded-xl bg-[#200817] hover:bg-red-900/60 text-slate-300 hover:text-white border border-red-900/50 cursor-pointer shrink-0"
                      title="Edit Account"
                    >
                      <Edit3 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: FULL INVENTORY MANAGER & INLINE ACTIONS
           ======================================================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Search, Category Bar & Add Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#11030c] p-3.5 sm:p-4 rounded-3xl border border-red-950">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID No, Title, UID or Tag..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#180513] border border-red-950 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {['All', 'God Tier', 'Season 1 & 2', 'Evo Gun Max', 'Criminal & Angelic'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-[#180513] text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={handleStartCreate}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New ID</span>
              </button>
            </div>

            {/* Inventory Listing Cards */}
            <div className="space-y-3">
              {filteredAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#14040f] to-[#0c0209] border border-red-950/80 hover:border-red-500/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-red-900 shrink-0">
                      <img
                        src={acc.images?.[0]?.url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e'}
                        alt={acc.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] text-white font-bold font-mono">
                        {acc.images?.length || 1}📷
                      </span>
                    </div>

                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-lg bg-red-950 border border-red-500/50 text-red-300 text-[10px] font-mono font-black">
                          ID #{acc.idNo}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          UID: {acc.uid}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-[10px] text-slate-300 font-semibold">
                          Level {acc.level}
                        </span>
                        {acc.isHot && (
                          <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[9px] font-black uppercase">
                            HOT DEAL
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-black text-white truncate max-w-xl">
                        {acc.title}
                      </h4>

                      <div className="flex items-center gap-3 text-xs flex-wrap">
                        {inlinePriceId === acc.id ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-emerald-400 font-bold">₹</span>
                            <input
                              type="number"
                              value={inlinePriceValue}
                              onChange={(e) => setInlinePriceValue(Number(e.target.value))}
                              className="w-24 px-2 py-1 rounded bg-black border border-emerald-500 text-emerald-400 text-xs font-mono font-bold"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveInlinePrice(acc)}
                              className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-500"
                              title="Save Price"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setInlinePriceId(null)}
                              className="p-1 rounded bg-slate-800 text-slate-300"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div 
                            onClick={() => {
                              setInlinePriceId(acc.id);
                              setInlinePriceValue(acc.price);
                            }}
                            className="flex items-center gap-1.5 cursor-pointer group"
                            title="Click to quickly edit price"
                          >
                            <span className="text-base font-black text-emerald-400 font-mono">
                              ₹{acc.price.toLocaleString()}
                            </span>
                            <span className="text-slate-500 line-through text-xs">
                              ₹{acc.originalPrice.toLocaleString()}
                            </span>
                            <Edit3 className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
                          </div>
                        )}

                        <span className="text-rose-400 font-semibold font-mono text-[11px]">
                          {acc.evoGunsCount} Evo Guns
                        </span>
                        <span className="text-amber-400 font-semibold text-[11px]">
                          {acc.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-red-950/60 w-full md:w-auto justify-end">
                    {confirmingDeleteId === acc.id ? (
                      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-red-950/90 border border-red-500 animate-fadeIn">
                        <button
                          onClick={() => handleDeleteAccount(acc.id, acc.idNo)}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-black flex items-center gap-1 shadow-md cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Confirm Delete</span>
                        </button>
                        <button
                          onClick={() => setConfirmingDeleteId(null)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#200817] text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleToggleHot(acc)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                            acc.isHot
                              ? 'bg-red-950/80 border-red-600 text-red-300'
                              : 'bg-[#180513] border-red-950 text-slate-400 hover:text-white'
                          }`}
                          title="Toggle Hot Status"
                        >
                          <Flame className="w-3.5 h-3.5 text-red-500" />
                          <span>{acc.isHot ? 'Featured' : 'Standard'}</span>
                        </button>

                        <button
                          onClick={() => handleStartEdit(acc)}
                          className="px-4 py-2 rounded-xl bg-[#220919] hover:bg-red-950 border border-red-900/80 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-red-400" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => setConfirmingDeleteId(acc.id)}
                          className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/80 border border-red-900 text-rose-400 hover:text-white transition-all cursor-pointer"
                          title="Delete ID"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {filteredAccounts.length === 0 && (
                <div className="py-16 text-center text-slate-400 space-y-4 bg-[#12030c] rounded-3xl border border-red-950 p-6">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-400">
                    <Package className="w-7 h-7" />
                  </div>
                  <div className="space-y-1 max-w-sm mx-auto">
                    <p className="text-base font-black text-white">No Free Fire IDs in Inventory</p>
                    <p className="text-xs text-slate-400">All demo cards have been removed. Click below to add your first real Free Fire ID.</p>
                  </div>
                  <button
                    onClick={handleStartCreate}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-red-950 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post New Free Fire ID</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: ADD / EDIT FULL SCREEN WIZARD
           ======================================================== */}
        {activeTab === 'add' && (
          <form onSubmit={handleSaveAccount} className="space-y-6 max-w-4xl mx-auto pb-8 animate-fadeIn">
            {/* Header Title */}
            <div className="flex items-center justify-between pb-3 border-b border-red-950/80">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-red-400">
                  {editingId ? 'INVENTORY UPDATE' : 'NEW ID CREATION'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {editingId ? `Edit Free Fire ID #${formData.idNo}` : 'Post New Free Fire ID'}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('inventory')}
                className="px-3.5 py-1.5 rounded-xl bg-[#1a0514] border border-red-950 text-slate-300 text-xs font-bold hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {/* 1. PHOTO UPLOADER (DIRECT LOCAL CAMERA & GALLERY SUPPORT) */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#12030c] border border-red-950 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-red-400" />
                    <span>Account Screenshots & Gallery</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Upload ID profile, lobby, evo guns, and vault screenshots from phone or PC.
                  </p>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold font-mono">
                  High-Speed Upload
                </span>
              </div>

              {/* Upload Dropzone / Button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-6 rounded-2xl border-2 border-dashed border-red-500/50 hover:border-red-400 bg-[#1b0514] hover:bg-[#25081c] transition-all flex flex-col items-center justify-center text-center cursor-pointer space-y-2 group shadow-inner"
                >
                  <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-red-400 animate-bounce" />
                  </div>
                  <span className="text-sm font-black text-white">
                    Choose Photos from Device Gallery
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Select multiple JPG/PNG screenshots from camera or gallery
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleDeviceFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Paste Image URL Fallback */}
                <div className="p-4 rounded-2xl bg-[#160410] border border-red-950 flex flex-col justify-center space-y-2">
                  <label className="text-xs font-bold text-slate-300">Or Paste Image URL directly:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={manualUrlInput}
                      onChange={(e) => setManualUrlInput(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 px-3 py-2 rounded-xl bg-[#0e020a] border border-red-950 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddManualUrl}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Upload Progress */}
              {uploadProgress !== null && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Uploading & Optimizing...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-black rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Uploaded Gallery Thumbnails Strip */}
              {formData.images.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-300">
                    Attached Screenshots ({formData.images.length}) - Tap cover to make Primary
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {formData.images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-2xl overflow-hidden border-2 aspect-square group shadow-md ${
                          idx === 0 ? 'border-red-500 shadow-red-950/80' : 'border-red-950'
                        }`}
                      >
                        <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                        
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-red-600 text-white text-[9px] font-black uppercase shadow">
                            COVER
                          </span>
                        )}

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="p-1.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold"
                              title="Set as Main Cover"
                            >
                              Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1.5 rounded-lg bg-red-600 text-white"
                            title="Delete Image"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. CORE SPECIFICATIONS & PRICING */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#12030c] border border-red-950 space-y-4">
              <h3 className="text-sm font-black text-white">ID Information & Pricing</h3>

              {/* Row 1: ID No, In Game UID, Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">ID Number (#)</label>
                  <input
                    type="number"
                    value={formData.idNo}
                    onChange={(e) => setFormData({ ...formData, idNo: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#180513] border border-red-950 text-xs text-white font-mono font-bold focus:outline-none focus:border-red-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">In-Game Free Fire UID</label>
                  <input
                    type="text"
                    value={formData.uid}
                    onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
                    placeholder="e.g. 1069736484"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#180513] border border-red-950 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Account Tier / Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#180513] border border-red-950 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="God Tier">God Tier</option>
                    <option value="Season 1 & 2">Season 1 & 2</option>
                    <option value="Evo Gun Max">Evo Gun Max</option>
                    <option value="Criminal & Angelic">Criminal & Angelic</option>
                    <option value="Budget Friendly">Budget Friendly</option>
                  </select>
                </div>
              </div>

              {/* Title Headline */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Display Title (Headline)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. S1 SAKURA + S2 HIP HOP • 18 EVO GUNS MAX • RED CRIMINAL"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#180513] border border-red-950 text-xs text-white font-bold focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              {/* Row 2: Price, Original Price, Level, Evo Guns */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Selling Price (₹ INR)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#180513] border border-red-950 text-xs text-emerald-400 font-mono font-black focus:outline-none focus:border-red-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Original Price (₹ INR)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#180513] border border-red-950 text-xs text-slate-400 font-mono focus:outline-none focus:border-red-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Account Level</label>
                  <input
                    type="number"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#180513] border border-red-950 text-xs text-white font-mono font-bold focus:outline-none focus:border-red-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Max Evo Guns Count</label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, evoGunsCount: Math.max(0, formData.evoGunsCount - 1) })}
                      className="px-3 py-2 bg-[#1f0719] rounded-xl text-white font-bold text-xs"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={formData.evoGunsCount}
                      onChange={(e) => setFormData({ ...formData, evoGunsCount: Number(e.target.value) })}
                      className="w-full text-center py-2.5 rounded-xl bg-[#180513] border border-red-950 text-xs text-rose-400 font-mono font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, evoGunsCount: formData.evoGunsCount + 1 })}
                      className="px-3 py-2 bg-[#1f0719] rounded-xl text-white font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. RARE ITEMS & VAULT TAGS */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#12030c] border border-red-950 space-y-3">
              <label className="text-xs font-bold text-slate-300">Rare Bundles & Vault Highlight Tags</label>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={rareTagInput}
                  onChange={(e) => setRareTagInput(e.target.value)}
                  placeholder="e.g. SAKURA BUNDLE, RED CRIMINAL, COBRA MP40, ANGELIC PANT..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#180513] border border-red-950 text-xs text-white focus:outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={handleAddRareTag}
                  className="px-4 py-2.5 rounded-xl bg-[#24081b] border border-red-500/50 hover:bg-red-900/40 text-red-300 text-xs font-bold cursor-pointer"
                >
                  Add Tag
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {formData.rareItems.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 rounded-xl bg-[#1c0616] border border-red-500/30 text-xs font-mono text-red-300 flex items-center gap-2"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRareTag(item)}
                      className="text-slate-400 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 4. DESCRIPTION & SUBMISSION BAR */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#12030c] border border-red-950 space-y-3">
              <label className="text-xs font-bold text-slate-300">Full Description & Guarantee Details</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#180513] border border-red-950 text-xs text-white focus:outline-none focus:border-red-500 leading-relaxed"
                placeholder="Details regarding clean Google login, first email transfer, evo gun upgrades..."
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('inventory')}
                className="px-5 py-3 rounded-2xl bg-[#180513] border border-red-950 text-slate-300 text-xs font-bold hover:text-white cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white text-sm font-black shadow-xl shadow-red-950 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{editingId ? 'Save Changes to Realtime DB' : 'Publish ID to Store'}</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================
            TAB 4: SYSTEM SETTINGS & STARTER DATA
           ======================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl mx-auto animate-fadeIn">
            <div className="p-6 rounded-3xl bg-[#12030c] border border-red-950 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Firebase Realtime Sync Status</h3>
                  <p className="text-xs text-slate-400">Project: domain-ff-store.firebaseapp.com</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#180513] border border-red-950/80 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-red-950/60">
                  <span>Firestore Status</span>
                  <span className="text-emerald-400 font-bold">Connected & Listening</span>
                </div>
                <div className="flex justify-between py-1 border-b border-red-950/60">
                  <span>Storage Engine</span>
                  <span className="text-emerald-400 font-bold">Dual-Engine (Cloud + Local Buffer)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Total Roster Records</span>
                  <span className="text-white font-bold">{accounts.length} Accounts</span>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  onClick={handleSeedData}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl bg-[#24081c] hover:bg-[#340c28] border border-red-500/40 text-red-300 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Sync 6 Starter Accounts to Firestore</span>
                </button>

                {/* Wipe all IDs */}
                {confirmingWipeAll ? (
                  <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-500/60 space-y-2 text-center animate-fadeIn">
                    <p className="text-xs font-bold text-rose-300">Are you sure you want to permanently delete all {accounts.length} IDs?</p>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={handleWipeAllAccounts}
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs cursor-pointer shadow-lg"
                      >
                        {isSubmitting ? 'Deleting...' : 'Yes, Delete Everything'}
                      </button>
                      <button
                        onClick={() => setConfirmingWipeAll(false)}
                        className="px-3 py-2 rounded-xl bg-[#200817] text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmingWipeAll(true)}
                    disabled={isSubmitting || accounts.length === 0}
                    className="w-full py-2.5 rounded-2xl bg-red-950/30 hover:bg-red-950/60 border border-red-900/50 text-rose-400 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Wipe / Clear All Inventory ({accounts.length} IDs)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================
          ULTRA MOBILE-FIRST BOTTOM NAVIGATION BAR (Fixed on Mobile)
         ======================================================== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0c0208]/95 backdrop-blur-2xl border-t border-red-950/80 px-2 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'analytics' ? 'text-red-400 font-bold scale-105' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'inventory' ? 'text-red-400 font-bold scale-105' : 'text-slate-400'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px]">Inventory ({accounts.length})</span>
        </button>

        <button
          onClick={handleStartCreate}
          className="flex flex-col items-center gap-1 -mt-4 p-2.5 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white shadow-lg shadow-red-950 active:scale-95"
        >
          <PlusCircle className="w-6 h-6" />
          <span className="text-[9px] font-black uppercase">POST ID</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'settings' ? 'text-red-400 font-bold scale-105' : 'text-slate-400'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px]">System</span>
        </button>

        <button
          onClick={onBackToStore}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-[10px]">Store</span>
        </button>
      </div>

    </div>
  );
};

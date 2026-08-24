import { useState, useEffect } from 'react';
import { GamingAccount } from '../types';
import { GAMING_ACCOUNTS } from '../data/accountsData';
import { subscribeToAccounts } from '../services/firebaseService';

/**
 * Custom hook to consume real-time accounts from Firestore
 * with instant fallback to static verified accounts.
 */
export function useLiveAccounts() {
  const [accounts, setAccounts] = useState<GamingAccount[]>(GAMING_ACCOUNTS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Subscribe to real-time Firestore database collection
    const unsubscribe = subscribeToAccounts(
      (liveAccounts) => {
        if (liveAccounts && liveAccounts.length > 0) {
          setAccounts(liveAccounts);
        } else {
          setAccounts(GAMING_ACCOUNTS);
        }
        setIsLoading(false);
      },
      (error) => {
        console.warn('Live subscription error, using verified cache:', error);
        setAccounts(GAMING_ACCOUNTS);
        setIsLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return { accounts, isLoading };
}

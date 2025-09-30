'use client';

import { buildApiUrl } from '@/app/utils/apiBase';
import { clearAuthData } from '@/app/utils/authUtils';

let cachedProfile: any | null = null;
let cacheTimestamp = 0;
let inFlight: Promise<any> | null = null;

const CACHE_TTL_MS = 15000; // 15 seconds

export function invalidateProfileCache() {
     cachedProfile = null;
     cacheTimestamp = 0;
}

export async function getProfile(): Promise<any | null> {
     try {
          const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
          if (!token) {
               invalidateProfileCache();
               return null;
          }

          const now = Date.now();
          if (cachedProfile && now - cacheTimestamp < CACHE_TTL_MS) {
               return cachedProfile;
          }

          if (inFlight) {
               return inFlight;
          }

          inFlight = (async () => {
               const response = await fetch(buildApiUrl('/api/users/profile'), {
                    headers: { 'Authorization': `Bearer ${token}` }
               });

               if (response.status === 401) {
                    clearAuthData();
                    invalidateProfileCache();
                    return null;
               }

               if (!response.ok) {
                    invalidateProfileCache();
                    return null;
               }

               const data = await response.json();
               cachedProfile = data;
               cacheTimestamp = Date.now();
               return cachedProfile;
          })();

          const result = await inFlight;
          inFlight = null;
          return result;
     } catch (e) {
          console.error('getProfile failed', e);
          inFlight = null;
          return null;
     }
}


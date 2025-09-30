'use client';

import { useEffect } from 'react';

export default function ErrorMonitor() {
     useEffect(() => {
          const onError = (event: ErrorEvent) => {

               console.error('[GlobalError]', event.message, event.error || event);
          };

          const onUnhandled = (event: PromiseRejectionEvent) => {
               console.error('[UnhandledRejection]', event.reason);
          };

          window.addEventListener('error', onError);
          window.addEventListener('unhandledrejection', onUnhandled);
          return () => {
               window.removeEventListener('error', onError);
               window.removeEventListener('unhandledrejection', onUnhandled);
          };
     }, []);

     return null;
}



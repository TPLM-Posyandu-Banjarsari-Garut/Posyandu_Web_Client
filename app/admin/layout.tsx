'use client';

import React, { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Clear any startup console logs / warnings instantly
    console.clear();

    // Preserve original console functions
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;
    const originalDebug = console.debug;

    // Suppress console statements for admin pages
    const noop = () => {};
    console.log = noop;
    console.warn = noop;
    console.error = noop;
    console.info = noop;
    console.debug = noop;

    return () => {
      // Restore console logs when moving outside /admin pages
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      console.info = originalInfo;
      console.debug = originalDebug;
    };
  }, []);

  return <>{children}</>;
}

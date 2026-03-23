import { useEffect, useRef } from 'react';
import { usePresentationStore } from '../stores/presentationStore';

function getSyncFile() {
  const params = new URLSearchParams(window.location.search);
  const v = params.get('v');
  const base = import.meta.env.BASE_URL || '/';
  return v ? `${base}presentation-v${v}.json` : `${base}presentation.json`;
}
const SYNC_FILE = getSyncFile();
const POLL_INTERVAL = 1500;

export function useFileSync() {
  const importJSON = usePresentationStore((s) => s.importJSON);
  const lastHash = useRef<string>('');

  useEffect(() => {
    let active = true;

    const check = async () => {
      try {
        const res = await fetch(SYNC_FILE, { cache: 'no-store' });
        if (!res.ok) return;
        const text = await res.text();
        const hash = text.length + ':' + text.slice(0, 100) + text.slice(-100);
        if (hash !== lastHash.current) {
          // Always import — file takes precedence over localStorage
          importJSON(text);
          console.log('[SlideForge] Presentation updated from file');
          lastHash.current = hash;
        }
      } catch {
        // File doesn't exist yet, that's fine
      }
    };

    // Initial check
    check();

    const interval = setInterval(() => {
      if (active) check();
    }, POLL_INTERVAL);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [importJSON]);
}

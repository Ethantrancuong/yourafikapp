// Router tối giản dựa trên History API (đủ cho bản mẫu, không cần thư viện ngoài).
import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react';

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());
window.addEventListener('popstate', notify);

export function navigate(to: string, opts: { replace?: boolean } = {}) {
  if (to === location.pathname + location.search) return;
  if (opts.replace) history.replaceState(null, '', to);
  else history.pushState(null, '', to);
  window.scrollTo(0, 0);
  notify();
}

export function goBack(fallback = '/') {
  // Mở thẳng bằng link (chưa điều hướng trong app) → về fallback thay vì rời app.
  if ((window as unknown as { __navCount?: number }).__navCount) history.back();
  else navigate(fallback, { replace: true });
}

// Đếm số lần điều hướng trong app để biết history.back() có an toàn không.
const origPush = history.pushState.bind(history);
history.pushState = (...args: Parameters<History['pushState']>) => {
  const w = window as unknown as { __navCount?: number };
  w.__navCount = (w.__navCount ?? 0) + 1;
  origPush(...args);
};
window.addEventListener('popstate', () => {
  const w = window as unknown as { __navCount?: number };
  w.__navCount = Math.max(0, (w.__navCount ?? 1) - 1);
});

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

export function useLocation() {
  const path = useSyncExternalStore(subscribe, () => location.pathname);
  const search = useSyncExternalStore(subscribe, () => location.search);
  return { path, search, query: new URLSearchParams(search) };
}

/** Khớp path dạng '/area/:id/topic/:tid' → params hoặc null. */
export function match(pattern: string, path: string): Record<string, string> | null {
  const p = pattern.split('/').filter(Boolean);
  const s = path.split('/').filter(Boolean);
  if (p.length !== s.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(s[i]);
    else if (p[i] !== s[i]) return null;
  }
  return params;
}

export function Link({ to, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return (
    <a
      href={to}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    />
  );
}

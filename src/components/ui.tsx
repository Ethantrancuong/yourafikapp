import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Link, navigate, useLocation } from '../lib/router';
import { getState } from '../state/progress';
import { IconBack, IconBrief, IconClose, IconHome, IconMap, IconSettings, StatusGlyph } from './Icons';

export function prefersReducedMotion() {
  if (getState().motion === 'reduce') return true;
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function TopBar({ back, close, title, right }: { back?: string; close?: string; title?: string; right?: ReactNode }) {
  return (
    <header className="topbar">
      {back ? (
        <button className="icon-btn" aria-label="Quay lại" onClick={() => navigate(back)}>
          <IconBack />
        </button>
      ) : close ? (
        <button className="icon-btn" aria-label="Thoát" onClick={() => navigate(close)}>
          <IconClose />
        </button>
      ) : (
        <span style={{ width: 44 }} />
      )}
      <div className="title">{title}</div>
      {right ?? <span style={{ width: 44 }} />}
    </header>
  );
}

export function BottomNav() {
  const { path } = useLocation();
  const items = [
    { to: '/', label: 'Trang chủ', icon: <IconHome />, active: path === '/' },
    { to: '/map', label: 'Lộ trình', icon: <IconMap />, active: path.startsWith('/map') || path.startsWith('/area') },
    { to: '/settings', label: 'Cài đặt', icon: <IconSettings />, active: path.startsWith('/settings') },
  ];
  return (
    <nav className="bottom-nav" aria-label="Điều hướng chính">
      {items.map((i) => (
        <Link key={i.to} to={i.to} aria-current={i.active ? 'page' : undefined}>
          {i.icon}
          <span>{i.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export function ProgressBar({ value, total, label, color }: { value: number; total: number; label: string; color?: string }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="progress" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={total} aria-valuenow={value}>
      <span style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

const STATUS_TEXT = {
  todo: 'Chưa bắt đầu',
  doing: 'Đang học',
  done: 'Đã xong',
  scaffold: 'Đang xây dựng',
  later: 'Gợi ý sau',
} as const;
export type StatusKey = keyof typeof STATUS_TEXT;

export function Status({ state, text, color }: { state: StatusKey; text?: string; color?: string }) {
  return (
    <span className="status">
      <StatusGlyph state={state} size={18} color={color} />
      {text ?? STATUS_TEXT[state]}
    </span>
  );
}

export function Slider({ label, value, min, max, step = 1, unit = '', onChange, format, accent }: {
  label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (v: number) => void; format?: (v: number) => string; accent?: string;
}) {
  const id = `s-${label.replace(/\W+/g, '-')}`;
  return (
    <div className="control" style={accent ? ({ ['--accent' as string]: accent } as CSSProperties) : undefined}>
      <div className="control-head">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{format ? format(value) : `${value}${unit}`}</output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

export function Segmented<T extends string | number>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="control">
      <div className="control-head">
        <span>{label}</span>
      </div>
      <div className="segmented" role="group" aria-label={label}>
        {options.map((o) => (
          <button key={String(o.value)} type="button" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function BriefPanel({ children, defaultOpen = false }: { children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="brief" open={defaultOpen}>
      <summary>
        <IconBrief size={20} /> Brief
        <span className="spacer" />
        <span className="body-s">Chạm để mở/đóng</span>
      </summary>
      {children}
    </details>
  );
}

export function Steps({ total, current, label }: { total: number; current: number; label: string }) {
  return (
    <div className="steps" role="img" aria-label={`${label}: bước ${current + 1}/${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} data-on={i <= current} />
      ))}
    </div>
  );
}

export function useToast(): [string | null, (m: string) => void] {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 2400);
    return () => clearTimeout(t);
  }, [msg]);
  return [msg, setMsg];
}

export function Toast({ msg }: { msg: string | null }) {
  return msg ? (
    <div className="toast" role="status">
      {msg}
    </div>
  ) : (
    <div className="sr-only" role="status" />
  );
}

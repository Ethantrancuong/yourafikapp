// Bộ icon hình học thống nhất: lưới 24px, solid, góc bo mềm (Brief §04 Icon style).
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 24) => ({ width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true as const, focusable: false as const });

export const IconHome = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path fill="currentColor" d="M10.6 3.1a2.2 2.2 0 0 1 2.8 0l6.4 5.4c.5.4.8 1 .8 1.7V19a2 2 0 0 1-2 2h-3.4v-5.2a2.2 2.2 0 0 0-4.4 0V21H5.4a2 2 0 0 1-2-2v-8.8c0-.7.3-1.3.8-1.7z" />
  </svg>
);
export const IconMap = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="3" width="8" height="8" rx="2.4" fill="currentColor" />
    <path fill="currentColor" d="M17 3a4 4 0 0 1 4 4v1.6a2.4 2.4 0 0 1-2.4 2.4h-3.2A2.4 2.4 0 0 1 13 8.6V7a4 4 0 0 1 4-4z" />
    <path fill="currentColor" d="M7 13.4l3.3 3.3a1 1 0 0 1 0 1.4L7 21.4a1 1 0 0 1-1.4 0l-3.3-3.3a1 1 0 0 1 0-1.4l3.3-3.3a1 1 0 0 1 1.4 0z" />
    <rect x="13" y="13" width="8" height="8" rx="2.4" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2.4" />
  </svg>
);
export const IconSettings = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path fill="currentColor" fillRule="evenodd" d="M10.8 2.4a2.4 2.4 0 0 1 2.4 0l6.3 3.6a2.4 2.4 0 0 1 1.2 2.1v7.8c0 .9-.5 1.7-1.2 2.1l-6.3 3.6a2.4 2.4 0 0 1-2.4 0L4.5 18a2.4 2.4 0 0 1-1.2-2.1V8.1c0-.9.5-1.7 1.2-2.1zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
  </svg>
);
export const IconBack = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconClose = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);
export const IconArrow = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconChevron = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconUndo = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M9 7H15a5 5 0 0 1 0 10H8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M9 3L5 7l4 4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconBrief = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path fill="currentColor" d="M6 3h8.2c.5 0 1 .2 1.4.6l3.8 3.8c.4.4.6.9.6 1.4V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm2 9v2h8v-2zm0 4v2h5v-2z" />
  </svg>
);
export const IconEye = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path fill="currentColor" fillRule="evenodd" d="M12 5c4.6 0 8.2 3.2 9.6 6.2.2.5.2 1 0 1.5C20.2 15.8 16.6 19 12 19s-8.2-3.2-9.6-6.3a1.8 1.8 0 0 1 0-1.5C3.8 8.2 7.4 5 12 5zm0 3.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
  </svg>
);
export const IconPlay = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path fill="currentColor" d="M8 5.6a1.4 1.4 0 0 1 2.1-1.2l9 6.4a1.4 1.4 0 0 1 0 2.4l-9 6.4A1.4 1.4 0 0 1 8 18.4z" />
  </svg>
);
export const IconDiamond = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path fill="currentColor" d="M10.7 3.1a1.6 1.6 0 0 1 2.6 0l5.6 7.3c.5.6.5 1.4 0 2l-5.6 7.4a1.6 1.6 0 0 1-2.6 0l-5.6-7.4a1.6 1.6 0 0 1 0-2z" />
  </svg>
);

/** Trạng thái không chỉ dựa vào màu: hình dạng khác nhau + nhãn chữ đi kèm. */
export function StatusGlyph({ state, size = 22, color = 'var(--ink)' }: { state: 'todo' | 'doing' | 'done' | 'scaffold' | 'later'; size?: number; color?: string }) {
  const s = size;
  if (state === 'done')
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill={color} />
        <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (state === 'doing')
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="2" />
        <path d="M12 2a10 10 0 0 1 0 20z" fill={color} />
      </svg>
    );
  if (state === 'scaffold')
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="6" fill="none" stroke="var(--ink-2)" strokeWidth="2" strokeDasharray="4 3" />
      </svg>
    );
  if (state === 'later')
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.5l9 9.5-9 9.5-9-9.5z" fill="none" stroke="var(--ink-2)" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="var(--muted)" strokeWidth="2" />
    </svg>
  );
}

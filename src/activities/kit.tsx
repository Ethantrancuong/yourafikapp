// Bộ khung dùng chung cho các hoạt động học tập (Practice Workspace S06 + Feedback S07).
import type { CSSProperties, ReactNode } from 'react';

export type Level = 'clear' | 'try' | 'review';

/** Một ý phản hồi gắn với một tiêu chí quan sát được (Quan sát → Liên hệ brief → Gợi ý thử nghiệm). */
export interface Criterion {
  id: string;
  criterion: string;
  level: Level;
  observe: string;
  relate: string;
  suggest: string;
  target?: string; // id vùng cần khoanh trên preview
}

export interface EngineProps<D = unknown> {
  activityId: string;
  draft: D | undefined;
  saveDraft: (d: D) => void;
  /** Gọi mỗi lần người học mở phản hồi (đánh dấu hoàn thành theo Brief §14). */
  onFeedback: () => void;
  /** Rời hoạt động sau khi xong. */
  onDone: () => void;
}

const LEVEL_TEXT: Record<Level, string> = { clear: 'Rõ', try: 'Có thể thử thêm', review: 'Nên xem lại' };

function LevelGlyph({ level }: { level: Level }) {
  if (level === 'clear')
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="var(--green)" />
        <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (level === 'try')
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke="var(--ink)" strokeWidth="2" />
        <path d="M12 2a10 10 0 0 1 0 20z" fill="var(--ink)" />
      </svg>
    );
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5l9 9.5-9 9.5-9-9.5z" fill="var(--coral)" stroke="var(--ink)" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 8v5" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.3" fill="var(--ink)" />
    </svg>
  );
}

export function FeedbackList({ items, onFocus }: { items: Criterion[]; onFocus?: (target?: string) => void }) {
  return (
    <div aria-live="polite">
      {items.map((c) => (
        <section key={c.id} className="fb-item" onClick={() => onFocus?.(c.target)}>
          <div className="fb-head">
            <LevelGlyph level={c.level} />
            <span>{c.criterion}</span>
            <span className="fb-level">{LEVEL_TEXT[c.level]}</span>
          </div>
          <div className="fb-line">
            <b>Quan sát</b>
            <span>{c.observe}</span>
          </div>
          <div className="fb-line">
            <b>Với brief</b>
            <span>{c.relate}</span>
          </div>
          <div className="fb-line">
            <b>Thử xem</b>
            <span>{c.suggest}</span>
          </div>
        </section>
      ))}
      <p className="disclaimer">
        Phản hồi được tạo theo quy tắc từ trạng thái bài làm của bạn, không phải đánh giá toàn diện của chuyên gia. Thiết kế có nhiều phương án phù hợp.
      </p>
    </div>
  );
}

export function FeedbackPanel({ items, children, onFocus }: { items: Criterion[]; children?: ReactNode; onFocus?: (target?: string) => void }) {
  return (
    <div className="panel">
      <h2 className="h3" style={{ marginBottom: 12 }}>
        Phản hồi
      </h2>
      <FeedbackList items={items} onFocus={onFocus} />
      {children}
    </div>
  );
}

export function Concept({ title, children, source, accent }: { title: string; children: ReactNode; source?: string; accent?: string }) {
  return (
    <div className="panel">
      <div className="concept stack" style={{ ['--gap' as string]: '8px', ['--accent' as string]: accent } as CSSProperties}>
        <p className="eyebrow">Nguyên lý</p>
        <h2 className="h3">{title}</h2>
        <div className="body stack" style={{ ['--gap' as string]: '8px' } as CSSProperties}>
          {children}
        </div>
        {source && <p className="source">Tham chiếu: {source}</p>}
      </div>
    </div>
  );
}

/** Thanh hành động cuối màn: luôn có đường thoát rõ ràng. */
export function ActionBar({ children }: { children: ReactNode }) {
  return <div className="btn-row" style={{ marginTop: 8 }}>{children}</div>;
}

export const fmt = (n: number, d = 1) => n.toFixed(d).replace('.', ',');

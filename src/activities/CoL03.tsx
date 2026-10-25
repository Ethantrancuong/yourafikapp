// CO-L03 — Nhóm các yếu tố bằng khoảng cách (Proximity). Pattern A: Explore → Concept → Practice (kéo thả) → Feedback.
import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as RKE, type PointerEvent as RPE } from 'react';
import { BriefPanel, Slider, Steps } from '../components/ui';
import { IconArrow, IconUndo } from '../components/Icons';
import { ActionBar, Concept, FeedbackPanel, fmt, type Criterion, type EngineProps } from './kit';

type Pt = { x: number; y: number };
const W = 320, H = 300;
const LABELS = ['Phòng đọc', 'Góc thiếu nhi', 'Mượn – trả sách'];
const ICONS: Pt[] = [{ x: 80, y: 64 }, { x: 236, y: 92 }, { x: 128, y: 214 }];
const START: Pt[] = [{ x: 236, y: 160 }, { x: 96, y: 142 }, { x: 236, y: 252 }];
const EXPLORE_ICONS: Pt[] = [{ x: 80, y: 64 }, { x: 80, y: 152 }, { x: 80, y: 240 }];
const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);

function Glyph({ i, p }: { i: number; p: Pt }) {
  const c = 'var(--purple)';
  if (i === 0) return <circle cx={p.x} cy={p.y} r={22} fill={c} />;
  if (i === 1) return <path d={`M${p.x} ${p.y - 24} L${p.x + 24} ${p.y} L${p.x} ${p.y + 24} L${p.x - 24} ${p.y} Z`} fill={c} />;
  return <path d={`M${p.x - 22} ${p.y + 20} V${p.y} A22 22 0 0 1 ${p.x + 22} ${p.y} V${p.y + 20} Z`} fill={c} />;
}

function Card({ icons, labels, onDrag, hl }: { icons: Pt[]; labels: Pt[]; onDrag?: (i: number, p: Pt) => void; hl?: string }) {
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<{ i: number; dx: number; dy: number } | null>(null);
  const toLocal = (e: { clientX: number; clientY: number }): Pt => {
    const m = svg.current!.getScreenCTM()!.inverse();
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m);
    return { x: pt.x, y: pt.y };
  };
  // Chặn cuộn trang chỉ khi đang kéo một nhãn (tránh bẫy cuộn).
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const block = (e: TouchEvent) => { if (drag.current) e.preventDefault(); };
    el.addEventListener('touchmove', block, { passive: false });
    return () => el.removeEventListener('touchmove', block);
  }, []);
  const down = (i: number) => (e: RPE<SVGGElement>) => {
    if (!onDrag) return;
    const p = toLocal(e);
    drag.current = { i, dx: labels[i].x - p.x, dy: labels[i].y - p.y };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };
  const move = (e: RPE<SVGGElement>) => {
    if (!drag.current || !onDrag) return;
    const p = toLocal(e);
    onDrag(drag.current.i, { x: Math.min(W - 50, Math.max(50, p.x + drag.current.dx)), y: Math.min(H - 16, Math.max(16, p.y + drag.current.dy)) });
  };
  const up = () => { drag.current = null; };
  const nudge = (i: number) => (e: RKE) => {
    if (!onDrag) return;
    const step = e.shiftKey ? 20 : 6;
    const d: Record<string, Pt> = { ArrowUp: { x: 0, y: -step }, ArrowDown: { x: 0, y: step }, ArrowLeft: { x: -step, y: 0 }, ArrowRight: { x: step, y: 0 } };
    if (!d[e.key]) return;
    e.preventDefault();
    onDrag(i, { x: Math.min(W - 50, Math.max(50, labels[i].x + d[e.key].x)), y: Math.min(H - 16, Math.max(16, labels[i].y + d[e.key].y)) });
  };
  return (
    <div className="preview" style={{ background: '#F6F0FC' }}>
      <span className="preview-label">Thẻ “Tiện ích thư viện cộng đồng”</span>
      <svg ref={svg} viewBox={`0 0 ${W} ${H}`} width="100%" role="group" aria-label="Khu vực sắp xếp nhãn và biểu tượng" style={{ display: 'block' }}>
        {icons.map((p, i) => <Glyph key={i} i={i} p={p} />)}
        {labels.map((p, i) => {
          const w = LABELS[i].length * 7.6 + 24;
          return (
            <g key={i} transform={`translate(${p.x} ${p.y})`} onPointerDown={down(i)} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
              tabIndex={onDrag ? 0 : -1} role={onDrag ? 'button' : undefined} onKeyDown={nudge(i)}
              aria-label={onDrag ? `Nhãn ${LABELS[i]}. Kéo, hoặc dùng phím mũi tên để di chuyển.` : undefined}
              style={{ cursor: onDrag ? 'grab' : 'default', touchAction: 'none' }}>
              <rect x={-w / 2} y={-16} width={w} height={32} rx={16} fill="var(--surface)" stroke={hl === `l${i}` ? 'var(--ink)' : '#D8CCE6'} strokeWidth={hl === `l${i}` ? 2.5 : 1.5} strokeDasharray={hl === `l${i}` ? '5 4' : undefined} />
              <text textAnchor="middle" y={5} fontSize={14} fontWeight={600} fill="var(--ink)" style={{ userSelect: 'none' }}>{LABELS[i]}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function evaluateGroups(labels: Pt[]): Criterion[] {
  const out: Criterion[] = labels.map((p, i) => {
    const own = dist(p, ICONS[i]);
    const others = ICONS.map((ic, j) => ({ j, d: dist(p, ic) })).filter((o) => o.j !== i).sort((a, b) => a.d - b.d);
    const near = others[0];
    const base = { id: `g${i}`, criterion: `Nhóm “${LABELS[i]}”`, target: `l${i}` };
    if (near.d < own) return { ...base, level: 'review' as const, observe: `Nhãn đang gần một biểu tượng khác (${Math.round(near.d)} so với ${Math.round(own)} đơn vị).`, relate: 'Người xem sẽ ghép nhãn với biểu tượng gần nhất — tức là ghép sai.', suggest: 'Kéo nhãn sát biểu tượng của nó hơn.' };
    if (own < 26) return { ...base, level: 'try' as const, observe: 'Nhãn đang đè lên biểu tượng.', relate: 'Hai yếu tố đã thành một nhóm nhưng che nhau, khó đọc.', suggest: 'Đặt nhãn ngay cạnh, không chồng lên biểu tượng.' };
    const ratio = near.d / own;
    if (ratio < 1.6) return { ...base, level: 'try' as const, observe: `Khoảng cách tới biểu tượng của nó và tới biểu tượng khác gần bằng nhau (×${fmt(ratio)}).`, relate: 'Brief cần mỗi nhãn được đọc cùng biểu tượng của nó — ở đây còn lưỡng lự.', suggest: 'Kéo nhãn gần biểu tượng hơn hoặc tách xa nhóm bên cạnh.' };
    return { ...base, level: 'clear' as const, target: undefined, observe: `Nhãn gần biểu tượng của nó hơn hẳn các biểu tượng khác (×${fmt(ratio)}).`, relate: 'Mắt tự ghép chúng thành một cặp mà không cần đường kẻ hay khung.', suggest: 'Thử đổi vị trí nhãn sang bên cạnh biểu tượng — nhóm vẫn rõ chứ?' };
  });
  const centers = labels.map((p, i) => ({ x: (p.x + ICONS[i].x) / 2, y: (p.y + ICONS[i].y) / 2 }));
  let minD = Infinity;
  for (let a = 0; a < 3; a++) for (let b = a + 1; b < 3; b++) minD = Math.min(minD, dist(centers[a], centers[b]));
  out.push(minD >= 90
    ? { id: 'space', criterion: 'Khoảng trống giữa các nhóm', level: 'clear', observe: 'Ba nhóm có khoảng trống rõ giữa nhau.', relate: 'Thẻ đọc thành ba tiện ích tách bạch.', suggest: 'Thử đưa hai nhóm lại gần để thấy lúc nào chúng bắt đầu “dính” vào nhau.' }
    : { id: 'space', criterion: 'Khoảng trống giữa các nhóm', level: 'try', observe: 'Có hai nhóm đang khá sát nhau.', relate: 'Khi các nhóm gần nhau, ranh giới giữa chúng mờ đi.', suggest: 'Giữ khoảng trống giữa các nhóm lớn hơn khoảng cách bên trong nhóm.' });
  return out;
}

type Phase = 'explore' | 'concept' | 'practice' | 'feedback';
interface Draft { phase: Phase; gap: number; labels: Pt[] }

export default function CoL03({ draft, saveDraft, onFeedback, onDone }: EngineProps<Draft>) {
  const [d, setD] = useState<Draft>(draft ?? { phase: 'explore', gap: 44, labels: START });
  const [hl, setHl] = useState<string | undefined>();
  const update = (p: Partial<Draft>) => { const n = { ...d, ...p }; setD(n); saveDraft(n); };
  const items = useMemo(() => evaluateGroups(d.labels), [d.labels]);
  const idx = ['explore', 'concept', 'practice', 'feedback'].indexOf(d.phase);
  // Khám phá: nhãn ở bên phải, trượt từ giữa hai biểu tượng (lưỡng lự) về sát biểu tượng của nó.
  const explore = EXPLORE_ICONS.map((p) => ({ x: p.x + 120, y: p.y + d.gap }));

  return (
    <div className="workspace" style={{ ['--accent' as string]: 'var(--purple)' } as CSSProperties}>
      <Steps total={4} current={idx} label="Tiến trình bài" />
      {d.phase === 'explore' && (
        <>
          <div className="preview-wrap"><Card icons={EXPLORE_ICONS} labels={explore} /></div>
          <div className="panel">
            <p className="eyebrow">Khám phá</p>
            <p className="body" style={{ margin: '4px 0 12px' }}>Kéo thanh trượt. <b>Ở vị trí nào bạn chắc chắn nhãn thuộc biểu tượng nào?</b></p>
            <Slider label="Độ lệch của nhãn" value={d.gap} min={0} max={44} accent="var(--purple)" format={(v) => (v >= 40 ? 'Lưng chừng' : v <= 8 ? 'Sát biểu tượng' : `${v}`)} onChange={(gap) => update({ gap })} />
          </div>
          <ActionBar><button className="btn btn-primary" onClick={() => update({ phase: 'concept' })}>Mình đã quan sát <span className="btn-dot"><IconArrow size={18} /></span></button></ActionBar>
        </>
      )}
      {d.phase === 'concept' && (
        <>
          <Concept accent="var(--purple)" title="Gần nhau thì thuộc về nhau" source="Lupton & Phillips, Graphic Design: The New Basics — Gestalt Principles">
            <p>Mắt có xu hướng ghép các yếu tố <b>ở gần nhau</b> thành một nhóm (nguyên lý gần kề — proximity).</p>
            <p>Để nhóm rõ, khoảng cách <b>bên trong</b> nhóm nên nhỏ hơn hẳn khoảng cách <b>giữa</b> các nhóm. Khoảng cách là một cách nhóm; sự tương đồng về màu, hình cũng có thể nhóm (Lesson CO-L04).</p>
          </Concept>
          <ActionBar>
            <button className="btn btn-secondary" onClick={() => update({ phase: 'explore' })}>Quay lại</button>
            <button className="btn btn-primary" onClick={() => update({ phase: 'practice' })}>Thực hành</button>
          </ActionBar>
        </>
      )}
      {(d.phase === 'practice' || d.phase === 'feedback') && (
        <>
          <div className="preview-wrap">
            <Card icons={ICONS} labels={d.labels} hl={d.phase === 'feedback' ? hl : undefined}
              onDrag={d.phase === 'practice' ? (i, p) => update({ labels: d.labels.map((l, j) => (j === i ? p : l)) }) : undefined} />
          </div>
          <BriefPanel defaultOpen={d.phase === 'practice'}>
            <p>Thẻ giới thiệu 3 tiện ích của thư viện: hình tròn – Phòng đọc · hình thoi – Góc thiếu nhi · hình vòm – Mượn – trả sách. <b>Kéo các nhãn</b> để mỗi nhãn được đọc cùng biểu tượng của nó, không cần kẻ khung hay đường nối.</p>
          </BriefPanel>
          {d.phase === 'practice' ? (
            <>
              <ActionBar>
                <button className="btn btn-ghost" onClick={() => update({ labels: START })}><IconUndo size={18} /> Đặt lại</button>
                <button className="btn btn-primary" onClick={() => { update({ phase: 'feedback' }); setHl(items.find((i) => i.level !== 'clear')?.target); onFeedback(); }}>Xem phản hồi</button>
              </ActionBar>
            </>
          ) : (
            <>
              <FeedbackPanel items={items} onFocus={setHl} />
              <ActionBar>
                <button className="btn btn-secondary" onClick={() => update({ phase: 'practice' })}>Chỉnh lại</button>
                <button className="btn btn-primary" onClick={onDone}>Tiếp tục</button>
              </ActionBar>
              <button className="btn btn-ghost btn-block" onClick={() => update({ labels: ICONS.map((p) => ({ x: p.x, y: p.y + 44 })) })}>Xem một phương án tham khảo</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

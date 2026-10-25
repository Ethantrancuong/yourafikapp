// S03 — Area Overview + S08 Topic Piece → Area (Snap/Dock) + Satellite Reveal của Area Challenge.
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { AREA_COLOR, getActivity, getArea, getTopic, type AreaId } from '../data/curriculum';
import { actions, activityStatus, areaStatus, checkpointStatus, pendingTopicAssembly, topicStatus, useProgress } from '../state/progress';
import { Link } from '../lib/router';
import { AreaSymbol, PIECES } from '../components/AreaSymbol';
import { prefersReducedMotion, Status, TopBar } from '../components/ui';
import { IconChevron, StatusGlyph } from '../components/Icons';

function PieceMini({ areaId, index, on }: { areaId: AreaId; index: number; on: boolean }) {
  // Cho thấy vị trí của mảnh Topic trong toàn bộ symbol.
  return (
    <svg width={44} height={44} viewBox="-8 -8 216 216" aria-hidden="true">
      {PIECES[areaId].map((d, i) =>
        i === index ? (
          <path key={i} d={d} fill={on ? AREA_COLOR[areaId] : 'var(--surface)'} stroke={on ? 'none' : 'var(--ink-2)'} strokeWidth={on ? 0 : 10} strokeDasharray={on ? undefined : '18 12'} />
        ) : (
          <path key={i} d={d} fill="var(--surface-2)" />
        ),
      )}
    </svg>
  );
}

export default function AreaOverview({ areaId }: { areaId: string }) {
  const s = useProgress();
  const area = getArea(areaId);
  const [queue, setQueue] = useState<string[]>(() => (area ? pendingTopicAssembly(s, area.id) : []));
  const [announce, setAnnounce] = useState('');
  const flyRef = useRef<HTMLDivElement>(null);
  const anim = useRef<Animation | null>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  const current = queue[0];

  // Topic Piece → Area: mảnh bay từ dưới lên và khớp vào vị trí cố định.
  useLayoutEffect(() => {
    if (!current || !flyRef.current || !area) return;
    const reduce = prefersReducedMotion();
    const el = flyRef.current;
    const a = reduce
      ? el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, fill: 'both' })
      : el.animate(
          [
            { transform: 'translate(0, 180px) scale(1.3) rotate(-8deg)', opacity: 0 },
            { transform: 'translate(0, 120px) scale(1.25) rotate(-6deg)', opacity: 1, offset: 0.25 },
            { transform: 'translate(0, -6px) scale(1.02) rotate(0deg)', opacity: 1, offset: 0.82 },
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          ],
          { duration: 900, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'both' },
        );
    anim.current = a;
    const t = getTopic(current)!;
    a.onfinish = () => {
      actions.markTopicAssembled(current);
      setAnnounce(`Topic ${t.code} “${t.title}” đã gắn vào ${area.name}.`);
      setQueue((q) => q.slice(1));
    };
    return () => {
      a.onfinish = null;
    };
  }, [current, area]);

  const status = area ? areaStatus(s, area.id) : 'not_started';
  const showReveal = !!area && queue.length === 0 && (status === 'topics_completed' || status === 'completed') && !s.challengeRevealedAt[area.id];

  // Satellite Reveal: Area Challenge xuất hiện từ symbol đã hoàn chỉnh (một lần).
  useEffect(() => {
    if (!showReveal || !revealRef.current || !area) return;
    const reduce = prefersReducedMotion();
    const a = revealRef.current.animate(
      reduce ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translateY(-48px) scale(0.6)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }],
      { duration: reduce ? 150 : 650, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'both', delay: reduce ? 0 : 200 },
    );
    a.onfinish = () => actions.markChallengeRevealed(area.id);
    return () => {
      a.onfinish = null;
    };
  }, [showReveal, area]);

  if (!area) return <main className="screen"><TopBar back="/map" title="Không tìm thấy" /></main>;
  const color = AREA_COLOR[area.id];
  const assembled = area.topicIds.filter((t) => s.topicAssembledAt[t]);
  const challenge = getActivity(area.challengeId)!;
  const challengeOpen = status === 'topics_completed' || status === 'completed';
  const skip = () => {
    anim.current?.cancel();
    queue.forEach((t) => actions.markTopicAssembled(t));
    setQueue([]);
    setAnnounce('Đã gắn các mảnh Topic.');
  };
  const curIndex = current ? area.topicIds.indexOf(current) : -1;

  return (
    <main className="screen" style={{ ['--accent' as string]: color } as CSSProperties}>
      <TopBar back="/map" title={`Stage 01 · Foundation`} />
      <p className="eyebrow">Area {area.index}</p>
      <h1 className="display h1">{area.name}</h1>
      <p className="body-s" style={{ marginTop: 6 }}>{area.description}</p>

      <section style={{ display: 'grid', placeItems: 'center', margin: '24px 0 8px', position: 'relative' }}>
        <div style={{ position: 'relative', width: 200, height: 200 }}>
          <AreaSymbol areaId={area.id} filled={assembled} hidden={current ? [current] : []} />
          {current && (
            <div ref={flyRef} style={{ position: 'absolute', inset: 0, opacity: 0 }} aria-hidden="true">
              <svg width={200} height={200} viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
                <path d={PIECES[area.id][curIndex]} fill={color} />
              </svg>
            </div>
          )}
        </div>
        {challengeOpen && <span aria-hidden="true" style={{ width: 2, height: 28, background: color, marginTop: 8 }} />}
      </section>

      <p className="sr-only" aria-live="polite">{announce}</p>

      {current && (
        <div className="assembly-bar" role="status">
          <span style={{ flex: 1 }}>Topic {getTopic(current)!.code} hoàn thành — mảnh đang gắn vào {area.name}</span>
          <button className="btn" onClick={skip}>Bỏ qua</button>
        </div>
      )}

      {challengeOpen ? (
        <div ref={showReveal ? revealRef : undefined} style={showReveal ? { opacity: 0 } : undefined}>
          <Link to={`/learn/${challenge.id}`} className="card card-link" style={{ border: `2px solid ${color}` }}>
            <span style={{ flex: 1 }}>
              <span className="eyebrow">Area Challenge</span>
              <span className="h3" style={{ display: 'block' }}>{challenge.title}</span>
              <span className="body-s">
                {status === 'completed' ? 'Area đã hoàn thành · đã ghép vào Foundation' : 'Đã hoàn thành các Topic — Sẵn sàng thử thách Area.'}
              </span>
            </span>
            {status === 'completed' ? <StatusGlyph state="done" color={color} /> : <IconChevron />}
          </Link>
        </div>
      ) : (
        <div className="card" style={{ borderStyle: 'dashed', background: 'transparent' }}>
          <p className="eyebrow">Area Challenge</p>
          <p className="body-s" style={{ marginTop: 4 }}>Xuất hiện khi các Topic của {area.name} đã hoàn thành ({assembled.length}/{area.topicIds.length} mảnh).</p>
        </div>
      )}

      <h2 className="h2" style={{ margin: '28px 0 12px' }}>Topic</h2>
      <ul className="list">
        {area.topicIds.map((tid, i) => {
          const t = getTopic(tid)!;
          const ts = topicStatus(s, tid);
          const done = t.lessonIds.filter((l) => activityStatus(s, l) === 'completed').length;
          const cp = t.checkpointId ? getActivity(t.checkpointId) : undefined;
          const cps = cp ? checkpointStatus(s, cp.id) : undefined;
          return (
            <li key={tid}>
              <Link to={`/area/${area.id}/topic/${tid}`} className="card card-link">
                <PieceMini areaId={area.id} index={i} on={!!s.topicAssembledAt[tid]} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="eyebrow">{t.code} · {done}/{t.lessonIds.length} Lesson</span>
                  <span className="h3" style={{ display: 'block', fontSize: 17 }}>{t.title}</span>
                  <Status state={ts === 'completed' ? 'done' : ts === 'in_progress' ? 'doing' : 'todo'} color={color} />
                </span>
                <IconChevron />
              </Link>
              {cp && (
                <Link to={`/learn/${cp.id}`} className="card card-link" style={{ marginTop: 6, marginLeft: 24, minHeight: 60, padding: '12px 16px', background: 'transparent' }}>
                  <StatusGlyph state={cps === 'practiced' ? 'done' : 'later'} color={color} />
                  <span style={{ flex: 1 }}>
                    <span className="eyebrow">Checkpoint · tuỳ chọn · {cps === 'practiced' ? 'Đã luyện' : cps === 'available' ? 'Có thể làm' : 'Gợi ý sau Topic này'}</span>
                    <span className="body" style={{ display: 'block', fontWeight: 600, fontSize: 15 }}>{cp.title}</span>
                  </span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}

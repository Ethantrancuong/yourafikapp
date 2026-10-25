// S02 — Stage Map: Foundation là một lưới mô-đun mở (bị cắt ở mép), KHÔNG phải puzzle 3 mảnh đóng.
// S08 — Area Piece → Stage: symbol của Area hoàn thành bay vào ô của nó.
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { AREA_COLOR, areas, getArea, STAGE, type AreaId } from '../data/curriculum';
import { actions, areaStatus, lessonCounts, pendingStageAssembly, useProgress } from '../state/progress';
import { Link } from '../lib/router';
import { AreaSymbol, PIECES } from '../components/AreaSymbol';
import { prefersReducedMotion, ProgressBar, Status, TopBar } from '../components/ui';
import { IconChevron } from '../components/Icons';

// Vị trí 3 Area demo trong lưới; các ô còn lại để trống, không đánh số, không đặt tổng.
const SLOT: Record<AreaId, number> = { typography: 0, composition: 1, color: 4 };
const CELLS = 12;

export default function StageMap() {
  const s = useProgress();
  const [queue, setQueue] = useState<AreaId[]>(() => pendingStageAssembly(s) as AreaId[]);
  const [announce, setAnnounce] = useState('');
  const gridRef = useRef<HTMLDivElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<Record<string, HTMLElement | null>>({});
  const anim = useRef<Animation | null>(null);
  const current = queue[0];

  useLayoutEffect(() => {
    if (!current || !flyRef.current || !gridRef.current) return;
    const cell = cellRefs.current[current];
    if (!cell) return;
    const g = gridRef.current.getBoundingClientRect();
    const c = cell.getBoundingClientRect();
    const fly = flyRef.current;
    fly.style.left = `${c.left - g.left}px`;
    fly.style.top = `${c.top - g.top}px`;
    const vw = Math.min(window.innerWidth, 480);
    const dx = vw / 2 - (c.left + c.width / 2);
    const dy = window.innerHeight * 0.38 - (c.top + c.height / 2);
    const reduce = prefersReducedMotion();
    const a = reduce
      ? fly.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, fill: 'both' })
      : fly.animate(
          [
            { transform: `translate(${dx}px, ${dy}px) scale(1.9)`, opacity: 0 },
            { transform: `translate(${dx}px, ${dy}px) scale(1.8)`, opacity: 1, offset: 0.2 },
            { transform: `translate(${dx * 0.1}px, ${dy * 0.1}px) scale(1.05)`, opacity: 1, offset: 0.8 },
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          ],
          { duration: 1100, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'both' },
        );
    anim.current = a;
    a.onfinish = () => {
      actions.markStageAssembled(current);
      setAnnounce(`${getArea(current)!.name} đã trở thành một mảnh của Foundation.`);
      setQueue((q) => q.slice(1));
    };
    return () => {
      a.onfinish = null;
    };
  }, [current]);

  const skip = () => {
    anim.current?.cancel();
    queue.forEach((a) => actions.markStageAssembled(a));
    setQueue([]);
  };

  const placed = areas.filter((a) => s.stageAssembledAt[a.id]).length;
  const allDemoDone = areas.every((a) => areaStatus(s, a.id) === 'completed');

  const cells = Array.from({ length: CELLS }, (_, i) => {
    const area = areas.find((a) => SLOT[a.id] === i);
    if (!area) return <div key={i} className="stage-cell" aria-hidden="true" />;
    const st = areaStatus(s, area.id);
    const inStage = !!s.stageAssembledAt[area.id] && current !== area.id;
    const color = AREA_COLOR[area.id];
    return (
      <Link key={i} to={`/area/${area.id}`} ref={(el: HTMLAnchorElement | null) => { cellRefs.current[area.id] = el; }}
        className={`stage-cell area${inStage ? ' done' : ''}`}
        style={inStage ? { background: color } : undefined}
        aria-label={`${area.name}: ${inStage ? 'đã ghép vào Foundation' : st === 'not_started' ? 'chưa bắt đầu' : 'đang học'}`}>
        {inStage ? (
          <CellSymbol areaId={area.id} />
        ) : (
          <div style={{ opacity: current === area.id ? 0 : 1 }}>
            <AreaSymbol areaId={area.id} filled={area.topicIds.filter((t) => s.topicAssembledAt[t])} size={60} />
          </div>
        )}
        <span className="cell-label">{area.name}</span>
      </Link>
    );
  });

  return (
    <main className="screen">
      <TopBar title="Lộ trình" />
      <p className="eyebrow">Stage {STAGE.index}</p>
      <h1 className="display h1">{STAGE.name}</h1>
      <p className="body-s" style={{ marginTop: 6 }}>{STAGE.description}</p>
      <div className="row" style={{ margin: '14px 0 18px' }}>
        <Status state="doing" text="Foundation đang học" />
        <span className="spacer" />
        <span className="body-s">{placed} Area đã ghép</span>
      </div>

      <div className="stage-viewport" style={{ position: 'relative' }}>
        <div ref={gridRef} className="stage-grid" style={{ position: 'relative' }}>
          {cells}
          {current && (
            <div ref={flyRef} aria-hidden="true" style={{ position: 'absolute', width: 112, height: 112, borderRadius: 20, background: AREA_COLOR[current], display: 'grid', placeItems: 'center', opacity: 0, zIndex: 10 }}>
              <CellSymbol areaId={current} />
            </div>
          )}
        </div>
      </div>
      <p className="body-s" style={{ marginTop: 8 }}>Các ô trống là những Area sẽ được bổ sung cho Foundation trong tương lai.</p>

      <p className="sr-only" aria-live="polite">{announce}</p>
      {current && (
        <div className="assembly-bar" role="status" style={{ marginTop: 14 }}>
          <span style={{ flex: 1 }}>{getArea(current)!.name} hoàn thành — đang ghép vào Foundation</span>
          <button className="btn" onClick={skip}>Bỏ qua</button>
        </div>
      )}
      {allDemoDone && !current && (
        <div className="card" style={{ marginTop: 14 }}>
          <p className="body"><b>Bạn đã hoàn thành 3 Area có trong bản mẫu.</b> Foundation vẫn đang tiếp tục — đây chưa phải toàn bộ Stage 01.</p>
        </div>
      )}

      <h2 className="h2" style={{ margin: '28px 0 12px' }}>Area trong bản mẫu</h2>
      <ul className="list">
        {areas.map((a) => {
          const c = lessonCounts(s, a.id);
          const st = areaStatus(s, a.id);
          return (
            <li key={a.id}>
              <Link to={`/area/${a.id}`} className="card card-link" style={{ ['--accent' as string]: AREA_COLOR[a.id] } as CSSProperties}>
                <span style={{ flex: 1 }}>
                  <span className="eyebrow">Area {a.index}</span>
                  <span className="h3" style={{ display: 'block' }}>{a.name}</span>
                  <Status
                    state={st === 'completed' ? 'done' : st === 'not_started' ? 'todo' : 'doing'}
                    text={st === 'completed' ? 'Đã hoàn thành' : st === 'topics_completed' ? 'Sẵn sàng thử thách Area' : st === 'in_progress' ? 'Đang học' : 'Chưa bắt đầu'}
                    color={AREA_COLOR[a.id]}
                  />
                  <div style={{ marginTop: 8 }}><ProgressBar value={c.done} total={c.total} label={`Lesson ${a.name}`} color={AREA_COLOR[a.id]} /></div>
                </span>
                <IconChevron />
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

function CellSymbol({ areaId }: { areaId: AreaId }) {
  // Area hoàn thành = cả symbol trở thành MỘT mảnh của Stage (màu nền Area, symbol màu kem).
  return (
    <svg width={64} height={64} viewBox="0 0 200 200" aria-hidden="true">
      <g fill="#F6F4F1">
        <AreaSymbolPaths areaId={areaId} />
      </g>
    </svg>
  );
}

function AreaSymbolPaths({ areaId }: { areaId: AreaId }) {
  return <>{PIECES[areaId].map((d, i) => <path key={i} d={d} />)}</>;
}

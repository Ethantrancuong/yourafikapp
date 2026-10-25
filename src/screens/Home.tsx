// S01 — Home: chào, hành động tiếp theo rõ ràng, tóm tắt tiến độ, lối vào các Area.
import { useState, type CSSProperties } from 'react';
import { AREA_COLOR, areas, getArea, getTopic } from '../data/curriculum';
import { areaStatus, lessonCounts, nextActivity, useProgress } from '../state/progress';
import { Link } from '../lib/router';
import { AreaSymbol } from '../components/AreaSymbol';
import { ProgressBar } from '../components/ui';
import { IconArrow, IconChevron } from '../components/Icons';

const isStandalone = () => matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true;

function Hero() {
  // Bố cục hình khối có chủ đích: vòm lớn bị cắt ở mép, cân bằng bởi hình tròn và hình thoi nhỏ.
  return (
    <svg viewBox="0 0 220 200" width="100%" aria-hidden="true" style={{ position: 'absolute', right: -20, top: 6, width: 190, height: 'auto' }}>
      <path d="M110 200 V122 A62 62 0 0 1 234 122 V200 Z" fill="var(--brand)" />
      <circle cx="66" cy="164" r="34" fill="var(--purple)" />
      <path transform="translate(-4 -6)" d="M124 10 Q130 3 136 10 L156 36 Q161 42 156 48 L136 74 Q130 81 124 74 L104 48 Q99 42 104 36 Z" fill="var(--lime)" />
    </svg>
  );
}

export default function Home() {
  const s = useProgress();
  const next = nextActivity(s);
  const all = lessonCounts(s);
  const assembled = Object.keys(s.topicAssembledAt).length;
  const [hideInstall, setHideInstall] = useState(() => isStandalone() || localStorage.getItem('yourafik.hideInstall') === '1');
  const nextArea = next ? getArea(next.areaId) : undefined;
  const nextTopic = next?.topicId ? getTopic(next.topicId) : undefined;
  const greeting = s.profile?.level === 'beginner' ? 'Bắt đầu từ những mảnh nhỏ nhất.' : 'Mỗi quyết định nhỏ là một mảnh ghép.';

  return (
    <main className="screen">
      <header className="row" style={{ minHeight: 56 }}>
        <img src="/brand/yourafik-logo.svg" alt="Yourafik — Graphic design self-learning" style={{ height: 44, width: 'auto' }} />
      </header>

      <section style={{ position: 'relative', minHeight: 200, paddingTop: 20 }}>
        <Hero />
        <h1 className="display" style={{ fontSize: 40, maxWidth: 220, position: 'relative' }}>
          A Piece<br />become<br />a Whole
        </h1>
        <p className="body-s" style={{ maxWidth: 200, marginTop: 10, position: 'relative' }}>{greeting}</p>
      </section>

      <div className="stack" style={{ ['--gap' as string]: '24px', marginTop: 20 } as CSSProperties}>
        {!hideInstall && (
          <div className="card row" style={{ background: 'var(--surface-2)', border: 0 }}>
            <p className="body-s" style={{ flex: 1, color: 'var(--ink)' }}>Cài Yourafik lên màn hình chính để lưu tiến độ ổn định.</p>
            <Link to="/install" className="btn btn-secondary btn-small" style={{ background: 'var(--surface)' }}>Cách cài</Link>
            <button className="icon-btn" aria-label="Ẩn gợi ý cài đặt" onClick={() => { localStorage.setItem('yourafik.hideInstall', '1'); setHideInstall(true); }}>×</button>
          </div>
        )}

        {/* Signature Connected Cards: hành động tiếp theo nối với tiến độ */}
        <section className="connected" aria-label="Tiếp tục học">
          {next && (
            <Link to={`/learn/${next.id}`} className="card card-link" style={{ background: 'var(--ink)', color: '#fff', border: 0 }}>
              <span style={{ flex: 1 }}>
                <span className="eyebrow" style={{ color: '#CFC8C2', display: 'block' }}>
                  {s.lastActivityId === next.id ? 'Tiếp tục học' : 'Gợi ý tiếp theo'} · {nextArea?.name}{nextTopic ? ` · ${nextTopic.code}` : ''}
                </span>
                <span className="h3" style={{ display: 'block', marginTop: 4 }}>{next.title}</span>
              </span>
              <span className="btn-dot" style={{ width: 44, height: 44, borderRadius: 999, background: 'var(--brand)', display: 'grid', placeItems: 'center' }}>
                <IconArrow size={20} />
              </span>
            </Link>
          )}
          <svg className="joint" viewBox="0 0 36 18" aria-hidden="true"><circle cx="18" cy="9" r="7" fill="var(--brand)" /></svg>
          <div className="card">
            <div className="row" style={{ alignItems: 'flex-end' }}>
              <span style={{ flex: 1 }}>
                <span className="num" style={{ fontSize: 34, display: 'block', lineHeight: 1 }}>{all.done}<span style={{ color: 'var(--ink-2)', fontSize: 22 }}>/{all.total}</span></span>
                <span className="body-s">Lesson đã xong</span>
              </span>
              <span style={{ textAlign: 'right' }}>
                <span className="num" style={{ fontSize: 22, display: 'block', lineHeight: 1 }}>{assembled}</span>
                <span className="body-s">mảnh Topic đã ghép</span>
              </span>
            </div>
            <div style={{ marginTop: 10 }}><ProgressBar value={all.done} total={all.total} label="Lesson đã xong trong 3 Area" /></div>
          </div>
        </section>

        <section>
          <div className="row" style={{ marginBottom: 12 }}>
            <h2 className="h2" style={{ flex: 1 }}>Các Area</h2>
            <Link to="/map" className="body-s" style={{ fontWeight: 600, color: 'var(--ink)' }}>Xem lộ trình</Link>
          </div>
          <ul className="list">
            {areas.map((a) => {
              const c = lessonCounts(s, a.id);
              const st = areaStatus(s, a.id);
              const filled = a.topicIds.filter((t) => s.topicAssembledAt[t]);
              return (
                <li key={a.id}>
                  <Link to={`/area/${a.id}`} className="card card-link">
                    <AreaSymbol areaId={a.id} filled={filled} size={52} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span className="eyebrow">Area {a.index}{st === 'completed' ? ' · Đã hoàn thành' : st === 'topics_completed' ? ' · Sẵn sàng thử thách' : ''}</span>
                      <span className="h3" style={{ display: 'block' }}>{a.name}</span>
                      <span className="body-s">{c.done}/{c.total} Lesson · {a.tagline}</span>
                    </span>
                    <IconChevron style={{ color: AREA_COLOR[a.id] }} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}

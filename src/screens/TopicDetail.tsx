// S04 — Topic Detail: danh sách Lesson, Lesson gợi ý tiếp theo, Checkpoint (nếu có). Giữ đơn giản.
import type { CSSProperties } from 'react';
import { AREA_COLOR, getActivity, getArea, getTopic } from '../data/curriculum';
import { ENGINES } from '../activities/registry';
import { activityStatus, checkpointStatus, topicStatus, useProgress } from '../state/progress';
import { Link } from '../lib/router';
import { ProgressBar, Status, TopBar } from '../components/ui';
import { IconChevron } from '../components/Icons';

export default function TopicDetail({ areaId, topicId }: { areaId: string; topicId: string }) {
  const s = useProgress();
  const area = getArea(areaId);
  const topic = getTopic(topicId);
  if (!area || !topic) return <main className="screen"><TopBar back="/map" title="Không tìm thấy" /></main>;
  const color = AREA_COLOR[area.id];
  const lessons = topic.lessonIds.map((id) => getActivity(id)!);
  const done = lessons.filter((l) => activityStatus(s, l.id) === 'completed').length;
  const suggested = lessons.find((l) => activityStatus(s, l.id) !== 'completed');
  const ts = topicStatus(s, topic.id);
  const cp = topic.checkpointId ? getActivity(topic.checkpointId) : undefined;
  const cps = cp ? checkpointStatus(s, cp.id) : undefined;

  return (
    <main className="screen" style={{ ['--accent' as string]: color } as CSSProperties}>
      <TopBar back={`/area/${area.id}`} title={area.name} />
      <p className="eyebrow">Topic {topic.code}</p>
      <h1 className="display h1" style={{ fontSize: 30 }}>{topic.title}</h1>
      <p className="body-s" style={{ marginTop: 8 }}>{topic.objective}</p>
      <div className="row" style={{ margin: '16px 0 6px' }}>
        <Status state={ts === 'completed' ? 'done' : ts === 'in_progress' ? 'doing' : 'todo'} color={color} />
        <span className="spacer" />
        <span className="body-s">{done}/{lessons.length} Lesson</span>
      </div>
      <ProgressBar value={done} total={lessons.length} label={`Tiến độ Topic ${topic.code}`} color={color} />
      {ts === 'completed' && <p className="body-s" style={{ marginTop: 10 }}>Topic đã hoàn thành — mảnh của Topic này đã thuộc biểu tượng {area.name}.</p>}

      <ol className="list" style={{ marginTop: 24 }}>
        {lessons.map((l, i) => {
          const st = activityStatus(s, l.id);
          const interactive = !!ENGINES[l.id];
          const isNext = suggested?.id === l.id;
          return (
            <li key={l.id}>
              <Link to={`/learn/${l.id}`} className="card card-link" style={isNext ? { border: `2px solid ${color}` } : undefined}>
                <span className="num" style={{ fontSize: 22, width: 28, color: 'var(--ink-2)' }}>{i + 1}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="eyebrow">{l.id}{isNext ? ' · Gợi ý tiếp theo' : ''}</span>
                  <span className="body" style={{ display: 'block', fontWeight: 600 }}>{l.title}</span>
                  {interactive || st === 'completed'
                    ? <Status state={st === 'completed' ? 'done' : st === 'in_progress' ? 'doing' : 'todo'} color={color} />
                    : <Status state="scaffold" />}
                </span>
                <IconChevron />
              </Link>
            </li>
          );
        })}
      </ol>

      {cp && (
        <section style={{ marginTop: 28 }}>
          <h2 className="h3" style={{ marginBottom: 8 }}>Checkpoint · tuỳ chọn</h2>
          <Link to={`/learn/${cp.id}`} className="card card-link">
            <span style={{ flex: 1 }}>
              <span className="eyebrow">{cps === 'practiced' ? 'Đã luyện' : cps === 'available' ? 'Có thể làm ngay' : 'Gợi ý làm sau khi xong Topic'}</span>
              <span className="body" style={{ display: 'block', fontWeight: 600 }}>{cp.title}</span>
              <span className="body-s">Không bắt buộc, không ảnh hưởng việc hoàn thành Topic.</span>
            </span>
            <IconChevron />
          </Link>
        </section>
      )}
    </main>
  );
}

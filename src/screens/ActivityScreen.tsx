// S05 Lesson/Brief Introduction + khung chạy hoạt động (S06/S07).
import { useEffect, useState, type CSSProperties } from 'react';
import { AREA_COLOR, getActivity, getArea, getTopic } from '../data/curriculum';
import { ENGINES } from '../activities/registry';
import { actions, activityStatus, getState, topicStatus, useProgress } from '../state/progress';
import { navigate } from '../lib/router';
import { Status, TopBar } from '../components/ui';
import { IconArrow, IconPlay } from '../components/Icons';

const KIND = { lesson: 'Lesson', checkpoint: 'Checkpoint · tuỳ chọn', challenge: 'Area Challenge' } as const;

export default function ActivityScreen({ id }: { id: string }) {
  const s = useProgress();
  const act = getActivity(id);
  const [running, setRunning] = useState(false);
  const [runKey, setRunKey] = useState(0);
  useEffect(() => setRunning(false), [id]);
  if (!act) return <NotFound />;
  const area = getArea(act.areaId)!;
  const topic = act.topicId ? getTopic(act.topicId) : undefined;
  const engine = ENGINES[act.id];
  const status = activityStatus(s, act.id);
  const draft = s.drafts[act.id];
  const parent = act.kind === 'lesson' && topic ? `/area/${area.id}/topic/${topic.id}` : `/area/${area.id}`;
  const accent = AREA_COLOR[area.id];

  const done = () => {
    const st = getState();
    if (act.kind === 'challenge') {
      actions.completeChallenge(act.id);
      navigate('/map');
      return;
    }
    if (act.kind === 'lesson' && topic && topicStatus(st, topic.id) === 'completed' && !st.topicAssembledAt[topic.id]) {
      navigate(`/area/${area.id}`); // Area Overview sẽ chạy Topic Piece Assembly
      return;
    }
    navigate(act.kind === 'checkpoint' && topic ? `/area/${area.id}/topic/${topic.id}` : parent);
  };

  if (running && engine) {
    const C = engine.component;
    return (
      <main className="screen no-nav" style={{ ['--accent' as string]: accent } as CSSProperties}>
        <TopBar close={parent} title={act.title} />
        <C key={runKey} activityId={act.id} draft={draft} saveDraft={(d: unknown) => actions.saveDraft(act.id, d)} onFeedback={() => actions.feedbackViewed(act.id)} onDone={done} />
      </main>
    );
  }

  return (
    <main className="screen no-nav">
      <TopBar back={parent} title={area.name} />
      <div className="stack" style={{ ['--gap' as string]: '18px' } as CSSProperties}>
        <div className="stack" style={{ ['--gap' as string]: '8px' } as CSSProperties}>
          <p className="eyebrow">{KIND[act.kind]}{topic ? ` · Topic ${topic.code} ${topic.title}` : ''}</p>
          <h1 className="display h1">{act.title}</h1>
          <div className="row">
            {engine ? <Status state={status === 'completed' ? 'done' : status === 'in_progress' ? 'doing' : 'todo'} color={accent} /> : <Status state="scaffold" />}
            {engine && <span className="body-s">· khoảng {engine.minutes} phút</span>}
          </div>
        </div>

        <section className="card stack" style={{ ['--gap' as string]: '10px' } as CSSProperties}>
          <p className="eyebrow">Mục tiêu</p>
          <p className="body">{act.objective}</p>
          {engine && (
            <>
              <p className="eyebrow" style={{ marginTop: 8 }}>Bạn sẽ làm gì</p>
              <p className="body">{engine.doWhat}</p>
              <p className="body-s">{engine.pattern}</p>
            </>
          )}
        </section>

        {act.kind === 'checkpoint' && (
          <p className="body-s">Checkpoint không bắt buộc và không ảnh hưởng tới việc hoàn thành Topic. Bạn có thể bỏ qua hoặc làm lại bất cứ lúc nào.</p>
        )}

        {engine ? (
          <div className="stack" style={{ ['--gap' as string]: '10px' } as CSSProperties}>
            {draft !== undefined ? (
              <>
                <button className="btn btn-primary btn-block" onClick={() => { actions.open(act.id); setRunning(true); }}>
                  {status === 'completed' ? 'Xem lại bài làm' : 'Tiếp tục bài đang làm'} <span className="btn-dot"><IconArrow size={18} /></span>
                </button>
                <button className="btn btn-secondary btn-block" onClick={() => { actions.clearDraft(act.id); actions.open(act.id); setRunKey((k) => k + 1); setRunning(true); }}>Làm lại từ đầu</button>
              </>
            ) : (
              <button className="btn btn-primary btn-block" onClick={() => { actions.open(act.id); setRunning(true); }}>
                Bắt đầu <span className="btn-dot"><IconPlay size={16} /></span>
              </button>
            )}
          </div>
        ) : (
          <section className="card" style={{ borderStyle: 'dashed', background: 'transparent' }}>
            <h2 className="h3">Đang xây dựng</h2>
            <p className="body" style={{ marginTop: 6 }}>Hoạt động này đã có trong lộ trình nhưng chưa có tương tác ở bản mẫu V1. Nội dung sẽ được bổ sung ở Milestone 2.</p>
            <p className="body-s" style={{ marginTop: 8 }}>Giảng viên có thể đánh dấu hoàn thành bằng Chế độ demo trong Cài đặt để xem luồng tiến độ.</p>
          </section>
        )}
      </div>
    </main>
  );
}

function NotFound() {
  return (
    <main className="screen">
      <TopBar back="/" title="Không tìm thấy" />
      <p className="body">Không tìm thấy hoạt động này.</p>
    </main>
  );
}

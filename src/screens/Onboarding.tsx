// Onboarding nhẹ (D1, luận văn 2.5.2 · Bảng 2.13): 3 câu, bỏ qua được, chỉ gợi ý Area bắt đầu — không khoá nội dung.
import { useState, type CSSProperties } from 'react';
import type { AreaId } from '../data/curriculum';
import { actions, requestPersistence } from '../state/progress';
import { navigate } from '../lib/router';
import { Steps } from '../components/ui';
import { IconArrow } from '../components/Icons';

const GOALS: { id: string; label: string; area?: AreaId }[] = [
  { id: 'type', label: 'Làm chữ rõ ràng, có điểm nhấn', area: 'typography' },
  { id: 'layout', label: 'Sắp xếp bố cục gọn gàng', area: 'composition' },
  { id: 'color', label: 'Phối màu có chủ đích', area: 'color' },
  { id: 'unsure', label: 'Chưa biết bắt đầu từ đâu' },
];
const LEVELS = [
  { id: 'beginner', label: 'Mới bắt đầu' },
  { id: 'video', label: 'Đã tự học qua video, mạng xã hội' },
  { id: 'formal', label: 'Đã học bài bản một phần' },
];
const DIFFS = [
  { id: 'lost', label: 'Mất phương hướng, không rõ lộ trình' },
  { id: 'nofeedback', label: 'Không có ai nhận xét bài' },
  { id: 'cantapply', label: 'Làm theo được, tự làm thì chưa đẹp' },
  { id: 'habit', label: 'Khó duy trì việc học' },
];

const isStandalone = () => matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true;

function Option({ on, label, onClick, multi }: { on: boolean; label: string; onClick: () => void; multi?: boolean }) {
  return (
    <button type="button" className="option" aria-pressed={on} onClick={onClick}>
      <span className="box" style={multi ? undefined : { borderRadius: 999 }}>{on ? '✓' : ''}</span>
      {label}
    </button>
  );
}

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState<string[]>([]);
  const [level, setLevel] = useState<string>();
  const [diff, setDiff] = useState<string>();
  const showInstall = !isStandalone();
  const total = showInstall ? 4 : 3;

  const finish = () => {
    const areasPicked = GOALS.filter((g) => goals.includes(g.id) && g.area).map((g) => g.area!) as AreaId[];
    const suggestedArea: AreaId = areasPicked.length === 1 ? areasPicked[0] : 'typography';
    actions.finishOnboarding({ goals, level, difficulty: diff, suggestedArea });
    requestPersistence();
    navigate('/', { replace: true });
  };
  const skipAll = () => {
    actions.finishOnboarding({ goals: [], suggestedArea: 'typography' });
    requestPersistence();
    navigate('/', { replace: true });
  };
  const next = () => (step + 1 < total ? setStep(step + 1) : finish());

  const Q = [
    { title: 'Bạn muốn cải thiện điều gì?', hint: 'Chọn một hoặc nhiều.', body: GOALS.map((g) => <Option key={g.id} multi on={goals.includes(g.id)} label={g.label} onClick={() => setGoals((x) => (x.includes(g.id) ? x.filter((y) => y !== g.id) : [...x, g.id]))} />) },
    { title: 'Bạn tự đánh giá mình ở mức nào?', hint: 'Không có câu trả lời đúng sai.', body: LEVELS.map((l) => <Option key={l.id} on={level === l.id} label={l.label} onClick={() => setLevel(l.id)} />) },
    { title: 'Điều gì khiến bạn khó tự học nhất?', hint: 'Chọn một.', body: DIFFS.map((l) => <Option key={l.id} on={diff === l.id} label={l.label} onClick={() => setDiff(l.id)} />) },
  ];

  return (
    <main className="screen no-nav" style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <div className="row" style={{ minHeight: 48 }}>
        <Steps total={total} current={step} label="Định hướng" />
        <button className="btn btn-ghost btn-small" style={{ border: 0 }} onClick={skipAll}>Bỏ qua</button>
      </div>

      {step === 0 && (
        <div style={{ margin: '20px 0 8px' }}>
          <img src="/brand/yourafik-logo.svg" alt="Yourafik — Graphic design self-learning" style={{ width: 200, height: 'auto' }} />
        </div>
      )}

      {step < 3 ? (
        <section className="stack" style={{ ['--gap' as string]: '10px', marginTop: 20 } as CSSProperties}>
          <h1 className="display" style={{ fontSize: 28 }}>{Q[step].title}</h1>
          <p className="body-s">{Q[step].hint} Câu trả lời chỉ dùng để gợi ý Area bắt đầu — bạn vẫn học được mọi Area.</p>
          <div className="stack" style={{ ['--gap' as string]: '10px', marginTop: 8 } as CSSProperties}>{Q[step].body}</div>
        </section>
      ) : (
        <section className="stack" style={{ ['--gap' as string]: '12px', marginTop: 20 } as CSSProperties}>
          <h1 className="display" style={{ fontSize: 28 }}>Cài lên màn hình chính trước khi học</h1>
          <p className="body">Tiến độ được lưu trên thiết bị. Trên iPhone, Safari và app đã cài dùng hai bộ nhớ riêng — hãy cài app rồi học trong app để không mất tiến độ.</p>
          <button className="btn btn-secondary" onClick={() => { finish(); navigate('/install'); }}>Xem cách cài</button>
        </section>
      )}

      <div style={{ marginTop: 'auto', paddingTop: 24 }}>
        <button className="btn btn-primary btn-block" onClick={next}>
          {step + 1 < total ? 'Tiếp tục' : 'Bắt đầu học'} <span className="btn-dot"><IconArrow size={18} /></span>
        </button>
      </div>
    </main>
  );
}

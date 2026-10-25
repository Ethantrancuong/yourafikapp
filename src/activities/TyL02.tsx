// TY-L02 — Tạo tương phản bằng độ đậm nét chữ. Pattern B: Brief → Attempt → Feedback → Principle.
import { useMemo, useState, type CSSProperties } from 'react';
import { BriefPanel, Segmented, Steps } from '../components/ui';
import { IconUndo } from '../components/Icons';
import { ActionBar, Concept, FeedbackPanel, type Criterion, type EngineProps } from './kit';

type Key = 'title' | 'date' | 'venue';
type W = Record<Key, number>;
const START: W = { title: 400, date: 400, venue: 400 };
const TEXT: Record<Key, string> = { title: 'Workshop Vẽ minh hoạ cho người mới', date: '14:00 · Thứ bảy 28/11', venue: 'Không gian sách Mái Hiên, quận 3' };
const NAME: Record<Key, string> = { title: 'Tên workshop', date: 'Thời gian', venue: 'Địa điểm' };
const WNAME: Record<number, string> = { 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold' };

function WeightCard({ w, hl }: { w: W; hl?: string }) {
  return (
    <div className="preview" style={{ padding: '40px 22px 26px', background: '#F1F5FF' }}>
      <span className="preview-label">Thẻ sự kiện · mọi dòng 20px</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(Object.keys(TEXT) as Key[]).map((k) => (
          <div key={k} className={hl === k ? 'hl' : undefined} style={{ fontSize: 20, lineHeight: 1.2, fontWeight: w[k], fontFamily: "'Be Vietnam Pro', var(--font-body)" }}>
            {TEXT[k]}
          </div>
        ))}
      </div>
    </div>
  );
}

export function evaluateWeights(w: W): Criterion[] {
  const out: Criterion[] = [];
  const others: Key[] = ['date', 'venue'];
  const maxOther = Math.max(w.date, w.venue);
  const heavy = (Object.keys(w) as Key[]).filter((k) => w[k] >= 600);
  const heavierOther = others.find((k) => w[k] > w.title);

  if (heavierOther) {
    out.push({ id: 'focus', criterion: 'Điểm nhấn', level: 'review', target: heavierOther,
      observe: `${NAME[heavierOther]} (${WNAME[w[heavierOther]]}) đang đậm hơn tên workshop (${WNAME[w.title]}).`,
      relate: 'Brief cần tên workshop nổi lên đầu tiên.',
      suggest: 'Thử đổi: tăng độ đậm của tên, giảm độ đậm dòng phụ.' });
  } else if (w.title === maxOther) {
    out.push({ id: 'focus', criterion: 'Điểm nhấn', level: 'review', target: 'title',
      observe: 'Tên workshop và các dòng phụ đang cùng độ đậm.',
      relate: 'Khi cỡ chữ bằng nhau, không có độ đậm khác biệt thì không có điểm nhấn.',
      suggest: 'Thử tăng độ đậm riêng cho tên workshop.' });
  } else if (heavy.length >= 2) {
    out.push({ id: 'focus', criterion: 'Điểm nhấn', level: 'try', target: heavy.find((k) => k !== 'title'),
      observe: `Có ${heavy.length} dòng cùng ở mức đậm (từ SemiBold trở lên).`,
      relate: 'Tên vẫn đậm nhất, nhưng nhiều dòng đậm khiến các điểm nhấn cạnh tranh nhau.',
      suggest: 'Thử giữ mức đậm cao chỉ cho tên, để dòng phụ ở Regular hoặc Medium.' });
  } else {
    out.push({ id: 'focus', criterion: 'Điểm nhấn', level: 'clear',
      observe: `Tên workshop đậm nhất (${WNAME[w.title]}).`,
      relate: 'Người xem nhận ra tên trước, đúng yêu cầu của brief.',
      suggest: 'Thử hạ tên xuống một bậc để xem điểm nhấn còn rõ không.' });
  }

  const diff = w.title - maxOther;
  if (diff > 0) {
    out.push(diff >= 200
      ? { id: 'contrast', criterion: 'Mức tương phản độ đậm', level: 'clear', observe: `Tên đậm hơn dòng phụ ${diff / 100} bậc.`, relate: 'Chênh lệch này dễ nhận ra cả trên màn hình nhỏ.', suggest: 'So sánh với mức chênh lớn nhất (Regular – ExtraBold) để cảm nhận sự khác biệt về giọng điệu.' }
      : { id: 'contrast', criterion: 'Mức tương phản độ đậm', level: 'try', target: 'title', observe: 'Tên chỉ đậm hơn dòng phụ một bậc.', relate: 'Trên màn hình nhỏ, chênh một bậc khá khó nhận ra.', suggest: 'Thử chênh 2–3 bậc rồi so sánh.' });
  }

  out.push(w.date === w.venue
    ? { id: 'consistency', criterion: 'Nhất quán', level: 'clear', observe: 'Thời gian và địa điểm cùng độ đậm.', relate: 'Hai thông tin cùng cấp được đọc như một nhóm.', suggest: 'Giữ quy tắc này khi thêm thông tin phụ khác.' }
    : { id: 'consistency', criterion: 'Nhất quán', level: 'try', target: w.date > w.venue ? 'date' : 'venue', observe: 'Thời gian và địa điểm đang khác độ đậm.', relate: 'Hai thông tin cùng cấp nhưng trông như khác cấp.', suggest: 'Thử để chúng cùng độ đậm, trừ khi bạn muốn một dòng nổi hơn có chủ đích.' });
  return out;
}

type Phase = 'brief' | 'attempt' | 'feedback' | 'principle';
interface Draft { phase: Phase; w: W }

export default function TyL02({ draft, saveDraft, onFeedback, onDone }: EngineProps<Draft>) {
  const [d, setD] = useState<Draft>(draft ?? { phase: 'brief', w: START });
  const [hl, setHl] = useState<string | undefined>();
  const update = (p: Partial<Draft>) => { const n = { ...d, ...p }; setD(n); saveDraft(n); };
  const items = useMemo(() => evaluateWeights(d.w), [d.w]);
  const idx = ['brief', 'attempt', 'feedback', 'principle'].indexOf(d.phase);
  const opts = [400, 500, 600, 700, 800].map((v) => ({ value: v, label: String(v) }));

  return (
    <div className="workspace">
      <Steps total={4} current={idx} label="Tiến trình bài" />
      {d.phase === 'brief' && (
        <>
          <div className="panel stack" style={{ ['--gap' as string]: '10px' } as CSSProperties}>
            <p className="eyebrow">Thử trước, học sau</p>
            <h2 className="h3">Làm tên workshop nổi bật — không được đổi cỡ chữ</h2>
            <p className="body">Thẻ sự kiện đăng trên fanpage của một không gian sách. Ba dòng đều 20px. Bạn chỉ được đổi <b>độ đậm</b> của từng dòng.</p>
          </div>
          <WeightCard w={d.w} />
          <ActionBar><button className="btn btn-primary" onClick={() => update({ phase: 'attempt' })}>Bắt đầu thử</button></ActionBar>
        </>
      )}
      {(d.phase === 'attempt' || d.phase === 'feedback') && (
        <>
          <div className="preview-wrap"><WeightCard w={d.w} hl={d.phase === 'feedback' ? hl : undefined} /></div>
          <BriefPanel><p>Ba dòng cùng 20px. Hãy làm <b>tên workshop</b> được nhìn thấy trước chỉ bằng độ đậm.</p></BriefPanel>
          {d.phase === 'attempt' ? (
            <>
              <div className="panel">
                {(Object.keys(TEXT) as Key[]).map((k) => (
                  <Segmented key={k} label={`${NAME[k]} · ${WNAME[d.w[k]]}`} value={d.w[k]} options={opts} onChange={(v) => update({ w: { ...d.w, [k]: v } })} />
                ))}
                <button className="btn btn-ghost btn-small" style={{ marginTop: 12 }} onClick={() => update({ w: START })}><IconUndo size={18} /> Đặt lại</button>
              </div>
              <ActionBar><button className="btn btn-primary" onClick={() => { update({ phase: 'feedback' }); setHl(items.find((i) => i.level !== 'clear')?.target); onFeedback(); }}>Xem phản hồi</button></ActionBar>
            </>
          ) : (
            <>
              <FeedbackPanel items={items} onFocus={setHl} />
              <ActionBar>
                <button className="btn btn-secondary" onClick={() => update({ phase: 'attempt' })}>Chỉnh lại</button>
                <button className="btn btn-primary" onClick={() => update({ phase: 'principle' })}>Rút ra nguyên lý</button>
              </ActionBar>
            </>
          )}
        </>
      )}
      {d.phase === 'principle' && (
        <>
          <Concept title="Độ đậm cũng tạo phân cấp" source="Lupton, Thinking with Type — Text (hierarchy)">
            <p>Khi cỡ chữ không đổi, chênh lệch <b>độ đậm</b> vẫn giúp mắt nhận ra đâu là thông tin chính. Chênh càng rõ, điểm nhấn càng dễ thấy.</p>
            <p>Nếu nhiều dòng cùng đậm, chúng cạnh tranh nhau. Thông thường chỉ nên có một điểm nhấn chính cho mỗi nhóm thông tin.</p>
          </Concept>
          <WeightCard w={d.w} />
          <ActionBar>
            <button className="btn btn-secondary" onClick={() => update({ phase: 'attempt' })}>Thử lại</button>
            <button className="btn btn-primary" onClick={onDone}>Tiếp tục</button>
          </ActionBar>
        </>
      )}
    </div>
  );
}

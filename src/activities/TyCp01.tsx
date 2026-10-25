// Typography Checkpoint 01 — Thông điệp nào cần được nhìn thấy trước? (tuỳ chọn, làm lại thoải mái)
import { useMemo, useState, type CSSProperties } from 'react';
import { BriefPanel, Segmented, Slider } from '../components/ui';
import { ActionBar, FeedbackPanel, type Criterion, type EngineProps } from './kit';

type FaceId = 'bvp' | 'lora' | 'playfair' | 'abril';
// Typeface trong bài là HỌC LIỆU, khác với font giao diện (Space Grotesk / Inter).
export const FACES: Record<FaceId, { name: string; css: string; vn: boolean; tone: string; thin?: boolean }> = {
  bvp: { name: 'Be Vietnam Pro', css: "'Be Vietnam Pro', sans-serif", vn: true, tone: 'không chân, trung tính, rõ ràng' },
  lora: { name: 'Lora', css: "'Lora', serif", vn: true, tone: 'có chân, mềm, gần gũi' },
  playfair: { name: 'Playfair Display', css: "'Playfair Display', serif", vn: true, tone: 'có chân, tương phản nét cao, trang trọng', thin: true },
  abril: { name: 'Abril Fatface', css: "'Abril Fatface', serif", vn: false, tone: 'rất đậm, kiểu tiêu đề quảng cáo' },
};

const TEXT = { title: 'Đêm nhạc Acoustic gây quỹ “Mùa đông ấm”', date: '19:30 · Thứ bảy 21/11', venue: 'Sân trường THPT Nguyễn Trãi' };

interface State { face: FaceId; mode: 'scale' | 'weight'; size: number; weight: number }
const START: State = { face: 'bvp', mode: 'scale', size: 18, weight: 400 };

function Notice({ s, hl }: { s: State; hl?: string }) {
  const f = FACES[s.face];
  const titleSize = s.mode === 'scale' ? s.size : 22;
  const titleWeight = s.mode === 'weight' ? s.weight : 400;
  return (
    <div className="preview" style={{ padding: '40px 22px 24px', background: '#FDF3EE' }}>
      <span className="preview-label">Thông báo CLB Âm nhạc</span>
      <div style={{ fontFamily: f.css, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className={hl === 'title' ? 'hl' : undefined} style={{ fontSize: titleSize, fontWeight: s.face === 'abril' ? 400 : titleWeight, lineHeight: 1.15 }}>{TEXT.title}</div>
        <div className={hl === 'info' ? 'hl' : undefined} style={{ fontSize: 15, lineHeight: 1.4 }}>
          <div>{TEXT.date}</div>
          <div>{TEXT.venue}</div>
        </div>
      </div>
    </div>
  );
}

function evaluate(s: State): Criterion[] {
  const f = FACES[s.face];
  const out: Criterion[] = [];
  out.push(f.vn
    ? { id: 'vn', criterion: 'Hỗ trợ tiếng Việt', level: 'clear', observe: `${f.name} có đủ dấu tiếng Việt.`, relate: 'Tên sự kiện có nhiều chữ có dấu, hiển thị đồng nhất.', suggest: 'Khi chọn typeface khác, luôn kiểm tra các chữ như “ặ, ỗ, ừ”.' }
    : { id: 'vn', criterion: 'Hỗ trợ tiếng Việt', level: 'review', target: 'title', observe: `${f.name} chưa có bộ dấu tiếng Việt; các chữ có dấu đang được thay bằng phông dự phòng.`, relate: 'Tên sự kiện bị lẫn hai kiểu nét chữ, làm giảm độ chỉn chu của thông báo.', suggest: 'Chọn một typeface có hỗ trợ tiếng Việt rồi so sánh.' });

  const toneLevel = s.face === 'bvp' ? 'try' : s.face === 'abril' ? 'try' : 'clear';
  out.push({ id: 'tone', criterion: 'Phù hợp thông điệp', level: toneLevel, target: 'title',
    observe: `${f.name}: ${f.tone}.`,
    relate: s.face === 'bvp' ? 'Rõ ràng, dễ đọc; cảm giác trung tính hơn không khí một đêm nhạc gây quỹ.'
      : s.face === 'abril' ? 'Rất nổi, nhưng mang giọng quảng cáo mạnh — có thể lấn át sự ấm áp của sự kiện.'
      : 'Mang cảm giác ấm, có chất “sự kiện”, hợp với một đêm nhạc cộng đồng.',
    suggest: 'Đổi qua lại 2 typeface và tự hỏi: cái nào gần với không khí sự kiện hơn? Không có một đáp án duy nhất.' });

  out.push(f.thin
    ? { id: 'read', criterion: 'Khả năng đọc', level: 'try', target: 'info', observe: 'Nét mảnh của Playfair Display ở cỡ 15px trở nên rất mảnh trên màn hình.', relate: 'Thời gian và địa điểm vẫn cần đọc nhanh, rõ.', suggest: 'Cân nhắc dùng typeface này chỉ cho tiêu đề (sẽ học ở Lesson “Kết hợp kiểu chữ có chủ đích”).' }
    : { id: 'read', criterion: 'Khả năng đọc', level: 'clear', target: 'info', observe: 'Dòng thông tin 15px vẫn đọc rõ với typeface này.', relate: 'Người xem đọc được thời gian và địa điểm.', suggest: 'Thử xem trên điện thoại ở khoảng cách tay cầm bình thường.' });

  if (s.mode === 'scale') {
    const r = s.size / 15;
    out.push(r >= 1.5
      ? { id: 'emph', criterion: 'Điểm nhấn', level: 'clear', observe: `Tên sự kiện lớn gấp ×${r.toFixed(1).replace('.', ',')} dòng thông tin.`, relate: 'Thông điệp chính được nhìn thấy trước.', suggest: 'Thử chế độ “Độ đậm” để so sánh hai cách tạo điểm nhấn.' }
      : { id: 'emph', criterion: 'Điểm nhấn', level: r >= 1.25 ? 'try' : 'review', target: 'title', observe: `Tên sự kiện chỉ lớn gấp ×${r.toFixed(1).replace('.', ',')} dòng thông tin.`, relate: 'Chênh lệch còn nhỏ để tên được thấy trước.', suggest: 'Tăng cỡ tên rồi so sánh lại.' });
  } else {
    out.push(s.face === 'abril'
      ? { id: 'emph', criterion: 'Điểm nhấn', level: 'try', target: 'title', observe: 'Abril Fatface chỉ có một độ đậm nên thanh độ đậm không đổi gì.', relate: 'Điểm nhấn ở đây đến từ chính kiểu chữ, không từ độ đậm.', suggest: 'Chuyển sang chế độ “Kích thước”, hoặc chọn typeface có nhiều độ đậm.' }
      : s.weight >= 600
        ? { id: 'emph', criterion: 'Điểm nhấn', level: 'clear', observe: `Tên ở độ đậm ${s.weight}, thông tin ở 400.`, relate: 'Tên nổi lên dù cỡ chữ không đổi nhiều.', suggest: 'Thử chế độ “Kích thước” để so sánh.' }
        : { id: 'emph', criterion: 'Điểm nhấn', level: 'review', target: 'title', observe: `Tên ở độ đậm ${s.weight}, gần với dòng thông tin.`, relate: 'Tên chưa được thấy trước rõ ràng.', suggest: 'Tăng độ đậm của tên lên 600–800.' });
  }
  return out;
}

interface Draft { phase: 'work' | 'feedback'; s: State }

export default function TyCp01({ draft, saveDraft, onFeedback, onDone }: EngineProps<Draft>) {
  const [d, setD] = useState<Draft>(draft ?? { phase: 'work', s: START });
  const [hl, setHl] = useState<string | undefined>();
  const update = (p: Partial<Draft>) => { const n = { ...d, ...p }; setD(n); saveDraft(n); };
  const items = useMemo(() => evaluate(d.s), [d.s]);
  const set = (p: Partial<State>) => update({ s: { ...d.s, ...p } });

  return (
    <div className="workspace">
      <div className="preview-wrap"><Notice s={d.s} hl={d.phase === 'feedback' ? hl : undefined} /></div>
      <BriefPanel defaultOpen={d.phase === 'work'}>
        <p>CLB Âm nhạc cần một thông báo cho đêm nhạc gây quỹ. Người xem cần thấy <b>tên sự kiện</b> trước. Hãy chọn một typeface và chỉnh <b>một</b> biến phân cấp.</p>
      </BriefPanel>
      {d.phase === 'work' ? (
        <>
          <div className="panel">
            <div className="control">
              <div className="control-head"><span>Typeface</span></div>
              <div className="stack" style={{ ['--gap' as string]: '8px' } as CSSProperties}>
                {(Object.keys(FACES) as FaceId[]).map((id) => (
                  <button key={id} type="button" className="option" aria-pressed={d.s.face === id} onClick={() => set({ face: id })}>
                    <span style={{ fontFamily: FACES[id].css, fontSize: 20, flex: 1 }}>Mùa đông ấm</span>
                    <span className="body-s">{FACES[id].name}</span>
                  </button>
                ))}
              </div>
            </div>
            <Segmented label="Biến phân cấp" value={d.s.mode} options={[{ value: 'scale', label: 'Kích thước' }, { value: 'weight', label: 'Độ đậm' }]} onChange={(mode) => set({ mode })} />
            {d.s.mode === 'scale'
              ? <Slider label="Cỡ chữ tên sự kiện" value={d.s.size} min={15} max={36} unit="px" onChange={(size) => set({ size })} />
              : <Slider label="Độ đậm tên sự kiện" value={d.s.weight} min={400} max={800} step={100} onChange={(weight) => set({ weight })} />}
          </div>
          <ActionBar><button className="btn btn-primary" onClick={() => { update({ phase: 'feedback' }); setHl(items.find((i) => i.level !== 'clear')?.target); onFeedback(); }}>Xem phản hồi</button></ActionBar>
        </>
      ) : (
        <>
          <FeedbackPanel items={items} onFocus={setHl} />
          <ActionBar>
            <button className="btn btn-secondary" onClick={() => update({ phase: 'work' })}>Thử phương án khác</button>
            <button className="btn btn-primary" onClick={onDone}>Xong</button>
          </ActionBar>
        </>
      )}
    </div>
  );
}

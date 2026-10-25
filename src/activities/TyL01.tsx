// TY-L01 — Tạo điểm nhấn bằng kích thước. Pattern A: Explore → Concept → Practice → Feedback.
import { useMemo, useState } from 'react';
import { BriefPanel, Slider, Steps } from '../components/ui';
import { IconArrow, IconUndo } from '../components/Icons';
import { ActionBar, Concept, FeedbackPanel, fmt, type Criterion, type EngineProps } from './kit';

interface Sizes { title: number; date: number; venue: number }
const START: Sizes = { title: 16, date: 16, venue: 16 };
const TEXT = { title: 'Ngày hội Đổi sách cũ', date: '08:00 – 11:30 · Chủ nhật 15/11', venue: 'Sân Nhà văn hoá phường 6' };
const NAME = { title: 'Tên sự kiện', date: 'Thời gian', venue: 'Địa điểm' } as const;
type Key = keyof Sizes;

export function SizePoster({ s, hl, weights }: { s: Sizes; hl?: string; weights?: Partial<Record<Key, number>> }) {
  const line = (k: Key) => (
    <div className={hl === k ? 'hl' : undefined} style={{ fontSize: s[k], fontWeight: weights?.[k] ?? (k === 'title' ? 600 : 400), lineHeight: 1.15, fontFamily: "'Be Vietnam Pro', var(--font-body)", overflowWrap: 'anywhere' }}>
      {TEXT[k]}
    </div>
  );
  return (
    <div className="preview" style={{ padding: '40px 22px 26px', minHeight: 220, background: '#FFF8EC' }}>
      <span className="preview-label">Poster bảng tin</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {line('title')}
        {line('date')}
        {line('venue')}
      </div>
    </div>
  );
}

export function evaluateSizes(s: Sizes): Criterion[] {
  const out: Criterion[] = [];
  const entries = (Object.keys(s) as Key[]).sort((a, b) => s[b] - s[a]);
  const largest = entries[0];
  // 1. Thứ tự ưu tiên
  if (largest !== 'title' && s[largest] > s.title) {
    out.push({ id: 'order', criterion: 'Thứ tự đọc', level: 'review', target: largest,
      observe: `${NAME[largest]} đang là dòng lớn nhất (${s[largest]}px), lớn hơn tên sự kiện (${s.title}px).`,
      relate: 'Brief muốn người đi ngang nhận ra tên sự kiện trước.',
      suggest: `Thử tăng cỡ tên sự kiện hoặc giảm cỡ ${NAME[largest].toLowerCase()}, rồi so sánh.` });
  } else if (s.venue > s.date) {
    out.push({ id: 'order', criterion: 'Thứ tự đọc', level: 'try', target: 'venue',
      observe: `Địa điểm (${s.venue}px) đang lớn hơn thời gian (${s.date}px).`,
      relate: 'Theo brief, thời gian cần được đọc trước địa điểm.',
      suggest: 'Thử đổi cỡ chữ của hai dòng này và xem mắt bạn đi theo thứ tự nào.' });
  } else {
    out.push({ id: 'order', criterion: 'Thứ tự đọc', level: 'clear',
      observe: 'Tên sự kiện lớn nhất, tiếp theo là thời gian, rồi địa điểm.',
      relate: 'Thứ tự kích thước khớp với thứ tự ưu tiên trong brief.',
      suggest: 'Thử giảm cỡ tên một chút để xem thứ tự còn rõ ở mức nào.' });
  }
  // 2. Mức chênh lệch
  const sub = Math.max(s.date, s.venue);
  const r = s.title / sub;
  if (r < 1.25) {
    out.push({ id: 'ratio', criterion: 'Mức chênh lệch kích thước', level: 'review', target: 'title',
      observe: r <= 1 ? 'Tên sự kiện không lớn hơn các dòng thông tin.' : `Tên sự kiện chỉ lớn hơn dòng phụ khoảng ${Math.round((r - 1) * 100)}%.`,
      relate: 'Khi chênh lệch nhỏ, các cấp thông tin trông như nhau và khó biết đâu là thông tin chính.',
      suggest: 'Thử đẩy tên lên khoảng gấp 1,5–2 lần dòng phụ và quan sát lại.' });
  } else if (r < 1.5) {
    out.push({ id: 'ratio', criterion: 'Mức chênh lệch kích thước', level: 'try', target: 'title',
      observe: `Tên lớn gấp ×${fmt(r)} dòng phụ — có chênh lệch nhưng còn nhẹ.`,
      relate: 'Poster được xem từ xa khi đi ngang; chênh lệch nhẹ dễ bị bỏ qua.',
      suggest: 'So sánh với một mức lớn hơn để thấy điểm nhấn thay đổi thế nào.' });
  } else if (r <= 3.5) {
    out.push({ id: 'ratio', criterion: 'Mức chênh lệch kích thước', level: 'clear',
      observe: `Tên lớn gấp ×${fmt(r)} dòng phụ.`,
      relate: 'Đủ khác biệt để thấy ngay đâu là thông tin chính của poster.',
      suggest: 'Thử một mức khác trong khoảng này — không có một con số đúng duy nhất.' });
  } else {
    out.push({ id: 'ratio', criterion: 'Mức chênh lệch kích thước', level: 'try', target: 'title',
      observe: `Tên lớn gấp ×${fmt(r)} dòng phụ và phải xuống nhiều dòng.`,
      relate: 'Tên rất nổi bật, nhưng thông tin thời gian, địa điểm có thể bị lấn át.',
      suggest: 'Thử giảm nhẹ tên để cân bằng với phần thông tin.' });
  }
  // 3. Khả năng đọc
  const small = (['date', 'venue'] as Key[]).filter((k) => s[k] < 14);
  out.push(small.length
    ? { id: 'legible', criterion: 'Khả năng đọc', level: 'review', target: small[0],
        observe: `${small.map((k) => NAME[k]).join(' và ')} chỉ còn ${s[small[0]]}px.`,
        relate: 'Thời gian và địa điểm vẫn là thông tin người xem cần đọc được.',
        suggest: 'Giữ dòng phụ từ khoảng 14px trở lên trong bản xem này, rồi tạo điểm nhấn bằng cách tăng tên.' }
    : { id: 'legible', criterion: 'Khả năng đọc', level: 'clear',
        observe: 'Các dòng thông tin phụ vẫn đủ lớn để đọc.',
        relate: 'Brief cần người xem đọc được cả thời gian và địa điểm.',
        suggest: 'Nếu tăng tên thêm, hãy kiểm tra dòng phụ vẫn đọc được.' });
  return out;
}

type Phase = 'explore' | 'concept' | 'practice' | 'feedback';
interface Draft { phase: Phase; explore: number; s: Sizes }

export default function TyL01({ draft, saveDraft, onFeedback, onDone }: EngineProps<Draft>) {
  const [d, setD] = useState<Draft>(draft ?? { phase: 'explore', explore: 16, s: START });
  const [hl, setHl] = useState<string | undefined>();
  const update = (p: Partial<Draft>) => {
    const n = { ...d, ...p };
    setD(n);
    saveDraft(n);
  };
  const items = useMemo(() => evaluateSizes(d.s), [d.s]);
  const idx = ['explore', 'concept', 'practice', 'feedback'].indexOf(d.phase);
  const brief = (
    <BriefPanel defaultOpen={d.phase === 'practice'}>
      <p>Poster dán ở bảng tin phường. Người đi ngang cần nhận ra <b>tên sự kiện</b> trước, sau đó là <b>thời gian</b>, cuối cùng là <b>địa điểm</b>.</p>
      <p>Chỉ dùng <b>kích thước chữ</b> để tạo thứ tự này.</p>
    </BriefPanel>
  );

  return (
    <div className="workspace">
      <Steps total={4} current={idx} label="Tiến trình bài" />

      {d.phase === 'explore' && (
        <>
          <div className="preview-wrap"><SizePoster s={{ title: d.explore, date: 16, venue: 16 }} /></div>
          <div className="panel">
            <p className="eyebrow">Khám phá</p>
            <p className="body" style={{ margin: '4px 0 12px' }}>Kéo thanh trượt và để ý: <b>mắt bạn dừng ở dòng nào đầu tiên?</b></p>
            <Slider label="Cỡ chữ tên sự kiện" value={d.explore} min={14} max={44} unit="px" onChange={(v) => update({ explore: v })} />
          </div>
          <ActionBar>
            <button className="btn btn-primary" onClick={() => update({ phase: 'concept' })}>Mình đã quan sát <span className="btn-dot"><IconArrow size={18} /></span></button>
          </ActionBar>
        </>
      )}

      {d.phase === 'concept' && (
        <>
          <Concept title="Kích thước tạo điểm nhấn" source="Lupton & Phillips, Graphic Design: The New Basics — Scale; Hierarchy">
            <p>Khi một khối chữ lớn hơn <b>rõ rệt</b> so với phần còn lại, người xem thường đọc nó trước. Chênh lệch quá nhỏ khiến các cấp thông tin trông như nhau.</p>
            <p>Kích thước là <i>một</i> cách tạo điểm nhấn. Độ đậm, vị trí, màu và khoảng trống cũng có thể làm việc này.</p>
          </Concept>
          <ActionBar>
            <button className="btn btn-secondary" onClick={() => update({ phase: 'explore' })}>Quay lại</button>
            <button className="btn btn-primary" onClick={() => update({ phase: 'practice' })}>Thực hành</button>
          </ActionBar>
        </>
      )}

      {(d.phase === 'practice' || d.phase === 'feedback') && (
        <>
          <div className="preview-wrap"><SizePoster s={d.s} hl={d.phase === 'feedback' ? hl : undefined} /></div>
          {brief}
          {d.phase === 'practice' ? (
            <>
              <div className="panel">
                <Slider label="Tên sự kiện" value={d.s.title} min={12} max={48} unit="px" onChange={(v) => update({ s: { ...d.s, title: v } })} />
                <Slider label="Thời gian" value={d.s.date} min={10} max={32} unit="px" onChange={(v) => update({ s: { ...d.s, date: v } })} />
                <Slider label="Địa điểm" value={d.s.venue} min={10} max={32} unit="px" onChange={(v) => update({ s: { ...d.s, venue: v } })} />
                <button className="btn btn-ghost btn-small" style={{ marginTop: 12 }} onClick={() => update({ s: START })}><IconUndo size={18} /> Đặt lại</button>
              </div>
              <ActionBar>
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
              <button className="btn btn-ghost btn-block" onClick={() => { update({ s: { title: 32, date: 18, venue: 15 } }); setHl(undefined); }}>Xem một phương án tham khảo</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

// CL-L03 — Tạo tương phản để nội dung rõ hơn. Pattern B: Brief → Attempt → Feedback → Principle.
// Tiêu chí đo được: tỉ lệ tương phản độ sáng (WCAG 2.x) — đây là thước đo độ đọc, không phải điểm thẩm mỹ.
import { useMemo, useState, type CSSProperties } from 'react';
import { BriefPanel, Steps } from '../components/ui';
import { IconEye } from '../components/Icons';
import { ActionBar, Concept, FeedbackPanel, fmt, type Criterion, type EngineProps } from './kit';

const BGS = [
  { hex: '#F6F4F1', name: 'Kem nhạt' }, { hex: '#ECE7E3', name: 'Xám ấm' }, { hex: '#D7F23F', name: 'Vàng chanh' }, { hex: '#FF6B4A', name: 'San hô' },
  { hex: '#3882F6', name: 'Xanh dương' }, { hex: '#0F7D4E', name: 'Xanh lá đậm' }, { hex: '#BB2649', name: 'Đỏ magenta' }, { hex: '#1F1B1A', name: 'Gần đen' },
];
const FGS = [
  { hex: '#1F1B1A', name: 'Gần đen' }, { hex: '#6B6763', name: 'Xám' }, { hex: '#FFFFFF', name: 'Trắng' },
  { hex: '#D7F23F', name: 'Vàng chanh' }, { hex: '#FF6B4A', name: 'San hô' }, { hex: '#9B56DA', name: 'Tím' },
];

const lum = (hex: string) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const contrast = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
const lightWord = (hex: string) => (lum(hex) > 0.4 ? 'sáng' : lum(hex) > 0.12 ? 'trung bình' : 'tối');

function NoticeCard({ bg, fg, gray, hl }: { bg: string; fg: string; gray: boolean; hl?: string }) {
  return (
    <div className="preview" style={{ background: 'var(--surface)', padding: 16 }}>
      <div style={{ background: bg, color: fg, borderRadius: 18, padding: '22px 20px', filter: gray ? 'grayscale(1)' : undefined, transition: 'filter 200ms' }}>
        <div className={hl === 'title' ? 'hl' : undefined} style={{ fontFamily: "'Be Vietnam Pro', var(--font-body)", fontWeight: 700, fontSize: 22, lineHeight: 1.2, outlineColor: fg }}>Thư viện tạm đóng cửa</div>
        <p className={hl === 'body' ? 'hl' : undefined} style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.5, outlineColor: fg }}>
          Từ 20 đến 22/11 để bảo trì hệ thống. Sách đến hạn trả trong thời gian này sẽ được tự động gia hạn.
        </p>
      </div>
    </div>
  );
}

function evaluate(bg: string, fg: string): Criterion[] {
  const r = contrast(bg, fg);
  const R = `${fmt(r, 1)}:1`;
  const out: Criterion[] = [];
  out.push(r >= 4.5
    ? { id: 'body', criterion: 'Đoạn nội dung (15px)', level: 'clear', observe: `Tương phản ${R}.`, relate: 'Đạt mức khuyến nghị cho chữ cỡ thường; người xem đọc được chi tiết ngày và gia hạn.', suggest: r < 7 ? 'Thử một cặp màu tương phản cao hơn để so sánh độ thoải mái khi đọc.' : 'Thử một nền màu đậm hơn mà vẫn giữ được mức này.' }
    : { id: 'body', criterion: 'Đoạn nội dung (15px)', level: r >= 3 ? 'try' : 'review', target: 'body', observe: `Tương phản ${R}, dưới mức khuyến nghị 4,5:1 cho chữ cỡ thường.`, relate: 'Người xem cần đọc rõ ngày đóng cửa và thông tin gia hạn.', suggest: 'Đổi chữ sang màu sáng hơn hoặc tối hơn hẳn so với nền.' });
  out.push(r >= 3
    ? { id: 'title', criterion: 'Tiêu đề (22px đậm)', level: 'clear', observe: `Tương phản ${R}, đủ cho chữ lớn (từ 3:1).`, relate: 'Tiêu đề thông báo được nhận ra ngay.', suggest: 'Chữ lớn chịu được tương phản thấp hơn chữ nhỏ — để ý sự khác biệt này.' }
    : { id: 'title', criterion: 'Tiêu đề (22px đậm)', level: 'review', target: 'title', observe: `Tương phản ${R}, thấp hơn cả mức 3:1 cho chữ lớn.`, relate: 'Ngay cả tiêu đề cũng khó nhận ra khi lướt qua.', suggest: 'Thử chọn màu chữ ở “đầu kia” của thang sáng – tối so với nền.' });
  const same = Math.abs(lum(bg) - lum(fg)) < 0.15;
  out.push(same
    ? { id: 'value', criterion: 'Sáng – tối (value)', level: 'review', observe: `Nền ${lightWord(bg)} và chữ ${lightWord(fg)}: hai màu khác sắc độ nhưng gần nhau về độ sáng.`, relate: 'Mắt tách chữ khỏi nền chủ yếu nhờ chênh lệch sáng – tối, không phải nhờ khác màu.', suggest: 'Bật “Xem thang xám” để thấy chữ gần như hoà vào nền.' }
    : { id: 'value', criterion: 'Sáng – tối (value)', level: 'clear', observe: `Nền ${lightWord(bg)}, chữ ${lightWord(fg)}.`, relate: 'Chênh lệch sáng – tối là yếu tố chính giúp nội dung đọc được.', suggest: 'Bật “Xem thang xám” để kiểm tra — cặp màu tốt vẫn rõ khi mất màu.' });
  return out;
}

type Phase = 'brief' | 'attempt' | 'feedback' | 'principle';
interface Draft { phase: Phase; bg: string; fg: string }

export default function ClL03({ draft, saveDraft, onFeedback, onDone }: EngineProps<Draft>) {
  const [d, setD] = useState<Draft>(draft ?? { phase: 'brief', bg: '#3882F6', fg: '#6B6763' });
  const [gray, setGray] = useState(false);
  const [hl, setHl] = useState<string | undefined>();
  const update = (p: Partial<Draft>) => { const n = { ...d, ...p }; setD(n); saveDraft(n); };
  const items = useMemo(() => evaluate(d.bg, d.fg), [d.bg, d.fg]);
  const idx = ['brief', 'attempt', 'feedback', 'principle'].indexOf(d.phase);
  const grayBtn = (
    <button className="btn btn-ghost btn-small" aria-pressed={gray} onClick={() => setGray(!gray)}><IconEye size={18} /> {gray ? 'Xem màu' : 'Xem thang xám'}</button>
  );

  return (
    <div className="workspace" style={{ ['--accent' as string]: 'var(--blue)' } as CSSProperties}>
      <Steps total={4} current={idx} label="Tiến trình bài" />
      {d.phase === 'brief' && (
        <>
          <div className="panel stack" style={{ ['--gap' as string]: '10px' } as CSSProperties}>
            <p className="eyebrow">Thử trước, học sau</p>
            <h2 className="h3">Thẻ thông báo này khó đọc. Bạn sửa được không?</h2>
            <p className="body">Thư viện phường đăng thông báo tạm đóng cửa lên nhóm Zalo cư dân. Nhiều người đọc trên điện thoại, ngoài trời. Hãy chọn lại <b>màu nền</b> và <b>màu chữ</b>.</p>
          </div>
          <NoticeCard bg={d.bg} fg={d.fg} gray={false} />
          <ActionBar><button className="btn btn-primary" onClick={() => update({ phase: 'attempt' })}>Bắt đầu thử</button></ActionBar>
        </>
      )}
      {(d.phase === 'attempt' || d.phase === 'feedback') && (
        <>
          <div className="preview-wrap"><NoticeCard bg={d.bg} fg={d.fg} gray={gray} hl={d.phase === 'feedback' ? hl : undefined} /></div>
          <BriefPanel><p>Thông báo tạm đóng cửa, đọc trên điện thoại ngoài trời. Cả <b>tiêu đề</b> và <b>đoạn nội dung</b> cần đọc rõ.</p></BriefPanel>
          {d.phase === 'attempt' ? (
            <>
              <div className="panel">
                <div className="control">
                  <div className="control-head"><span>Màu nền</span><output>{BGS.find((b) => b.hex === d.bg)?.name}</output></div>
                  <div className="swatches">{BGS.map((b) => <button key={b.hex} className="swatch" style={{ background: b.hex }} aria-label={`Nền ${b.name}`} aria-pressed={d.bg === b.hex} onClick={() => update({ bg: b.hex })} />)}</div>
                </div>
                <div className="control">
                  <div className="control-head"><span>Màu chữ</span><output>{FGS.find((b) => b.hex === d.fg)?.name}</output></div>
                  <div className="swatches">{FGS.map((b) => <button key={b.hex} className="swatch" style={{ background: b.hex }} aria-label={`Chữ ${b.name}`} aria-pressed={d.fg === b.hex} onClick={() => update({ fg: b.hex })} />)}</div>
                </div>
                <div style={{ marginTop: 16 }}>{grayBtn}</div>
              </div>
              <ActionBar><button className="btn btn-primary" onClick={() => { update({ phase: 'feedback' }); setHl(items.find((i) => i.level !== 'clear')?.target); onFeedback(); }}>Xem phản hồi</button></ActionBar>
            </>
          ) : (
            <>
              <FeedbackPanel items={items} onFocus={setHl}><div style={{ marginTop: 12 }}>{grayBtn}</div></FeedbackPanel>
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
          <Concept accent="var(--blue)" title="Đọc được nhờ chênh lệch sáng – tối" source="Lupton & Phillips, Graphic Design: The New Basics — Color (value)">
            <p>Chữ tách khỏi nền chủ yếu nhờ <b>chênh lệch độ sáng (value)</b>. Hai màu rất khác nhau về sắc độ (hue) vẫn có thể khó đọc nếu chúng sáng tối như nhau.</p>
            <p>Chữ nhỏ cần tương phản cao hơn chữ lớn. Mức 4,5:1 (chữ thường) và 3:1 (chữ lớn) theo WCAG là mốc tham chiếu về khả năng đọc, không phải thước đo cái đẹp.</p>
          </Concept>
          <ActionBar>
            <button className="btn btn-secondary" onClick={() => update({ phase: 'attempt' })}>Thử lại</button>
            <button className="btn btn-primary" onClick={onDone}>Tiếp tục</button>
          </ActionBar>
        </>
      )}
    </div>
  );
}

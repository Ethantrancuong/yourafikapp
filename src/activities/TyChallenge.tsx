// Typography Area Challenge — Tổ chức một poster thông tin bằng chữ.
// Mở đầu bằng "soi lỗi" (Bảng 2.9 luận văn), sau đó chỉnh nhiều biến, nhận phản hồi theo 5 tiêu chí (Brief §15).
// Màu giữ cố định để tách riêng các quyết định Typography.
import { useMemo, useState, type CSSProperties } from 'react';
import { BriefPanel, Segmented, Slider, Steps } from '../components/ui';
import { IconUndo } from '../components/Icons';
import { ActionBar, FeedbackPanel, fmt, type Criterion, type EngineProps } from './kit';
import { FACES } from './TyCp01';

type Face = 'bvp' | 'lora' | 'abril';
type Align = 'mixed' | 'left' | 'center';
interface S { face: Face; titleSize: number; titleWeight: number; leading: number; groupGap: number; align: Align }
const FLAWED: S = { face: 'bvp', titleSize: 19, titleWeight: 500, leading: 1.0, groupGap: 4, align: 'mixed' };
const ITEM_GAP = 4;
const BLOCKS = [
  { id: 'head', lines: [{ k: 'title', t: 'Liên hoan Phim ngắn Sinh viên 2026' }, { k: 'tag', t: 'Những câu chuyện 5 phút' }], mixed: 'center' },
  { id: 'info', lines: [{ k: 'date', t: '18:00 – 21:30 · Thứ sáu 04/12' }, { k: 'venue', t: 'Hội trường A, Nhà văn hoá Sinh viên' }], mixed: 'left' },
  { id: 'foot', lines: [{ k: 'org', t: 'CLB Điện ảnh Trẻ' }, { k: 'cta', t: 'Vào cửa tự do · Đăng ký tại quầy' }], mixed: 'right' },
] as const;
const PROBLEMS: Record<string, string> = {
  head: 'Tên liên hoan gần như cùng cỡ với các dòng khác → thiếu phân cấp.',
  info: 'Các dòng sát nhau, các nhóm thông tin cách đều nhau → khó đọc, khó tách nhóm.',
  foot: 'Ba khối căn lề ba kiểu khác nhau (giữa, trái, phải) → thiếu nhất quán.',
};

function Poster({ s, hl, onTap, found }: { s: S; hl?: string; onTap?: (id: string) => void; found?: string[] }) {
  return (
    <div className="preview" style={{ padding: '40px 22px 24px', background: '#FFFBF1', fontFamily: FACES[s.face].css }}>
      <span className="preview-label">Poster ký túc xá · màu cố định</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: s.groupGap }}>
        {BLOCKS.map((b) => {
          const align = s.align === 'mixed' ? b.mixed : s.align;
          const style: CSSProperties = { textAlign: align as CSSProperties['textAlign'], lineHeight: s.leading, display: 'flex', flexDirection: 'column', gap: ITEM_GAP, borderRadius: 8, cursor: onTap ? 'pointer' : undefined };
          const isFound = found?.includes(b.id);
          const Tag = onTap ? 'button' : 'div';
          return (
            <Tag key={b.id} type={onTap ? 'button' : undefined} onClick={onTap ? () => onTap(b.id) : undefined}
              className={hl === b.id || isFound ? 'hl' : undefined}
              aria-label={onTap ? `Khối ${b.lines.map((l) => l.t).join(', ')}` : undefined}
              style={{ ...style, background: 'transparent', border: 0, padding: 0, font: 'inherit', color: 'inherit', width: '100%' }}>
              {b.lines.map((l) => (
                <span key={l.k} style={{
                  fontSize: l.k === 'title' ? s.titleSize : l.k === 'tag' ? 15 : 14,
                  fontWeight: l.k === 'title' ? (s.face === 'abril' ? 400 : s.titleWeight) : l.k === 'tag' ? 500 : 400,
                  fontStyle: l.k === 'tag' && s.face === 'lora' ? 'italic' : undefined,
                }}>{l.t}</span>
              ))}
            </Tag>
          );
        })}
      </div>
    </div>
  );
}

function evaluate(s: S): Criterion[] {
  const out: Criterion[] = [];
  const r = s.titleSize / 15;
  const strong = r >= 1.6 || (r >= 1.3 && s.titleWeight >= 700);
  out.push(strong
    ? { id: 'hier', criterion: 'Phân cấp', level: 'clear', observe: `Tên lớn gấp ×${fmt(r)} dòng phụ, độ đậm ${s.face === 'abril' ? 'của kiểu chữ' : s.titleWeight}.`, relate: 'Từ xa 2 m vẫn nhận ra ngay tên liên hoan.', suggest: 'Thử bớt một biến (cỡ hoặc đậm) xem điểm nhấn còn đủ không.' }
    : { id: 'hier', criterion: 'Phân cấp', level: r >= 1.25 ? 'try' : 'review', target: 'head', observe: `Tên chỉ lớn gấp ×${fmt(r)} dòng phụ${s.titleWeight >= 700 ? '' : ', độ đậm vừa phải'}.`, relate: 'Brief cần tên liên hoan nổi bật khi nhìn từ xa.', suggest: 'Tăng cỡ tên, hoặc kết hợp cỡ lớn hơn với độ đậm.' });

  if (s.leading < 1.2) out.push({ id: 'legible', criterion: 'Khả năng đọc', level: 'review', target: 'info', observe: `Khoảng cách dòng ${fmt(s.leading)} — các dòng gần chạm nhau, dấu tiếng Việt dễ va vào dòng trên.`, relate: 'Sinh viên cần đọc nhanh thời gian và địa điểm.', suggest: 'Thử leading khoảng 1,3–1,5.' });
  else if (s.face === 'abril') out.push({ id: 'legible', criterion: 'Khả năng đọc', level: 'review', target: 'head', observe: 'Abril Fatface chưa hỗ trợ dấu tiếng Việt; chữ có dấu bị thay bằng phông khác.', relate: 'Poster bằng tiếng Việt cần hiển thị dấu đồng nhất.', suggest: 'Chọn typeface có hỗ trợ tiếng Việt.' });
  else if (s.leading > 1.7) out.push({ id: 'legible', criterion: 'Khả năng đọc', level: 'try', target: 'info', observe: `Khoảng cách dòng ${fmt(s.leading)} khá thưa.`, relate: 'Các dòng trong cùng một nhóm bắt đầu tách rời nhau.', suggest: 'Thử giảm về khoảng 1,4–1,6.' });
  else out.push({ id: 'legible', criterion: 'Khả năng đọc', level: 'clear', observe: `Khoảng cách dòng ${fmt(s.leading)}, các dòng tách bạch.`, relate: 'Thông tin đọc được nhanh, kể cả chữ có dấu.', suggest: 'So sánh 1,3 và 1,6 để cảm nhận nhịp đọc khác nhau.' });

  out.push(s.align === 'mixed'
    ? { id: 'consist', criterion: 'Nhất quán', level: 'review', target: 'foot', observe: 'Ba khối đang căn giữa, căn trái và căn phải.', relate: 'Không có một trục chung nên poster trông rời rạc.', suggest: 'Chọn một kiểu căn lề cho toàn poster.' }
    : { id: 'consist', criterion: 'Nhất quán', level: 'clear', observe: `Toàn poster căn ${s.align === 'left' ? 'trái' : 'giữa'}.`, relate: 'Các khối dựa trên một trục chung, liên kết với nhau.', suggest: s.align === 'center' ? 'Căn giữa hợp với poster ngắn; thử căn trái để so sánh nhịp đọc.' : 'Thử căn giữa để so sánh cảm giác trang trọng hơn hay không.' });

  const ratio = s.groupGap / ITEM_GAP;
  out.push(ratio >= 2.5
    ? { id: 'group', criterion: 'Khoảng cách & nhóm', level: 'clear', observe: `Khoảng cách giữa các nhóm (${s.groupGap}px) lớn gấp ×${fmt(ratio)} khoảng cách trong nhóm.`, relate: 'Người xem thấy rõ 3 nhóm: tên, thời gian – địa điểm, đơn vị tổ chức.', suggest: 'Thử một mức rất lớn để xem khi nào các nhóm bắt đầu rời rạc.' }
    : { id: 'group', criterion: 'Khoảng cách & nhóm', level: ratio >= 1.5 ? 'try' : 'review', target: 'info', observe: `Khoảng cách giữa các nhóm (${s.groupGap}px) gần bằng khoảng cách trong nhóm (${ITEM_GAP}px).`, relate: 'Các thông tin trông như một danh sách liền, khó tách nhóm.', suggest: 'Tăng khoảng cách giữa các nhóm lên ít nhất gấp 2–3 lần.' });

  out.push(s.face === 'abril'
    ? { id: 'brief', criterion: 'Phù hợp brief', level: 'review', target: 'head', observe: 'Typeface chưa hỗ trợ tiếng Việt.', relate: 'Không đáp ứng yêu cầu poster tiếng Việt đọc rõ từ xa.', suggest: 'Đổi sang Be Vietnam Pro hoặc Lora.' }
    : { id: 'brief', criterion: 'Phù hợp brief', level: 'clear', observe: `${FACES[s.face].name}: ${FACES[s.face].tone}.`, relate: s.face === 'lora' ? 'Gợi cảm giác “câu chuyện”, hợp với liên hoan phim.' : 'Rõ ràng, hiện đại, dễ đọc từ xa.', suggest: 'Đổi typeface còn lại để so sánh không khí của poster.' });
  return out;
}

type Phase = 'find' | 'edit' | 'feedback';
interface Draft { phase: Phase; found: string[]; s: S }

export default function TyChallenge({ draft, saveDraft, onFeedback, onDone }: EngineProps<Draft>) {
  const [d, setD] = useState<Draft>(draft ?? { phase: 'find', found: [], s: FLAWED });
  const [hl, setHl] = useState<string | undefined>();
  const [msg, setMsg] = useState<string>('');
  const [tab, setTab] = useState<'face' | 'hier' | 'space' | 'align'>('hier');
  const update = (p: Partial<Draft>) => { const n = { ...d, ...p }; setD(n); saveDraft(n); };
  const set = (p: Partial<S>) => update({ s: { ...d.s, ...p } });
  const items = useMemo(() => evaluate(d.s), [d.s]);
  const idx = ['find', 'edit', 'feedback'].indexOf(d.phase);

  const tap = (id: string) => {
    if (!d.found.includes(id)) update({ found: [...d.found, id] });
    setMsg(PROBLEMS[id]);
  };

  return (
    <div className="workspace">
      <Steps total={3} current={idx} label="Tiến trình Challenge" />
      {d.phase === 'find' ? (
        <>
          <div className="preview-wrap"><Poster s={d.s} onTap={tap} found={d.found} /></div>
          <div className="panel stack" style={{ ['--gap' as string]: '10px' } as CSSProperties}>
            <p className="eyebrow">Bước 1 · Soi lỗi</p>
            <p className="body">Poster này có <b>3 vấn đề</b> về chữ. Chạm vào khối bạn thấy chưa ổn.</p>
            <p className="num" aria-live="polite">{d.found.length}/3 vấn đề đã tìm thấy</p>
            {msg && <p className="body" role="status" style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 12 }}>{msg}</p>}
          </div>
          <ActionBar>
            {d.found.length < 3 && <button className="btn btn-secondary" onClick={() => { update({ found: ['head', 'info', 'foot'] }); setMsg('Đã hiện tất cả: phân cấp, khoảng cách – nhóm, căn lề.'); }}>Xem gợi ý</button>}
            <button className="btn btn-primary" onClick={() => update({ phase: 'edit' })}>Bắt đầu chỉnh</button>
          </ActionBar>
        </>
      ) : (
        <>
          <div className="preview-wrap"><Poster s={d.s} hl={d.phase === 'feedback' ? hl : undefined} /></div>
          <BriefPanel defaultOpen={d.phase === 'edit' && !draft}>
            <p>Poster dán ở ký túc xá, mời sinh viên tới <b>Liên hoan Phim ngắn</b>. Cần: tên liên hoan nổi bật khi nhìn từ xa 2 m; thời gian – địa điểm đọc nhanh; thông tin được <b>gom thành nhóm</b> rõ; toàn poster nhất quán. Màu giữ nguyên.</p>
          </BriefPanel>
          {d.phase === 'edit' ? (
            <>
              <div className="panel">
                <div className="segmented" role="tablist" aria-label="Nhóm điều chỉnh" style={{ marginBottom: 16 }}>
                  {([['face', 'Chữ'], ['hier', 'Phân cấp'], ['space', 'Khoảng cách'], ['align', 'Căn lề']] as const).map(([k, l]) => (
                    <button key={k} role="tab" aria-selected={tab === k} aria-pressed={tab === k} onClick={() => setTab(k)}>{l}</button>
                  ))}
                </div>
                {tab === 'face' && (
                  <div className="stack" style={{ ['--gap' as string]: '8px' } as CSSProperties}>
                    {(['bvp', 'lora', 'abril'] as Face[]).map((id) => (
                      <button key={id} type="button" className="option" aria-pressed={d.s.face === id} onClick={() => set({ face: id })}>
                        <span style={{ fontFamily: FACES[id].css, fontSize: 19, flex: 1 }}>Phim ngắn</span>
                        <span className="body-s">{FACES[id].name}</span>
                      </button>
                    ))}
                  </div>
                )}
                {tab === 'hier' && (
                  <>
                    <Slider label="Cỡ chữ tên liên hoan" value={d.s.titleSize} min={15} max={40} unit="px" onChange={(titleSize) => set({ titleSize })} />
                    <Slider label="Độ đậm tên liên hoan" value={d.s.titleWeight} min={400} max={800} step={100} onChange={(titleWeight) => set({ titleWeight })} />
                  </>
                )}
                {tab === 'space' && (
                  <>
                    <Slider label="Khoảng cách dòng (leading)" value={d.s.leading} min={1} max={2} step={0.05} format={(v) => fmt(v, 2)} onChange={(leading) => set({ leading })} />
                    <Slider label="Khoảng cách giữa các nhóm" value={d.s.groupGap} min={4} max={40} unit="px" onChange={(groupGap) => set({ groupGap })} />
                  </>
                )}
                {tab === 'align' && (
                  <Segmented label="Căn lề toàn poster" value={d.s.align} options={[{ value: 'mixed', label: 'Như ban đầu' }, { value: 'left', label: 'Trái' }, { value: 'center', label: 'Giữa' }]} onChange={(align) => set({ align })} />
                )}
                <button className="btn btn-ghost btn-small" style={{ marginTop: 16 }} onClick={() => set(FLAWED)}><IconUndo size={18} /> Về poster ban đầu</button>
              </div>
              <ActionBar><button className="btn btn-primary" onClick={() => { update({ phase: 'feedback' }); setHl(items.find((i) => i.level !== 'clear')?.target); onFeedback(); }}>Xem phản hồi</button></ActionBar>
            </>
          ) : (
            <>
              <FeedbackPanel items={items} onFocus={setHl} />
              <ActionBar>
                <button className="btn btn-secondary" onClick={() => update({ phase: 'edit' })}>Chỉnh tiếp</button>
                <button className="btn btn-primary" onClick={onDone}>Hoàn tất Challenge</button>
              </ActionBar>
              <p className="body-s">Bạn có thể hoàn tất ngay cả khi còn tiêu chí “nên xem lại” — mục tiêu là hiểu lựa chọn của mình.</p>
            </>
          )}
        </>
      )}
    </div>
  );
}

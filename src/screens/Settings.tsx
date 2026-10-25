// Cài đặt: Chế độ demo (cho giảng viên), chuyển động, sao lưu tiến độ, cài app, giới thiệu bản mẫu.
import { useState, type CSSProperties } from 'react';
import { AREA_COLOR, areas, getTopic } from '../data/curriculum';
import { actions, areaStatus, topicStatus, useProgress } from '../state/progress';
import { Link, navigate } from '../lib/router';
import { Segmented, Toast, TopBar, useToast } from '../components/ui';
import { IconChevron } from '../components/Icons';

export default function Settings() {
  const s = useProgress();
  const [demo, setDemo] = useState(false);
  const [code, setCode] = useState('');
  const [toast, setToast] = useToast();

  return (
    <main className="screen">
      <TopBar title="Cài đặt" />
      <div className="stack" style={{ ['--gap' as string]: '22px' } as CSSProperties}>
        {/* ── Chế độ demo ── */}
        <section className="card">
          <div className="row">
            <div style={{ flex: 1 }}>
              <h2 className="h3">Chế độ demo</h2>
              <p className="body-s">Cho giảng viên: đánh dấu nhanh trạng thái hoàn thành để xem Piece Assembly mà không cần học hết từng Lesson.</p>
            </div>
            <button className="btn btn-secondary btn-small" aria-expanded={demo} onClick={() => setDemo(!demo)}>{demo ? 'Đóng' : 'Mở'}</button>
          </div>
          {demo && (
            <div className="stack" style={{ ['--gap' as string]: '18px', marginTop: 16 } as CSSProperties}>
              {areas.map((a) => {
                const st = areaStatus(s, a.id);
                return (
                  <div key={a.id} style={{ borderTop: '1px solid var(--surface-2)', paddingTop: 14 }}>
                    <p className="eyebrow" style={{ color: 'var(--ink)' }}>
                      <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: AREA_COLOR[a.id], marginRight: 6 }} />
                      {a.name}
                    </p>
                    <div className="chips" style={{ marginTop: 8 }}>
                      {a.topicIds.map((tid) => {
                        const done = topicStatus(s, tid) === 'completed';
                        return (
                          <button key={tid} className="chip" disabled={done} aria-pressed={done} onClick={() => { actions.demoCompleteTopic(tid); setToast(`Đã đánh dấu ${getTopic(tid)!.code}. Mở ${a.name} để xem mảnh ghép.`); }}>
                            {done ? '✓ ' : ''}Xong {getTopic(tid)!.code}
                          </button>
                        );
                      })}
                    </div>
                    <div className="chips" style={{ marginTop: 8 }}>
                      <button className="chip" disabled={st !== 'topics_completed'} onClick={() => { actions.demoCompleteChallenge(a.id); setToast('Đã hoàn thành Challenge. Mở Lộ trình để xem Area ghép vào Foundation.'); }}>
                        Xong Area Challenge
                      </button>
                      <button className="chip" onClick={() => { actions.resetArea(a.id); setToast(`Đã đặt lại ${a.name}.`); }}>Đặt lại Area</button>
                    </div>
                  </div>
                );
              })}
              <div className="btn-row">
                <Link to="/area/typography" className="btn btn-secondary btn-small">Mở Typography</Link>
                <Link to="/map" className="btn btn-secondary btn-small">Mở Lộ trình</Link>
              </div>
            </div>
          )}
        </section>

        {/* ── Hiển thị ── */}
        <section className="card">
          <h2 className="h3">Chuyển động</h2>
          <Segmented label="Hiệu ứng ghép mảnh" value={s.motion} options={[{ value: 'system', label: 'Theo máy' }, { value: 'reduce', label: 'Giảm tối đa' }]} onChange={(m) => actions.setMotion(m)} />
          <p className="body-s" style={{ marginTop: 8 }}>“Theo máy” tôn trọng cài đặt Reduce Motion của iPhone/Android.</p>
        </section>

        {/* ── Dữ liệu ── */}
        <section className="card stack" style={{ ['--gap' as string]: '12px' } as CSSProperties}>
          <h2 className="h3">Tiến độ của bạn</h2>
          <p className="body-s">Tiến độ chỉ lưu trên thiết bị này. Trên iPhone, Safari và app đã cài dùng hai bộ nhớ riêng. Dùng mã dưới đây để chuyển tiến độ sang nơi khác.</p>
          <div className="btn-row">
            <button className="btn btn-secondary btn-small" onClick={async () => {
              const c = actions.exportCode();
              setCode(c);
              try { await navigator.clipboard.writeText(c); setToast('Đã sao chép mã tiến độ.'); } catch { setToast('Mã đã hiện bên dưới — hãy sao chép thủ công.'); }
            }}>Xuất mã</button>
            <button className="btn btn-secondary btn-small" onClick={() => {
              if (!code.trim()) { setToast('Dán mã vào ô bên dưới trước.'); return; }
              setToast(actions.importCode(code) ? 'Đã khôi phục tiến độ.' : 'Mã không hợp lệ.');
            }}>Nhập mã</button>
          </div>
          <label className="sr-only" htmlFor="code">Mã tiến độ</label>
          <textarea id="code" className="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Mã tiến độ sẽ hiện ở đây, hoặc dán mã để khôi phục" />
          <button className="btn btn-ghost btn-small" onClick={() => { if (confirm('Xoá toàn bộ tiến độ trên thiết bị này?')) { actions.resetAll(); setToast('Đã xoá tiến độ.'); } }}>Xoá toàn bộ tiến độ</button>
        </section>

        <section className="card" style={{ padding: 0 }}>
          <Link to="/install" className="card-link" style={{ padding: '14px 18px' }}>
            <span style={{ flex: 1 }}><span className="h3" style={{ display: 'block' }}>Cài app lên màn hình chính</span><span className="body-s">Hướng dẫn cho iPhone và Android</span></span>
            <IconChevron />
          </Link>
          <button className="card-link" style={{ padding: '14px 18px', width: '100%', border: 0, borderTop: '1px solid var(--surface-2)', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}
            onClick={() => { actions.replayOnboarding(); navigate('/'); }}>
            <span style={{ flex: 1 }}><span className="h3" style={{ display: 'block' }}>Làm lại phần định hướng</span><span className="body-s">Chọn lại mục tiêu và Area gợi ý</span></span>
            <IconChevron />
          </button>
        </section>

        <section className="card">
          <h2 className="h3">Về bản mẫu</h2>
          <p className="body-s" style={{ marginTop: 6 }}>
            Yourafik V1 là bản mẫu phục vụ luận văn thạc sĩ về gamification trong tự học thiết kế đồ hoạ trên di động. Ứng dụng không thay thế đào tạo chính quy và không đo hiệu quả học tập dài hạn.
            Phản hồi được tạo theo quy tắc từ trạng thái bài làm, không phải đánh giá của chuyên gia. Bản mẫu có 3 Area đầu tiên của Stage 01 Foundation; 6 hoạt động có tương tác đầy đủ, các hoạt động còn lại hiển thị “Đang xây dựng”.
          </p>
          <p className="body-s" style={{ marginTop: 8 }}>Phiên bản 1.0 · Biểu tượng app là bản đề xuất, chưa phải logo chính thức.</p>
        </section>
      </div>
      <Toast msg={toast} />
    </main>
  );
}

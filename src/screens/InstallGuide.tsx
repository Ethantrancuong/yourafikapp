import type { CSSProperties } from 'react';
import { TopBar } from '../components/ui';

const ua = navigator.userAgent;
const isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isAndroid = /Android/.test(ua);

function Steps({ title, items, active }: { title: string; items: string[]; active: boolean }) {
  return (
    <section className="card" style={active ? { border: '2px solid var(--brand)' } : undefined}>
      <h2 className="h3">{title}{active ? ' · thiết bị của bạn' : ''}</h2>
      <ol style={{ margin: '10px 0 0', paddingLeft: 20 }}>
        {items.map((t, i) => <li key={i} style={{ marginTop: 6 }}>{t}</li>)}
      </ol>
    </section>
  );
}

export default function InstallGuide() {
  const ios = (
    <Steps key="ios" active={isIOS} title="iPhone · Safari" items={[
      'Mở link Yourafik bằng Safari (không dùng trình duyệt trong Zalo/Messenger).',
      'Bấm nút Chia sẻ (hình vuông có mũi tên lên) ở thanh dưới.',
      'Chọn “Thêm vào MH chính” (Add to Home Screen). Nếu thấy “Mở dưới dạng ứng dụng web”, hãy để bật.',
      'Bấm “Thêm”, rồi mở Yourafik từ biểu tượng trên màn hình chính.',
    ]} />
  );
  const android = (
    <Steps key="android" active={isAndroid} title="Android · Chrome" items={[
      'Mở link Yourafik bằng Chrome.',
      'Bấm “Cài đặt ứng dụng” nếu Chrome hiện lời mời, hoặc mở menu ⋮.',
      'Chọn “Cài đặt ứng dụng” hoặc “Thêm vào màn hình chính”.',
      'Mở Yourafik từ biểu tượng vừa tạo.',
    ]} />
  );
  return (
    <main className="screen">
      <TopBar back="/settings" title="Cài app" />
      <h1 className="display h1">Cài Yourafik lên màn hình chính</h1>
      <p className="body-s" style={{ margin: '8px 0 20px' }}>Không cần App Store hay Google Play. Sau khi cài, app mở toàn màn hình và dùng được cả khi mất mạng.</p>
      <div className="stack" style={{ ['--gap' as string]: '14px' } as CSSProperties}>
        {isAndroid ? [android, ios] : [ios, android]}
        <p className="body-s">Lưu ý: tiến độ lưu riêng trên từng thiết bị. Trên iPhone, tiến độ trong Safari không tự chuyển sang app đã cài — dùng “Xuất mã / Nhập mã” trong Cài đặt nếu cần.</p>
      </div>
    </main>
  );
}

# Yourafik — Prototype V1 (PWA)

Ứng dụng tự học nguyên lý thiết kế đồ hoạ, mobile-first, cài được lên iPhone/Android không cần App Store hay Google Play.
Bản mẫu phục vụ luận văn thạc sĩ — xem `../Source of Truth/`.

## Chạy thử trên máy (Mac)

Cần Node.js 20 trở lên — tải bản LTS tại https://nodejs.org/en/download

```bash
cd "~/Documents/Thạc Luận/Yourafik_code/app"
npm install
npm run dev
```

- Mở http://localhost:5173 trên máy tính.
- Xem trên điện thoại cùng mạng Wi-Fi: mở địa chỉ `Network: http://192.168.x.x:5173` mà Terminal in ra.
  (Qua HTTP nội bộ, app chạy được nhưng chưa cài như app thật — cần link HTTPS từ Vercel.)

Bản build giống production: `npm run build` rồi `npm run preview`.

## Triển khai miễn phí lên Vercel (link HTTPS để chia sẻ)

Cách A — qua GitHub (khuyên dùng, mỗi lần sửa code sẽ tự deploy lại):

1. Tạo repo mới: https://github.com/new (để Private cũng được).
2. Đưa **nội dung thư mục `app/`** lên repo (kéo thả trên web “uploading an existing file”, hoặc dùng GitHub Desktop: https://desktop.github.com). Không đưa `node_modules/` và `dist/`.
3. Vào https://vercel.com/new → đăng nhập bằng GitHub → **Import** repo vừa tạo.
4. Vercel tự nhận Vite: Build Command `npm run build`, Output Directory `dist`. Bấm **Deploy**.
5. Nhận link dạng `https://yourafik-xxxx.vercel.app` → gửi cho giảng viên và người tham gia.

Cách B — Vercel CLI (không cần GitHub):

```bash
cd app
npx vercel        # lần đầu: đăng nhập, chấp nhận mặc định
npx vercel --prod # đưa lên link chính thức
```

`vercel.json` đã cấu hình: mọi đường dẫn trả về `index.html` (SPA), `sw.js` không bị cache.

## Cài lên điện thoại

- **iPhone (Safari):** mở link → nút Chia sẻ → *Thêm vào MH chính* (Add to Home Screen) → Thêm.
- **Android (Chrome):** mở link → *Cài đặt ứng dụng* (hoặc menu ⋮ → Thêm vào màn hình chính).
- Trong app có màn hướng dẫn: Cài đặt → *Cài app lên màn hình chính*.

## Cấu trúc

```
app/
├── index.html               # meta PWA, font Google Fonts
├── public/
│   ├── manifest.webmanifest # tên, icon, màu, display standalone
│   ├── sw.js                # service worker viết tay (offline)
│   ├── brand/yourafik-logo.svg   # logo chính thức — KHÔNG sửa
│   └── icons/               # app icon đề xuất (hình thoi từ logo)
├── src/
│   ├── data/curriculum.ts   # 3 Area · 11 Topic · 25 Lesson · 6 Checkpoint · 3 Challenge
│   ├── state/progress.ts    # tiến độ (localStorage) + trạng thái dẫn xuất + chế độ demo
│   ├── activities/          # 6 hoạt động có tương tác + bộ phản hồi theo tiêu chí
│   ├── screens/             # Home, Lộ trình, Area, Topic, Hoạt động, Cài đặt, Onboarding
│   ├── components/          # UI dùng chung, icon, Area symbol
│   └── lib/router.tsx       # router tối giản
(skill Vercel nằm ở ../skills-vercel/ — xem README trong đó)
```

## Sửa nội dung thường gặp

| Muốn sửa | File |
|---|---|
| Tên/mục tiêu Lesson, Topic, Area | `src/data/curriculum.ts` |
| Màu, font, bo góc | `src/styles.css` (khối `:root`) |
| Hình Area symbol | `src/components/AreaSymbol.tsx` (`PIECES`) |
| Câu phản hồi của từng bài | `src/activities/<Bài>.tsx`, hàm `evaluate…` |
| App icon | thay file trong `public/icons/` (giữ tên) |

## Lưu dữ liệu

V1 lưu tiến độ **trên thiết bị** (localStorage), không cần tài khoản. Trên iPhone, Safari và app đã cài dùng hai bộ nhớ riêng → hãy cài app trước khi học. Có “Xuất mã / Nhập mã” trong Cài đặt để chuyển tiến độ. Đồng bộ nhiều thiết bị (Supabase/Firebase) để dành cho giai đoạn thu dữ liệu Chương 4 — mọi đọc/ghi đã đi qua `repository` trong `src/state/progress.ts` để thay thế dễ dàng.

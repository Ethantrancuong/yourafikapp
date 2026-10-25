import type { ComponentType } from 'react';
import type { EngineProps } from './kit';
import TyL01 from './TyL01';
import TyL02 from './TyL02';
import TyCp01 from './TyCp01';
import TyChallenge from './TyChallenge';
import CoL03 from './CoL03';
import ClL03 from './ClL03';

export interface EngineMeta {
  component: ComponentType<EngineProps<any>>;
  pattern: string;
  doWhat: string;
  minutes: number;
}

// Các hoạt động có tương tác thật trong V1. Hoạt động khác hiển thị trạng thái "Đang xây dựng".
export const ENGINES: Record<string, EngineMeta> = {
  'TY-L01': { component: TyL01, pattern: 'Khám phá → Nguyên lý → Thực hành → Phản hồi', doWhat: 'Kéo thanh trượt cỡ chữ cho 3 dòng của một poster bảng tin và quan sát thứ tự đọc thay đổi.', minutes: 4 },
  'TY-L02': { component: TyL02, pattern: 'Brief → Thử → Phản hồi → Nguyên lý', doWhat: 'Chỉ dùng độ đậm để làm nổi tên một workshop khi mọi dòng cùng cỡ.', minutes: 3 },
  'TY-CP01': { component: TyCp01, pattern: 'Checkpoint tuỳ chọn', doWhat: 'Chọn typeface cho một thông báo đêm nhạc và chỉnh một biến phân cấp.', minutes: 3 },
  'TY-CH': { component: TyChallenge, pattern: 'Soi lỗi → Chỉnh sửa → Phản hồi', doWhat: 'Tìm 3 vấn đề của một poster chữ rồi sửa: typeface, phân cấp, khoảng cách, căn lề.', minutes: 8 },
  'CO-L03': { component: CoL03, pattern: 'Khám phá → Nguyên lý → Thực hành → Phản hồi', doWhat: 'Kéo các nhãn về gần biểu tượng của chúng để tạo nhóm rõ ràng.', minutes: 4 },
  'CL-L03': { component: ClL03, pattern: 'Brief → Thử → Phản hồi → Nguyên lý', doWhat: 'Chọn lại màu nền và màu chữ để một thẻ thông báo đọc rõ trên điện thoại.', minutes: 3 },
};

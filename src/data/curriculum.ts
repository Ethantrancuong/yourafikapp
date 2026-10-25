// Curriculum Stage 01 — Foundation (Master Brief §06–07).
// 3 Area · 11 Topic · 25 Lesson · 6 Checkpoint · 3 Area Challenge = 34 hoạt động.
// Không thêm/bớt hoạt động ở đây nếu Master Brief chưa thay đổi.

export type AreaId = 'typography' | 'composition' | 'color';
export type ActivityKind = 'lesson' | 'checkpoint' | 'challenge';

export interface Activity {
  id: string;
  kind: ActivityKind;
  areaId: AreaId;
  topicId?: string; // lesson: topic chứa nó; checkpoint: topic mà nó đứng sau
  title: string;
  objective: string;
  /** true = có tương tác thật trong V1; false = mới có khung (Đang xây dựng) */
  interactive: boolean;
}

export interface Topic {
  id: string;
  areaId: AreaId;
  code: string; // T01…
  title: string;
  objective: string;
  lessonIds: string[];
  checkpointId?: string; // checkpoint mở sau topic này
}

export interface Area {
  id: AreaId;
  index: string; // 01, 02, 03
  name: string;
  tagline: string;
  description: string;
  topicIds: string[];
  challengeId: string;
}

const L = (id: string, areaId: AreaId, topicId: string, title: string, objective: string, interactive = false): Activity =>
  ({ id, kind: 'lesson', areaId, topicId, title, objective, interactive });

export const activities: Activity[] = [
  // ── AREA 01 — TYPOGRAPHY ──
  L('TY-L01', 'typography', 'TY-T01', 'Tạo điểm nhấn bằng kích thước', 'Dùng chênh lệch cỡ chữ để người xem nhận ra thông tin chính trước.', true),
  L('TY-L02', 'typography', 'TY-T01', 'Tạo tương phản bằng độ đậm nét chữ', 'Dùng độ đậm (font weight) để tạo điểm nhấn khi cỡ chữ không đổi.', true),
  L('TY-L03', 'typography', 'TY-T02', 'Chọn kiểu chữ phù hợp với thông điệp', 'Chọn typeface dựa trên thông điệp, khả năng đọc và hỗ trợ tiếng Việt.'),
  L('TY-L04', 'typography', 'TY-T02', 'Kết hợp kiểu chữ có chủ đích', 'Kết hợp hai typeface với vai trò rõ ràng thay vì ngẫu nhiên.'),
  L('TY-L05', 'typography', 'TY-T03', 'Điều chỉnh khoảng cách giữa các chữ', 'Quan sát tracking ảnh hưởng tới nhịp đọc và cảm giác của dòng chữ.'),
  L('TY-L06', 'typography', 'TY-T03', 'Điều chỉnh khoảng cách giữa các dòng', 'Điều chỉnh leading để khối văn bản dễ đọc hơn.'),
  L('TY-L07', 'typography', 'TY-T03', 'Điều chỉnh chiều dài dòng chữ', 'Nhận biết chiều dài dòng phù hợp với bối cảnh đọc.'),
  L('TY-L08', 'typography', 'TY-T04', 'Căn chỉnh các khối chữ', 'Chọn cách căn lề giúp các khối chữ liên kết với nhau.'),
  L('TY-L09', 'typography', 'TY-T04', 'Gom nhóm thông tin bằng khoảng cách', 'Dùng khoảng cách để gom các thông tin liên quan thành nhóm.'),
  { id: 'TY-CP01', kind: 'checkpoint', areaId: 'typography', topicId: 'TY-T02', title: 'Thông điệp nào cần được nhìn thấy trước?', objective: 'Chọn kiểu chữ và chỉnh một biến phân cấp cho một thông báo sự kiện.', interactive: true },
  { id: 'TY-CP02', kind: 'checkpoint', areaId: 'typography', topicId: 'TY-T03', title: 'Điều chỉnh nhịp đọc của văn bản', objective: 'Chỉnh leading và chiều dài dòng, so sánh các phương án.', interactive: false },
  { id: 'TY-CH', kind: 'challenge', areaId: 'typography', title: 'Tổ chức một poster thông tin bằng chữ', objective: 'Ra quyết định về typeface, phân cấp, khoảng cách, căn lề và gom nhóm cho một poster sự kiện.', interactive: true },

  // ── AREA 02 — COMPOSITION ──
  L('CO-L01', 'composition', 'CO-T01', 'Sử dụng khoảng trống quanh đối tượng', 'Quan sát khoảng trống ảnh hưởng tới sự chú ý dành cho đối tượng.'),
  L('CO-L02', 'composition', 'CO-T01', 'Tạo cân bằng bằng vị trí và trọng lượng thị giác', 'Cân bằng bố cục bằng vị trí và trọng lượng thị giác.'),
  L('CO-L03', 'composition', 'CO-T02', 'Nhóm các yếu tố bằng khoảng cách', 'Dùng khoảng cách để người xem biết yếu tố nào đi cùng nhau.', true),
  L('CO-L04', 'composition', 'CO-T02', 'Nhóm các yếu tố bằng sự tương đồng', 'Dùng màu, hình, kích thước giống nhau để tạo nhóm.'),
  L('CO-L05', 'composition', 'CO-T02', 'Nhận biết hình và nền (Figure/Ground)', 'Nhận biết quan hệ hình – nền và cách nó thay đổi điều ta nhìn thấy.'),
  L('CO-L06', 'composition', 'CO-T03', 'Điều hướng chú ý bằng vị trí và khoảng trống', 'Đặt đối tượng và khoảng trống để dẫn hướng ánh nhìn.'),
  L('CO-L07', 'composition', 'CO-T03', 'Thay đổi thông điệp bằng cắt cúp hình ảnh', 'Thấy được khung hình thay đổi trọng tâm và ý nghĩa của hình ảnh.'),
  L('CO-L08', 'composition', 'CO-T04', 'Tạo nhịp điệu bằng lặp lại và biến đổi', 'Tạo nhịp điệu thị giác bằng lặp lại có biến đổi.'),
  L('CO-L09', 'composition', 'CO-T04', 'Tổ chức nội dung bằng Grid', 'Dùng grid để tổ chức nội dung nhất quán.'),
  { id: 'CO-CP01', kind: 'checkpoint', areaId: 'composition', topicId: 'CO-T02', title: 'Tổ chức các nhóm thông tin', objective: 'Sắp xếp lại icon và nhãn để tạo các nhóm dễ nhận biết.', interactive: false },
  { id: 'CO-CP02', kind: 'checkpoint', areaId: 'composition', topicId: 'CO-T03', title: 'Chọn khung hình để dẫn hướng chú ý', objective: 'Chỉnh crop và so sánh khung hình thay đổi trọng tâm ra sao.', interactive: false },
  { id: 'CO-CH', kind: 'challenge', areaId: 'composition', title: 'Sắp xếp một thẻ truyền thông có chữ và hình ảnh', objective: 'Tổ chức hình ảnh, tiêu đề, thông tin phụ, khoảng trống và quan hệ tỉ lệ.', interactive: false },

  // ── AREA 03 — COLOR ──
  L('CL-L01', 'color', 'CL-T01', 'Nhận biết các thuộc tính của màu', 'Phân biệt Hue, Saturation và Value trong cùng một bài.'),
  L('CL-L02', 'color', 'CL-T01', 'Cùng một màu, khác nền', 'Quan sát một màu thay đổi cảm nhận khi đặt trên các nền khác nhau.'),
  L('CL-L03', 'color', 'CL-T01', 'Tạo tương phản để nội dung rõ hơn', 'Chọn màu chữ và màu nền có chênh lệch sáng – tối đủ để đọc rõ.', true),
  L('CL-L04', 'color', 'CL-T02', 'Khám phá các quan hệ màu trên vòng màu', 'Khám phá các quan hệ màu như những lựa chọn, không phải công thức.'),
  L('CL-L05', 'color', 'CL-T02', 'Xây dựng bảng màu giới hạn', 'Tạo một bảng màu giới hạn và nhất quán.'),
  L('CL-L06', 'color', 'CL-T03', 'Phân vai màu trong thiết kế', 'Gán vai trò nền, nội dung chính, phụ và nhấn cho màu.'),
  L('CL-L07', 'color', 'CL-T03', 'Lựa chọn màu theo thông điệp', 'Chọn màu dựa trên brief và bối cảnh, không theo quy ước cứng.'),
  { id: 'CL-CP01', kind: 'checkpoint', areaId: 'color', topicId: 'CL-T01', title: 'Chữ có đủ rõ trên nền không?', objective: 'So sánh và chỉnh màu chữ – màu nền của một thẻ thông báo.', interactive: false },
  { id: 'CL-CP02', kind: 'checkpoint', areaId: 'color', topicId: 'CL-T02', title: 'Chọn bảng màu và xác định màu nhấn', objective: 'Chọn bảng màu và gán màu nhấn cho hành động chính.', interactive: false },
  { id: 'CL-CH', kind: 'challenge', areaId: 'color', title: 'Thiết lập màu sắc cho một thẻ thông báo', objective: 'Chọn bảng màu giới hạn và gán màu nền, nội dung chính, phụ và màu nhấn.', interactive: false },
];

export const topics: Topic[] = [
  { id: 'TY-T01', areaId: 'typography', code: 'T01', title: 'Khởi đầu với tương phản chữ', objective: 'Hiểu Scale và Font Weight ảnh hưởng tới điểm nhấn và phân cấp thông tin.', lessonIds: ['TY-L01', 'TY-L02'] },
  { id: 'TY-T02', areaId: 'typography', code: 'T02', title: 'Chọn chữ theo ngữ cảnh', objective: 'Chọn typeface theo thông điệp, khả năng đọc và hỗ trợ tiếng Việt.', lessonIds: ['TY-L03', 'TY-L04'], checkpointId: 'TY-CP01' },
  { id: 'TY-T03', areaId: 'typography', code: 'T03', title: 'Khoảng cách và dòng chữ', objective: 'Hiểu Tracking, Leading và Line Length ảnh hưởng tới trải nghiệm đọc.', lessonIds: ['TY-L05', 'TY-L06', 'TY-L07'], checkpointId: 'TY-CP02' },
  { id: 'TY-T04', areaId: 'typography', code: 'T04', title: 'Tổ chức chữ trong bố cục', objective: 'Tổ chức thông tin chữ bằng căn lề, khoảng cách và phân cấp.', lessonIds: ['TY-L08', 'TY-L09'] },

  { id: 'CO-T01', areaId: 'composition', code: 'T01', title: 'Cân bằng và khoảng trống', objective: 'Hiểu ảnh hưởng của khoảng trống, vị trí và trọng lượng thị giác.', lessonIds: ['CO-L01', 'CO-L02'] },
  { id: 'CO-T02', areaId: 'composition', code: 'T02', title: 'Nhóm và phân biệt các yếu tố', objective: 'Hiểu cách nhóm và tách nhiều yếu tố thị giác.', lessonIds: ['CO-L03', 'CO-L04', 'CO-L05'], checkpointId: 'CO-CP01' },
  { id: 'CO-T03', areaId: 'composition', code: 'T03', title: 'Khung hình và hướng chú ý', objective: 'Hiểu vị trí, khung hình và cắt cúp ảnh hưởng tới điểm nhấn và ý nghĩa.', lessonIds: ['CO-L06', 'CO-L07'], checkpointId: 'CO-CP02' },
  { id: 'CO-T04', areaId: 'composition', code: 'T04', title: 'Nhịp điệu và cấu trúc bố cục', objective: 'Dùng lặp lại, biến đổi và grid để tổ chức nội dung.', lessonIds: ['CO-L08', 'CO-L09'] },

  { id: 'CL-T01', areaId: 'color', code: 'T01', title: 'Khám phá màu và tương phản', objective: 'Hiểu Hue, Saturation, Value; quan sát cảm nhận màu theo ngữ cảnh; ra quyết định cơ bản về độ rõ.', lessonIds: ['CL-L01', 'CL-L02', 'CL-L03'], checkpointId: 'CL-CP01' },
  { id: 'CL-T02', areaId: 'color', code: 'T02', title: 'Xây dựng bảng màu', objective: 'Khám phá quan hệ màu như công cụ thiết kế và tạo bảng màu giới hạn nhất quán.', lessonIds: ['CL-L04', 'CL-L05'], checkpointId: 'CL-CP02' },
  { id: 'CL-T03', areaId: 'color', code: 'T03', title: 'Sử dụng màu theo bối cảnh', objective: 'Chọn và phân vai màu dựa trên brief, phân cấp thông tin và bối cảnh.', lessonIds: ['CL-L06', 'CL-L07'] },
];

export const areas: Area[] = [
  { id: 'typography', index: '01', name: 'Typography', tagline: 'Chữ có tiếng nói', description: 'Làm chữ rõ ràng, có phân cấp và phù hợp với thông điệp.', topicIds: ['TY-T01', 'TY-T02', 'TY-T03', 'TY-T04'], challengeId: 'TY-CH' },
  { id: 'composition', index: '02', name: 'Composition', tagline: 'Sắp xếp để dẫn mắt', description: 'Tổ chức yếu tố thị giác bằng khoảng trống, nhóm, khung hình và grid.', topicIds: ['CO-T01', 'CO-T02', 'CO-T03', 'CO-T04'], challengeId: 'CO-CH' },
  { id: 'color', index: '03', name: 'Color', tagline: 'Màu có vai trò', description: 'Dùng màu có chủ đích: tương phản, bảng màu giới hạn và vai trò theo bối cảnh.', topicIds: ['CL-T01', 'CL-T02', 'CL-T03'], challengeId: 'CL-CH' },
];

export const STAGE = {
  index: '01',
  name: 'Foundation',
  description: 'Nền tảng nguyên lý thiết kế đồ hoạ. Bản mẫu này giới thiệu 3 Area đầu tiên; Foundation sẽ còn được mở rộng.',
};

export const AREA_COLOR: Record<AreaId, string> = {
  typography: 'var(--brand)',
  composition: 'var(--purple)',
  color: 'var(--blue)',
};

const byId = new Map(activities.map((a) => [a.id, a]));
export const getActivity = (id: string) => byId.get(id);
export const getTopic = (id: string) => topics.find((t) => t.id === id);
export const getArea = (id: string) => areas.find((a) => a.id === id);
export const topicsOf = (areaId: AreaId) => topics.filter((t) => t.areaId === areaId);
export const allLessons = activities.filter((a) => a.kind === 'lesson');

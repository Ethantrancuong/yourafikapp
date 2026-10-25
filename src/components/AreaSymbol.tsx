// Area symbols — đề xuất V1 (cần duyệt, tác giả sẽ custom sau).
// Mỗi Topic = 1 mảnh có vị trí cố định; mảnh chưa hoàn thành hiển thị viền nét đứt.
// Solid fill, path tối giản, không gradient/texture/opacity (Brief §04).
import { AREA_COLOR, getArea, type AreaId } from '../data/curriculum';

const sector = (i: number, n: number, r = 92, gap = 4) => {
  const a0 = -90 + (i * 360) / n;
  const a1 = a0 + 360 / n;
  const mid = ((a0 + a1) / 2) * (Math.PI / 180);
  const cx = 100 + gap * Math.cos(mid);
  const cy = 100 + gap * Math.sin(mid);
  const p = (deg: number) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)].map((v) => v.toFixed(2)).join(' ');
  return `M${cx.toFixed(2)} ${cy.toFixed(2)} L${p(a0)} A${r} ${r} 0 0 1 ${p(a1)} Z`;
};

export const PIECES: Record<AreaId, string[]> = {
  // Typography — khối 2×2: vòm · bậc thang · thoi · tab
  typography: [
    'M8 96 V52 A44 44 0 0 1 96 52 V96 Z',
    'M104 96 V68 H132 V40 H162 V8 H184 A8 8 0 0 1 192 16 V96 Z',
    'M46 110 Q52 104 58 110 L90 142 Q96 148 90 154 L58 186 Q52 192 46 186 L14 154 Q8 148 14 142 Z',
    'M112 104 H184 A8 8 0 0 1 192 112 V152 A8 8 0 0 1 184 160 H124 V184 A8 8 0 0 1 116 192 H112 A8 8 0 0 1 104 184 V112 A8 8 0 0 1 112 104 Z',
  ],
  // Composition — cỏ bốn lá: mỗi lá một Topic
  composition: [
    'M97 97 H57 A40 40 0 1 1 97 57 Z',
    'M103 97 V57 A40 40 0 1 1 143 97 Z',
    'M103 103 H143 A40 40 0 1 1 103 143 Z',
    'M97 103 V143 A40 40 0 1 1 57 103 Z',
  ],
  // Color — hình tròn 3 cung
  color: [sector(0, 3), sector(1, 3), sector(2, 3)],
};

interface Props {
  areaId: AreaId;
  filled: string[]; // topicIds đã gắn
  size?: number;
  hidden?: string[]; // mảnh đang bay (ẩn ở vị trí đích)
  label?: string;
  pieceRef?: (topicId: string, el: SVGPathElement | null) => void;
}

export function AreaSymbol({ areaId, filled, size = 200, hidden = [], label, pieceRef }: Props) {
  const area = getArea(areaId)!;
  const color = AREA_COLOR[areaId];
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" role="img" aria-label={label ?? `Biểu tượng ${area.name}: ${filled.length}/${area.topicIds.length} mảnh`} style={{ overflow: 'visible' }}>
      {area.topicIds.map((tid, i) => {
        const on = filled.includes(tid) && !hidden.includes(tid);
        return (
          <path
            key={tid}
            data-piece={tid}
            ref={(el) => pieceRef?.(tid, el)}
            d={PIECES[areaId][i]}
            className={on ? undefined : 'symbol-slot'}
            fill={on ? color : 'none'}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}

/** Mảnh rời (dùng khi bay vào vị trí). */
export function PieceShape({ areaId, index, size = 200 }: { areaId: AreaId; index: number; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden="true" style={{ overflow: 'visible' }}>
      <path d={PIECES[areaId][index]} fill={AREA_COLOR[areaId]} />
    </svg>
  );
}

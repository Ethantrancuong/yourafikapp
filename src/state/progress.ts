// Tiến độ học tập — lưu trên thiết bị (localStorage).
// Mọi đọc/ghi đi qua `repository` để sau này thay bằng backend đồng bộ mà không sửa UI.
import { useSyncExternalStore } from 'react';
import { activities, areas, getActivity, getArea, getTopic, topics, type AreaId } from '../data/curriculum';

export type LessonStatus = 'not_started' | 'in_progress' | 'completed';

export interface ActivityRecord {
  status: LessonStatus;
  attempts: number; // số lần xem phản hồi
  updatedAt: number;
  demo?: boolean; // hoàn thành bằng chế độ demo
}

export interface Profile {
  goals: string[];
  level?: string;
  difficulty?: string;
  suggestedArea: AreaId;
}

export interface ProgressState {
  version: 1;
  activities: Record<string, ActivityRecord>;
  drafts: Record<string, unknown>;
  topicAssembledAt: Record<string, number>; // Topic Piece đã gắn vào Area
  challengeRevealedAt: Record<string, number>; // Area Challenge đã hiện (satellite)
  stageAssembledAt: Record<string, number>; // Area Piece đã gắn vào Stage
  lastActivityId?: string;
  onboarded: boolean;
  profile?: Profile;
  motion: 'system' | 'reduce';
}

const KEY = 'yourafik.progress.v1';

const empty = (): ProgressState => ({
  version: 1,
  activities: {},
  drafts: {},
  topicAssembledAt: {},
  challengeRevealedAt: {},
  stageAssembledAt: {},
  onboarded: false,
  motion: 'system',
});

const repository = {
  load(): ProgressState {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return empty();
      return { ...empty(), ...JSON.parse(raw) } as ProgressState;
    } catch {
      return empty();
    }
  },
  save(s: ProgressState) {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      /* bộ nhớ đầy hoặc bị chặn — app vẫn chạy trong phiên này */
    }
  },
};

let state: ProgressState = repository.load();
const listeners = new Set<() => void>();

function set(updater: (s: ProgressState) => ProgressState) {
  state = updater(state);
  repository.save(state);
  listeners.forEach((l) => l());
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};
/** Trả về toàn bộ state (tham chiếu ổn định tới khi có thay đổi); tính dẫn xuất trong component. */
export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, () => state);
}
export const getState = () => state;

// Xin trình duyệt giữ dữ liệu lâu dài (giảm rủi ro Safari xoá dữ liệu).
export function requestPersistence() {
  try {
    navigator.storage?.persist?.();
  } catch {
    /* không hỗ trợ */
  }
}

// ───────── Trạng thái dẫn xuất ─────────

export const activityStatus = (s: ProgressState, id: string): LessonStatus => s.activities[id]?.status ?? 'not_started';

export type TopicStatus = 'not_started' | 'in_progress' | 'completed';
export function topicStatus(s: ProgressState, topicId: string): TopicStatus {
  const t = getTopic(topicId);
  if (!t) return 'not_started';
  const st = t.lessonIds.map((id) => activityStatus(s, id));
  if (st.every((x) => x === 'completed')) return 'completed';
  if (st.some((x) => x !== 'not_started')) return 'in_progress';
  return 'not_started';
}

export type CheckpointStatus = 'suggested_later' | 'available' | 'practiced';
export function checkpointStatus(s: ProgressState, cpId: string): CheckpointStatus {
  if (activityStatus(s, cpId) === 'completed') return 'practiced';
  const cp = getActivity(cpId);
  if (cp?.topicId && topicStatus(s, cp.topicId) === 'completed') return 'available';
  return 'suggested_later';
}

export type AreaStatus = 'not_started' | 'in_progress' | 'topics_completed' | 'completed';
export function areaStatus(s: ProgressState, areaId: AreaId): AreaStatus {
  const a = getArea(areaId)!;
  if (activityStatus(s, a.challengeId) === 'completed') return 'completed';
  const ts = a.topicIds.map((t) => topicStatus(s, t));
  if (ts.every((x) => x === 'completed')) return 'topics_completed';
  const touched = activities.some((x) => x.areaId === areaId && activityStatus(s, x.id) !== 'not_started');
  return touched ? 'in_progress' : 'not_started';
}

export function lessonCounts(s: ProgressState, areaId?: AreaId) {
  const ls = activities.filter((a) => a.kind === 'lesson' && (!areaId || a.areaId === areaId));
  return { done: ls.filter((a) => activityStatus(s, a.id) === 'completed').length, total: ls.length };
}

/** Topic đã hoàn thành nhưng chưa chạy animation gắn mảnh. */
export const pendingTopicAssembly = (s: ProgressState, areaId: AreaId) =>
  topics.filter((t) => t.areaId === areaId && topicStatus(s, t.id) === 'completed' && !s.topicAssembledAt[t.id]).map((t) => t.id);

export const pendingStageAssembly = (s: ProgressState) =>
  areas.filter((a) => areaStatus(s, a.id) === 'completed' && !s.stageAssembledAt[a.id]).map((a) => a.id);

/** Gợi ý hoạt động tiếp theo cho thẻ "Tiếp tục học". */
export function nextActivity(s: ProgressState) {
  const last = s.lastActivityId ? getActivity(s.lastActivityId) : undefined;
  if (last && activityStatus(s, last.id) !== 'completed') return last;
  const order: AreaId[] = s.profile?.suggestedArea
    ? [s.profile.suggestedArea, ...(['typography', 'composition', 'color'] as AreaId[]).filter((x) => x !== s.profile!.suggestedArea)]
    : ['typography', 'composition', 'color'];
  for (const areaId of order) {
    const a = getArea(areaId)!;
    for (const tid of a.topicIds) {
      const t = getTopic(tid)!;
      const l = t.lessonIds.map(getActivity).find((x) => x && x.interactive && activityStatus(s, x.id) !== 'completed');
      if (l) return l;
    }
    if (areaStatus(s, areaId) === 'topics_completed') return getActivity(a.challengeId);
  }
  return activities.find((a) => a.kind === 'lesson' && activityStatus(s, a.id) !== 'completed');
}

// ───────── Hành động ─────────

const now = () => Date.now();

export const actions = {
  open(id: string) {
    set((s) => {
      const rec = s.activities[id];
      return {
        ...s,
        lastActivityId: id,
        activities: rec ? s.activities : { ...s.activities, [id]: { status: 'in_progress', attempts: 0, updatedAt: now() } },
      };
    });
  },
  /** Gọi khi người học xem phản hồi — hoạt động được tính là hoàn thành (Brief §14). */
  feedbackViewed(id: string) {
    set((s) => {
      const rec = s.activities[id] ?? { status: 'in_progress', attempts: 0, updatedAt: now() };
      const isChallenge = getActivity(id)?.kind === 'challenge';
      // Challenge chỉ hoàn thành khi người học bấm "Hoàn tất" (để còn chỉnh lại).
      return {
        ...s,
        activities: { ...s.activities, [id]: { ...rec, attempts: rec.attempts + 1, status: isChallenge ? rec.status : 'completed', updatedAt: now() } },
      };
    });
  },
  completeChallenge(id: string) {
    set((s) => ({
      ...s,
      activities: { ...s.activities, [id]: { ...(s.activities[id] ?? { attempts: 1 }), status: 'completed', updatedAt: now() } as ActivityRecord },
    }));
  },
  saveDraft(id: string, draft: unknown) {
    set((s) => ({ ...s, drafts: { ...s.drafts, [id]: draft } }));
  },
  clearDraft(id: string) {
    set((s) => {
      const d = { ...s.drafts };
      delete d[id];
      return { ...s, drafts: d };
    });
  },
  markTopicAssembled(topicId: string) {
    set((s) => ({ ...s, topicAssembledAt: { ...s.topicAssembledAt, [topicId]: now() } }));
  },
  markChallengeRevealed(areaId: string) {
    set((s) => ({ ...s, challengeRevealedAt: { ...s.challengeRevealedAt, [areaId]: now() } }));
  },
  markStageAssembled(areaId: string) {
    set((s) => ({ ...s, stageAssembledAt: { ...s.stageAssembledAt, [areaId]: now() } }));
  },
  finishOnboarding(profile?: Profile) {
    set((s) => ({ ...s, onboarded: true, profile: profile ?? s.profile }));
  },
  replayOnboarding() {
    set((s) => ({ ...s, onboarded: false }));
  },
  setMotion(motion: ProgressState['motion']) {
    set((s) => ({ ...s, motion }));
  },

  // ── Chế độ demo (Cài đặt) ──
  demoCompleteTopic(topicId: string) {
    const t = getTopic(topicId);
    if (!t) return;
    set((s) => {
      const acts = { ...s.activities };
      t.lessonIds.forEach((id) => {
        if (acts[id]?.status !== 'completed') acts[id] = { status: 'completed', attempts: acts[id]?.attempts ?? 0, updatedAt: now(), demo: true };
      });
      return { ...s, activities: acts };
    });
  },
  demoCompleteChallenge(areaId: AreaId) {
    const a = getArea(areaId)!;
    set((s) => ({ ...s, activities: { ...s.activities, [a.challengeId]: { status: 'completed', attempts: 0, updatedAt: now(), demo: true } } }));
  },
  resetArea(areaId: AreaId) {
    set((s) => {
      const acts = { ...s.activities };
      const drafts = { ...s.drafts };
      activities.filter((a) => a.areaId === areaId).forEach((a) => {
        delete acts[a.id];
        delete drafts[a.id];
      });
      const ta = { ...s.topicAssembledAt };
      topics.filter((t) => t.areaId === areaId).forEach((t) => delete ta[t.id]);
      const cr = { ...s.challengeRevealedAt };
      delete cr[areaId];
      const sa = { ...s.stageAssembledAt };
      delete sa[areaId];
      return { ...s, activities: acts, drafts, topicAssembledAt: ta, challengeRevealedAt: cr, stageAssembledAt: sa };
    });
  },
  resetAll() {
    set((s) => ({ ...empty(), onboarded: s.onboarded, profile: s.profile, motion: s.motion }));
  },

  // ── Sao lưu thủ công ──
  exportCode(): string {
    const json = JSON.stringify(state);
    return btoa(unescape(encodeURIComponent(json)));
  },
  importCode(code: string): boolean {
    try {
      const json = decodeURIComponent(escape(atob(code.trim())));
      const parsed = JSON.parse(json);
      if (parsed?.version !== 1 || typeof parsed.activities !== 'object') return false;
      set(() => ({ ...empty(), ...parsed }));
      return true;
    } catch {
      return false;
    }
  },
};

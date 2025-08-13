import { ph25Spec } from "@/spec/ph25Spec";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type StageKey = "stage1" | "stage2" | "stage3";

export type CaseState = {
  meta: Record<string, any>;
  stage1: Record<string, any>;
  stage2: Record<string, any>;
  stage3: Record<string, any>;
  report: Record<string, any>;
  hourlyRate: number;
};

export type CaseStore = CaseState & {
  updateField: (path: string, value: any) => void;
  bulkSet: (partial: Partial<CaseState>) => void;
  importJSON: (data: any) => void;
  exportJSON: () => string;
  validateRequired: () => { ok: boolean; missing: string[] };
  getStageProgress: (stage: StageKey) => "Not Started" | "In Progress" | "Complete";
};

function getByPath(obj: any, path: string) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}
function setByPath(obj: any, path: string, value: any) {
  const keys = path.split(".");
  const last = keys.pop()!;
  const target = keys.reduce((acc, key) => {
    if (acc[key] == null || typeof acc[key] !== "object") acc[key] = {};
    return acc[key];
  }, obj);
  target[last] = value;
}

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function isEmpty(val: any) {
  if (val == null) return true;
  if (Array.isArray(val)) return val.length === 0;
  if (typeof val === "object") return Object.keys(val).length === 0;
  return String(val).trim() === "";
}

const initial: CaseState = {
  meta: deepClone(ph25Spec.report_template.initial_state.meta),
  stage1: deepClone(ph25Spec.report_template.initial_state.stage1),
  stage2: deepClone(ph25Spec.report_template.initial_state.stage2),
  stage3: deepClone(ph25Spec.report_template.initial_state.stage3),
  report: deepClone(ph25Spec.report_template.initial_state.report),
  hourlyRate: ph25Spec.home.hourly_rate_default_eur,
};

function applyPrepopulateRules(state: CaseState, changedPath: string) {
  // Sync meta from stage1 for any configured meta key
  if (changedPath.startsWith("stage1.")) {
    const key = changedPath.replace("stage1.", "");
    if (ph25Spec.meta_keys.includes(key as any)) {
      state.meta[key] = getByPath(state, changedPath);
    }
  }

  // Execute declared rules
  ;(ph25Spec.prepopulate_rules as unknown as any[]).forEach((rule: any) => {
    if (rule.from === changedPath) {
      rule.to.forEach((toPath: string) => {
        if (rule.condition === "use if stage3.mse empty") {
          const stage3mse = state.stage3?.mse;
          if (Array.isArray(stage3mse) && stage3mse.length > 0) return;
        }
        const value = deepClone(getByPath(state, rule.from));
        setByPath(state as any, toPath, value);
      });
    }
  });
}

export const useCaseStore = create<CaseStore>()(
  persist(
    (set, get) => ({
      ...initial,
      updateField: (path, value) => {
        set((prev) => {
          const next = deepClone(prev);
          setByPath(next, path, value);
          applyPrepopulateRules(next, path);
          return next;
        });
      },
      bulkSet: (partial) => set((prev) => ({ ...prev, ...partial })),
      importJSON: (data) => {
        // Basic shape guard
        if (!data || typeof data !== "object") return;
        const next: CaseState = {
          meta: data.meta ?? {},
          stage1: data.stage1 ?? {},
          stage2: data.stage2 ?? {},
          stage3: data.stage3 ?? {},
          report: data.report ?? {},
          hourlyRate: data.hourlyRate ?? ph25Spec.home.hourly_rate_default_eur,
        };
        // Ensure prepopulation after import
        ph25Spec.meta_keys.forEach((k) => {
          if (next.stage1 && k in next.stage1) next.meta[k] = next.stage1[k];
        });
        set(next);
      },
      exportJSON: () => {
        const { meta, stage1, stage2, stage3, report, hourlyRate } = get();
        return JSON.stringify({ meta, stage1, stage2, stage3, report, hourlyRate }, null, 2);
      },
      validateRequired: () => {
        const { meta, stage1 } = get();
        const missing: string[] = [];
        ph25Spec.validation.required.forEach((key) => {
          const val = meta[key] ?? stage1[key];
          if (isEmpty(val)) missing.push(key);
        });
        return { ok: missing.length === 0, missing };
      },
      getStageProgress: (_stage) => {
        const { meta, stage1 } = get();
        const required = ph25Spec.validation.required;
        const values = required.map((k) => meta[k] ?? stage1[k]).filter((v) => !isEmpty(v));
        if (values.length === 0) return "Not Started";
        if (values.length < required.length) return "In Progress";
        return "Complete";
      },
    }),
    {
      name: ph25Spec.app.storage_key,
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (s) => ({
        meta: s.meta,
        stage1: s.stage1,
        stage2: s.stage2,
        stage3: s.stage3,
        report: s.report,
        hourlyRate: s.hourlyRate,
      }),
    }
  )
);

export const appName = ph25Spec.app.name;

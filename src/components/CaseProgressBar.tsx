import { memo, useMemo } from "react";
import { useCaseStore } from "@/store/useCaseStore";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

function isNonEmptyObject(obj: any) {
  return obj && typeof obj === "object" && Object.keys(obj).length > 0;
}

const Segment = memo(function Segment({ active, ariaLabel }: { active: boolean; ariaLabel: string }) {
  return (
    <div
      className={cn(
        "h-2 rounded-sm transition-colors",
        active ? "bg-primary" : "bg-muted"
      )}
      role="img"
      aria-label={ariaLabel}
    />
  );
});

export default function CaseProgressBar() {
  const getStageProgress = useCaseStore((s) => s.getStageProgress);
  const stage2 = useCaseStore((s) => s.stage2);
  const stage3 = useCaseStore((s) => s.stage3);

  const s1Complete = getStageProgress("stage1") === "Complete"; // strict
  const s2Complete = isNonEmptyObject(stage2);
  const s3Complete = isNonEmptyObject(stage3);

  const allComplete = useMemo(() => s1Complete && s2Complete && s3Complete, [s1Complete, s2Complete, s3Complete]);

  return (
    <div
      className={cn(
        "relative w-full rounded-md border border-border bg-card p-1",
        allComplete && "ring-1 ring-primary/30"
      )}
      role="region"
      aria-label={`Stage 1 ${s1Complete ? "complete" : "incomplete"}, Stage 2 ${s2Complete ? "complete" : "incomplete"}, Stage 3 ${s3Complete ? "complete" : "incomplete"}`}
    >
      <div className="grid grid-cols-3 gap-1">
        <Segment active={s1Complete} ariaLabel="Stage 1" />
        <Segment active={s2Complete} ariaLabel="Stage 2" />
        <Segment active={s3Complete} ariaLabel="Stage 3" />
      </div>
      {allComplete && (
        <div className="absolute -top-2 right-1.5" aria-hidden>
          <Check className="h-3.5 w-3.5 text-primary" />
        </div>
      )}
      <span className="sr-only" aria-live="polite">
        {allComplete ? "Case ready for report review" : "Case in progress"}
      </span>
    </div>
  );
}

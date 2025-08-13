import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FormRenderer } from "@/components/FormRenderer";
import { ph25Spec } from "@/spec/ph25Spec";
import { useCaseStore } from "@/store/useCaseStore";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

function useImportExport() {
  const exportJSON = useCaseStore((s) => s.exportJSON);
  const importJSON = useCaseStore((s) => s.importJSON);
  const fileRef = useRef<HTMLInputElement>(null);

  const doExport = () => {
    const data = exportJSON();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ph25_case.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = () => fileRef.current?.click();

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(String(reader.result));
        importJSON(obj);
        toast({ title: "Imported", description: "JSON imported successfully" });
      } catch {
        toast({ title: "Invalid file", description: "Could not parse JSON" });
      }
    };
    reader.readAsText(file);
  };

  return { doExport, doImport, fileRef, onFile };
}

export default function Stage3() {
  const navigate = useNavigate();
  const { doExport, doImport, fileRef, onFile } = useImportExport();
  const validateRequired = useCaseStore((s) => s.validateRequired);

  useEffect(() => {
    document.title = "PrimaHealth ADHD Assessment (PH25) – Stage 3";
  }, []);

  return (
    <div className="grid gap-6">
      <h1 className="text-xl font-semibold">{ph25Spec.stages.stage3.title}</h1>
      <FormRenderer stageKey="stage3" sections={ph25Spec.stages.stage3.sections as any} />
      <div className="flex flex-wrap gap-3 pt-2">
        <Button onClick={() => toast({ description: "Saved" })}>Save</Button>
        <Button
          variant="secondary"
          onClick={() => {
            const res = validateRequired();
            if (!res.ok) {
              toast({
                title: "Missing required fields",
                description: res.missing.join(", "),
              });
              return;
            }
            navigate("/report");
          }}
        >
          Next Stage
        </Button>
        <Button variant="outline" onClick={doExport}>Export JSON</Button>
        <Button variant="outline" onClick={doImport}>Import JSON</Button>
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={onFile} />
      </div>
    </div>
  );
}

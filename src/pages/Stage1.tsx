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

export default function Stage1() {
  const navigate = useNavigate();
  const { doExport, doImport, fileRef, onFile } = useImportExport();
  const validateRequired = useCaseStore((s) => s.validateRequired);

  useEffect(() => {
    const title = "PrimaHealth ADHD Assessment (PH25) – Stage 1";
    document.title = title;

    const ensureMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    ensureMeta(
      "description",
      "Stage 1 intake: capture family, medical and background details with transcription and auto-populate."
    );

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;
  }, []);

  return (
    <div className="max-w-4xl mx-auto my-5">
      <div className="form-container">
        <h1 className="text-center text-foreground mb-5 text-2xl font-medium">{ph25Spec.stages.stage1.title}</h1>
      </div>
      
      <FormRenderer stageKey="stage1" sections={ph25Spec.stages.stage1.sections as any} />
      
      <div className="form-container mt-5">
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
              navigate("/stage2");
            }}
          >
            Next Stage
          </Button>
          <Button variant="outline" onClick={doExport}>Export JSON</Button>
          <Button variant="outline" onClick={doImport}>Import JSON</Button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={onFile} />
        </div>
      </div>
    </div>
  );
}

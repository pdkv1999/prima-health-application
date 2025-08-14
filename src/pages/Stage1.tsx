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
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light tracking-tight text-slate-800 mb-2">{ph25Spec.stages.stage1.title}</h1>
        <p className="text-slate-600 font-light">Initial Assessment and Patient Information</p>
      </div>
      
      <div className="report-glass p-8 mb-8">
        <FormRenderer stageKey="stage1" sections={ph25Spec.stages.stage1.sections as any} />
      </div>
      
      <div className="flex flex-wrap justify-center gap-4">
        <Button 
          onClick={() => toast({ description: "Saved" })}
          className="glass-button text-slate-700 font-medium px-6 py-3"
        >
          Save
        </Button>
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
    toast({
      title: "Saved",
      description: "Stage 1 completed. Report updated.",
    });
    navigate("/stage2");
          }}
          className="glass-button text-slate-700 font-medium px-6 py-3"
        >
          Next Stage
        </Button>
        <Button 
          variant="outline" 
          onClick={doExport}
          className="glass-button text-slate-700 font-medium px-6 py-3"
        >
          Export JSON
        </Button>
        <Button 
          variant="outline" 
          onClick={doImport}
          className="glass-button text-slate-700 font-medium px-6 py-3"
        >
          Import JSON
        </Button>
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={onFile} />
      </div>
    </div>
  );
}

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FormRenderer } from "@/components/FormRenderer";
import { ph25Spec } from "@/spec/ph25Spec";
import { useCaseStore } from "@/store/useCaseStore";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import StageTranscriptionPanel from "@/components/StageTranscriptionPanel";

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

export default function Stage2() {
  const navigate = useNavigate();
  const { doExport, doImport, fileRef, onFile } = useImportExport();
  const validateRequired = useCaseStore((s) => s.validateRequired);

  const handleNavigateToField = (stage: string, fieldId: string) => {
    // Focus on the specific field
    const fieldElement = document.querySelector(`[name="${stage}.${fieldId}"]`) as HTMLElement;
    if (fieldElement) {
      fieldElement.focus();
      fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    document.title = "PrimaHealth ADHD Assessment (PH25) – Stage 2";
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light tracking-tight text-slate-800 mb-2">{ph25Spec.stages.stage2.title}</h1>
        <p className="text-slate-600 font-light">DSM-5 Assessment and Behavioral Analysis</p>
      </div>
      
      <StageTranscriptionPanel 
        stage="stage2" 
        stageTitle="Stage 2" 
        onNavigateToField={handleNavigateToField}
      />
      
      <div className="report-glass p-8 mb-8">
        <FormRenderer stageKey="stage2" sections={ph25Spec.stages.stage2.sections as any} />
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
            navigate("/stage3");
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

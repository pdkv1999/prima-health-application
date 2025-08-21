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

export default function Stage3() {
  const navigate = useNavigate();
  const { doExport, doImport, fileRef, onFile } = useImportExport();
  const validateRequired = useCaseStore((s) => s.validateRequired);

  const handleNavigateToField = (stage: string, fieldId: string) => {
    console.log('Navigating to field:', { stage, fieldId });
    
    // First try to find it as a form field
    const fieldSelectors = [
      `input[data-field-id="${fieldId}"]`,
      `textarea[data-field-id="${fieldId}"]`,
      `select[data-field-id="${fieldId}"]`,
      `table[data-field-id="${fieldId}"]`, // For table fields like MSE
      `div[data-field-id="${fieldId}"]`,   // For other complex fields
    ];
    
    let fieldElement: HTMLElement | null = null;
    
    // Try to find the field element
    for (const selector of fieldSelectors) {
      fieldElement = document.querySelector(selector) as HTMLElement;
      console.log(`Field selector "${selector}":`, fieldElement ? 'FOUND' : 'NOT FOUND');
      if (fieldElement) break;
    }
    
    // If not found as a field, try to find it as a section heading
    if (!fieldElement) {
      console.log('Field not found, looking for section headings...');
      
      // Since CSS doesn't support :contains(), we'll search text content manually
      const allHeadings = document.querySelectorAll('h2, h3, h4, h5, h6, .section-title, [class*="title"]');
      console.log('Searching through headings:', allHeadings.length);
      
      for (const heading of allHeadings) {
        const text = heading.textContent?.toLowerCase() || '';
        console.log('Checking heading:', text);
        
        // Check for exact matches and related terms
        if (text.includes(fieldId.toLowerCase()) || 
            (fieldId === 'mse' && text.includes('mental state')) ||
            (fieldId === 'mse' && text.includes('examination'))) {
          console.log('Found matching section heading:', text);
          fieldElement = heading as HTMLElement;
          break;
        }
      }
    }
    
    // Also try partial matches in data-field-id
    if (!fieldElement) {
      console.log('Still not found, trying partial matches...');
      const partialMatch = document.querySelector(`[data-field-id*="${fieldId}"]`) as HTMLElement;
      if (partialMatch) {
        console.log('Found partial match:', partialMatch.getAttribute('data-field-id'));
        fieldElement = partialMatch;
      }
    }
    
    if (fieldElement) {
      console.log('Found element, focusing and scrolling');
      fieldElement.focus();
      fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add visual highlight
      fieldElement.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.5)';
      fieldElement.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
      setTimeout(() => {
        fieldElement!.style.boxShadow = '';
        fieldElement!.style.backgroundColor = '';
      }, 3000);
    } else {
      console.warn(`Field or section "${fieldId}" not found for navigation`);
      // Log available options for debugging
      const allFieldIds = Array.from(document.querySelectorAll('[data-field-id]'))
        .map(el => el.getAttribute('data-field-id'));
      console.log('Available field IDs:', allFieldIds);
    }
  };

  useEffect(() => {
    document.title = "PrimaHealth ADHD Assessment (PH25) – Stage 3";
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light tracking-tight text-slate-800 mb-2">{ph25Spec.stages.stage3.title}</h1>
        <p className="text-slate-600 font-light">Final Consultation and Clinical Observations</p>
      </div>
      
      <StageTranscriptionPanel 
        stage="stage3" 
        stageTitle="Stage 3" 
        onNavigateToField={handleNavigateToField}
      />
      
      <div className="report-glass p-8 mb-8">
        <FormRenderer stageKey="stage3" sections={ph25Spec.stages.stage3.sections as any} />
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
            navigate("/report");
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

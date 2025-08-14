import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useCaseStore } from "@/store/useCaseStore";

import { VoiceInputButton } from "@/components/VoiceInputButton";

// Helpers for voice input visibility and prepopulation
// Voice input allowlist: includes all long-form fields from medications section onward in Stage 1
const voiceAllowlist: Record<"stage1" | "stage2" | "stage3", string[]> = {
  stage1: [
    "referralBackground", 
    "medicalHistory", 
    "medications", 
    "surgicalHistory", 
    "allergies", 
    "forensicHistory", 
    "substanceHistory",
    "householdComposition",
    "otherFamilyDetails", 
    "familyMedicalHistory", 
    "familyMentalHealth", 
    "familyLearningDifficulties",
    "antenatalDetails", 
    "deliveryDetails", 
    "postpartumDetails", 
    "developmentalMilestones",
    "additionalNotes",
    "otherDetails"
  ],
  stage2: [
    "previous_reminders", 
    "intro_notes", 
    "mental_state_notes", 
    "other_difficulties", 
    "comorbidities", 
    "other_notes", 
    "ot_details", 
    "slt_details", 
    "cognitive_details", 
    "other_details", 
    "other_details_ns", 
    "careManager_reminders", 
    "personal_info", 
    "additional_notes"
  ],
  stage3: [
    "additional_doctors", 
    "mental_state_details", 
    "other_diagnosis", 
    "criteria_details", 
    "aftercare_details", 
    "recommendations", 
    "additional_notes_final",
    "med_other_details",  // Further Medical Investigations -> Other (add details)
    "allied_details"      // Allied Details
  ],
};
const shouldShowVoice = (stage: "stage1" | "stage2" | "stage3", key: string, type?: string) => {
  if (type === "textarea" && voiceAllowlist[stage]?.includes(key)) {
    return true;
  }
  // Handle criteria9 notes fields (e.g., "inattention.0.notes", "hyperimpulsivity.0.notes")
  if (type === "textarea" && key.includes(".") && key.endsWith(".notes")) {
    return true;
  }
  // Handle table notes columns
  if (type === "textarea" && (key.includes("notes") || key.endsWith(".notes"))) {
    return true;
  }
  return false;
};
const isEmptyVal = (val: any) => {
  if (val == null) return true;
  if (typeof val === "string") return val.trim() === "";
  if (Array.isArray(val)) return val.length === 0;
  if (typeof val === "object") return Object.keys(val).length === 0;
  return false;
};
const getByPath = (obj: any, path: string) => path.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), obj);


export type Section = { title: string; fields: any[] };

type Props = {
  stageKey: "stage1" | "stage2" | "stage3";
  sections: Section[];
};

export function FormRenderer({ stageKey, sections }: Props) {
  const state = useCaseStore((s) => s[stageKey]);
  const updateField = useCaseStore((s) => s.updateField);

  function getVal(key: string) {
    return state?.[key];
  }

  function setVal(key: string, value: any) {
    updateField(`${stageKey}.${key}`, value);
  }

  // Process sections safely
  const sectionsSafe = React.useMemo(
    () => (sections || []).filter((s) => Array.isArray(s.fields) && s.fields.length > 0),
    [sections]
  );

  // Prepopulate defaults from other stages when fields are empty
  React.useEffect(() => {
    const store = useCaseStore.getState();
    sectionsSafe.forEach((section) => {
      (section.fields || []).forEach((f: any) => {
        if (f && f.default_from) {
          const current = getVal(f.key);
          if (isEmptyVal(current)) {
            const src = getByPath(store, f.default_from);
            if (!isEmptyVal(src)) {
              updateField(`${stageKey}.${f.key}`, src);
            }
          }
        }
      });
    });
  }, [sectionsSafe, stageKey, updateField]);

  function renderSimpleField(field: any) {
    const v = getVal(field.key);
    switch (field.type) {
      case "text":
        return (
          <>
            <Input
              value={v ?? ""}
              type="text"
              onChange={(e) => setVal(field.key, e.currentTarget.value)}
            />
            {shouldShowVoice(stageKey, field.key, field.type) && (
              <VoiceInputButton onResult={(t) => setVal(field.key, t)} />
            )}
          </>
        );
      case "tel":
        return (
          <Input
            value={v ?? ""}
            type="tel"
            onChange={(e) => setVal(field.key, e.currentTarget.value)}
          />
        );
      case "date":
      case "time":
        return (
          <Input
            value={v ?? ""}
            type={field.type}
            onChange={(e) => setVal(field.key, e.currentTarget.value)}
          />
        );
      case "textarea":
        return (
          <>
            <Textarea value={v ?? ""} onChange={(e) => setVal(field.key, e.currentTarget.value)} />
            {shouldShowVoice(stageKey, field.key, field.type) && (
              <VoiceInputButton onResult={(t) => setVal(field.key, t)} />
            )}
          </>
        );
      case "select": {
        const value = v === "" || v == null ? undefined : String(v);
        const options: string[] = (field.options || []).filter((opt: any) => opt !== "" && opt != null);
        return (
          <Select value={value} onValueChange={(val) => setVal(field.key, val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-popover">
              {options.map((opt: string) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
      case "checkbox":
        return (
          <div className="flex items-center gap-2">
            <Checkbox checked={!!v} onCheckedChange={(val) => setVal(field.key, !!val)} />
            <Label>{field.label}</Label>
          </div>
        );
      case "checkboxes": {
        const arr: string[] = Array.isArray(v) ? v : [];
        return (
          <div className="checkbox-group">
            {(field.options || []).map((opt: string) => {
              const checked = arr.includes(opt);
              return (
                <label key={opt} className="flex items-center gap-2 font-normal text-sm">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(val) => {
                      const next = new Set(arr);
                      if (val) next.add(opt);
                      else next.delete(opt);
                      setVal(field.key, Array.from(next));
                    }}
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
        );
      }
      case "checkboxes_labeled": {
        const arr: string[] = Array.isArray(v) ? v : [];
        return (
          <div className="grid gap-2">
            {(field.options || []).map((opt: string) => {
              const checked = arr.includes(opt);
              return (
                <label key={opt} className="flex items-center gap-2">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(val) => {
                      const next = new Set(arr);
                      if (val) next.add(opt);
                      else next.delete(opt);
                      setVal(field.key, Array.from(next));
                    }}
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
        );
      }
      case "radio": {
        return (
          <RadioGroup value={v ?? ""} onValueChange={(val) => setVal(field.key, val)} className="radio-group">
            {(field.options || []).map((opt: string) => (
              <div key={opt} className="flex items-center space-x-2">
                <RadioGroupItem id={`${field.key}-${opt}`} value={opt} />
                <Label htmlFor={`${field.key}-${opt}`} className="font-normal text-sm">{opt}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      }
      case "radio_yes_no": {
        const val = typeof v === "boolean" ? (v ? "yes" : "no") : "";
        return (
          <RadioGroup
            value={val}
            onValueChange={(nv) => setVal(field.key, nv === "yes")}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem id={`${field.key}-yes`} value="yes" />
              <Label htmlFor={`${field.key}-yes`}>Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem id={`${field.key}-no`} value="no" />
              <Label htmlFor={`${field.key}-no`}>No</Label>
            </div>
          </RadioGroup>
        );
      }
      case "group": {
        const groupVal = (state?.[field.key] as any) || {};
        return (
          <div className="space-y-3">
            {(field.items || []).map((it: any) => {
              if (it.type === "checkbox_with_notes") {
                const checked = !!groupVal[it.key];
                const notes = groupVal[it.notes_key] ?? "";
                return (
                  <div key={it.key} className="grid gap-2">
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(val) =>
                          setVal(field.key, { ...groupVal, [it.key]: !!val })
                        }
                      />
                      <span>{it.label}</span>
                    </label>
                    <Input
                      placeholder="Notes"
                      value={notes}
                      onChange={(e) =>
                        setVal(field.key, { ...groupVal, [it.notes_key]: e.currentTarget.value })
                      }
                    />
                    
                  </div>
                );
              }
              if (it.type === "text") {
                const val = groupVal[it.key] ?? "";
                return (
          <div key={it.key} className="grid gap-1">
            <Label>{it.label}</Label>
            <Input
              value={val}
              onChange={(e) => setVal(field.key, { ...groupVal, [it.key]: e.currentTarget.value })}
            />
            {shouldShowVoice(stageKey, `${field.key}.${it.key}`, it.type) && (
              <VoiceInputButton onResult={(t) => setVal(field.key, { ...groupVal, [it.key]: t })} />
            )}
          </div>
                );
              }
              if (it.type === "textarea") {
                const val = groupVal[it.key] ?? "";
                return (
                  <div key={it.key} className="grid gap-1">
                    <Label>{it.label}</Label>
                    <Textarea
                      value={val}
                      onChange={(e) => setVal(field.key, { ...groupVal, [it.key]: e.currentTarget.value })}
                    />
                    {shouldShowVoice(stageKey, `${field.key}.${it.key}`, it.type) && (
                      <VoiceInputButton onResult={(t) => setVal(field.key, { ...groupVal, [it.key]: t })} />
                    )}
                  </div>
                );
              }
              if (it.type === "checkboxes") {
                const arr: string[] = Array.isArray(groupVal[it.key]) ? groupVal[it.key] : [];
                return (
                  <div key={it.key} className="grid gap-1">
                    <Label>{it.label}</Label>
                    <div className="grid gap-2">
                      {(it.options || []).map((opt: string) => {
                        const checked = arr.includes(opt);
                        return (
                          <label key={opt} className="flex items-center gap-2">
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(val) => {
                                const next = new Set(arr);
                                if (val) next.add(opt);
                                else next.delete(opt);
                                setVal(field.key, { ...groupVal, [it.key]: Array.from(next) });
                              }}
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        );
      }
      case "table": {
        const rows = Array.isArray(v) ? v : (field.rows || []).map((r: any) => ({ ...r, yes: false, no: false, notes: "" }));
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Task</th>
                  <th className="p-2">Yes</th>
                  <th className="p-2">No</th>
                  <th className="p-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row: any, idx: number) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{row.task}</td>
                    <td className="p-2">
                      <Checkbox
                        checked={!!row.yes}
                        onCheckedChange={(val) => {
                          const next = rows.slice();
                          next[idx] = { ...row, yes: !!val, no: val ? false : row.no };
                          setVal(field.key, next);
                        }}
                      />
                    </td>
                    <td className="p-2">
                      <Checkbox
                        checked={!!row.no}
                        onCheckedChange={(val) => {
                          const next = rows.slice();
                          next[idx] = { ...row, no: !!val, yes: val ? false : row.yes };
                          setVal(field.key, next);
                        }}
                      />
                    </td>
                    <td className="p-2">
                      <div className="grid gap-1">
                        <Textarea
                          value={row.notes || ""}
                          onChange={(e) => {
                            const next = rows.slice();
                            next[idx] = { ...row, notes: e.currentTarget.value };
                            setVal(field.key, next);
                          }}
                        />
                        {shouldShowVoice(stageKey, `${field.key}.${idx}.notes`, "textarea") && (
                          <VoiceInputButton 
                            onResult={(text) => {
                              const next = rows.slice();
                              next[idx] = { ...row, notes: text };
                              setVal(field.key, next);
                            }} 
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      case "criteria9": {
        const obj = v || {};
        return (
          <div className="grid gap-3">
            {field.items.map((item: string, i: number) => {
              const idx = (i + 1).toString();
              const entry = obj[idx] || { freq: false, impact: false, other: false, criteria: false, notes: "" };
              const setEntry = (patch: any) => setVal(field.key, { ...obj, [idx]: { ...entry, ...patch } });
              return (
                <div key={idx} className="rounded-md border p-3">
                  <div className="font-medium mb-2">{idx}. {item}</div>
                  <div className="flex flex-wrap gap-4">
                    {(["freq", "impact", "other", "criteria"] as const).map((k) => (
                      <label key={k} className="flex items-center gap-2">
                        <Checkbox checked={!!entry[k]} onCheckedChange={(val) => setEntry({ [k]: !!val })} />
                        <span className="capitalize">{k}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-2">
                    <Label>Notes</Label>
                    <Textarea value={entry.notes || ""} onChange={(e) => setEntry({ notes: e.currentTarget.value })} />
                    {shouldShowVoice(stageKey, `${field.key}.${idx}.notes`, "textarea") && (
                      <VoiceInputButton onResult={(t) => setEntry({ notes: t })} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      }
      default:
        return <div className="text-muted-foreground">Unsupported field type: {field.type}</div>;
    }
  }

  return (
    <div className="form-container">
      <div className="grid gap-6">
        {sectionsSafe.map((section, idx) => (
          <div key={idx} className="grid gap-4">
            {section.title && <h2 className="section-title">{section.title}</h2>}
            <div className="form-section">
              {(section.fields || []).map((f: any) => {
                const isFullWidth = f.type === "textarea" || f.type === "group" || f.type === "table" || f.type === "criteria9";
                return (
                  <div key={f.key || f.title} className={cn("form-group", isFullWidth && "full-width")}>
                    {f.label && <Label className="font-medium text-sm text-muted-foreground mb-2">{f.label}</Label>}
                    {renderSimpleField(f)}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useCaseStore } from "@/store/useCaseStore";

function normalizeKey(label: string) {
  return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

const labelToStage1Key: Record<string, string> = {
  "reference number": "refNumber",
  "ref": "refNumber",
  "our ref": "refNumber",
  "gp name": "gpName",
  "gp address": "gpAddress",
  "client": "clientName",
  "client name": "clientName",
  "patient": "clientName",
  "patient name": "clientName",
  "client address": "clientAddress",
  "patient address": "clientAddress",
  "address": "clientAddress",
  "dob": "dob",
  "date of birth": "dob",
  "guardian": "guardianName",
  "mother": "guardianName",
  "guardian/mother name": "guardianName",
  "contact": "contactNumber",
  "contact number": "contactNumber",
  "assessment date": "assessmentDate",
  "assessment time": "assessmentTime",
  "assessment location": "assessmentLocation",
  "location/method of assessment": "assessmentLocation",
  "care manager": "careManager",
  "intro notes": "introNotes",
  "present": "present",
  "present other": "presentOther",
  "handedness": "handedness",
  "year & months": "age",
  "age": "age",
  "school year": "schoolYear",
  "year in school": "schoolYear",
  "school": "school",
  "referral background": "referralBackground",
  "medical history": "medicalHistory",
  "medications": "medications",
  "medications / supplements": "medications",
  "surgical history": "surgicalHistory",
  "past surgical/procedural history": "surgicalHistory",
  "allergies": "allergies",
  "drug allergies/intolerances": "allergies",
  "forensic history": "forensicHistory",
  "substance history": "substanceHistory",
  "household composition": "householdComposition",
  "other family details": "otherFamilyDetails",
  "family medical history": "familyMedicalHistory",
  "family mental health": "familyMentalHealth",
  "family mental health difficulties": "familyMentalHealth",
  "family learning difficulties": "familyLearningDifficulties",
  "antenatal details": "antenatalDetails",
  "delivery details": "deliveryDetails",
  "postpartum details": "postpartumDetails",
  "developmental milestones": "developmentalMilestones",
  "additional notes": "additionalNotes",
  "next session type": "nextSessionType",
  "other details": "otherDetails",
  // Next steps grouped assessments (checkbox + notes)
  "ot": "assessments.ot",
  "ot details": "assessments.otDetails",
  "slt": "assessments.slt",
  "slt details": "assessments.sltDetails",
  "cognitive": "assessments.cognitive",
  "cognitive details": "assessments.cognitiveDetails",
  "other assessment": "assessments.other",
  "other assessment details": "assessments.otherAssessmentDetails",
};

function parseTranscript(text: string) {
  const out: Record<string, any> = {};
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  // Simple K: V parsing
  for (const line of lines) {
    const m = line.match(/^([^:]+):\s*(.+)$/);
    if (!m) continue;
    const rawLabel = normalizeKey(m[1]);
    const value = m[2].trim();

    // Special handling for presence
    if (rawLabel === "present") {
      const lower = value.toLowerCase();
      const set = new Set<string>();
      if (/(mother|mum)/.test(lower)) set.add("mother");
      if (/father/.test(lower)) set.add("father");
      if (set.has("mother") && set.has("father")) {
        out.present = ["both"]; // matches spec option
      } else if (set.size > 0) {
        out.present = Array.from(set);
      } else if (lower.includes("both")) {
        out.present = ["both"];
      } else if (lower.includes("other")) {
        out.present = ["other"];
      }
      continue;
    }

    let key = labelToStage1Key[rawLabel];
    if (!key) continue;

    // Grouped assessments handling
    if (key.startsWith("assessments.")) {
      const [, sub] = key.split(".");
      out.assessments = out.assessments || {};
      if (/\by(es)?\b/i.test(value)) {
        if (sub && ["ot", "slt", "cognitive", "other"].includes(sub)) out.assessments[sub] = true;
      }
      if (/details|note|:/.test(rawLabel) || sub?.toLowerCase().includes("details")) {
        out.assessments[sub!] = value;
      }
      continue;
    }

    // Booleans
    if (["ot", "slt", "cognitive"].includes(rawLabel) && /\bno\b/i.test(value)) {
      out[key] = false;
      continue;
    }

    out[key] = value;
  }

  // Basic pattern fallbacks from free text
  const whole = text.toLowerCase();
  if (!out.handedness) {
    if (whole.includes("right-handed")) out.handedness = "right";
    else if (whole.includes("left-handed")) out.handedness = "left";
  }

  return out;
}

const sampleTranscript = `Ref: 12345\nGP Name: Smith\nGP Address: 1 Health Street, Dublin\nClient Name: Alex Johnson\nClient Address: 22 Oak Road, Dublin\nDOB: 2013-05-02\nGuardian: Jane Johnson\nContact Number: +353 87 123 4567\nAssessment Date: 2025-09-01\nAssessment Time: 10:00\nAssessment Location: Video call\nCare Manager: A. Psychologist\nPresent: mother and father (both)\nHandedness: right\nYear in School: 6th Class\nSchool: St. Patrick's Primary\nReferral Background: Teacher raised concerns about attention.\nMedical History: Asthma, no hospitalisations.\nMedications / Supplements: Salbutamol PRN.\nPast Surgical/Procedural History: None.\nDrug Allergies/Intolerances: NKDA.\nForensic History: None.\nSubstance History: None.\nHousehold Composition: Lives with both parents and sister.\nOther Family Details: Supportive home environment.\nFamily Medical History: Mother – hypothyroidism.\nFamily Mental Health Difficulties: Maternal aunt – depression.\nFamily Learning Difficulties: Cousin – dyslexia.\nAntenatal Details: Unremarkable.\nDelivery Details: Vaginal delivery, term.\nPostpartum Details: No complications.\nDevelopmental Milestones: Slightly delayed speech.\nAdditional Notes: Sleep onset issues.\nOT: yes\nOT Details: Sensory profile if indicated.\nSLT: no\nCognitive: yes\nCognitive Details: Consider WISC.\nOther Assessment: no\nNext Session Type: In-person S2\nOther Details: None.`;

export default function TranscriptionPanel() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const updateField = useCaseStore((s) => s.updateField);

  const loadFile = async (file: File) => {
    if (file.type.startsWith("text/")) {
      const content = await file.text();
      setText(content);
      toast({ title: "Transcript loaded", description: file.name });
      return;
    }
    if (file.type.startsWith("audio/")) {
      setText(sampleTranscript);
      toast({
        title: "Demo transcription used",
        description: "Audio providers not configured. Loaded sample transcript.",
      });
      return;
    }
    toast({ title: "Unsupported file", description: "Please upload audio or a .txt file" });
  };

  const applyToForm = (data: Record<string, any>) => {
    const entries = Object.entries(data);
    if (entries.length === 0) {
      toast({ title: "No data extracted", description: "Check the transcript format" });
      return;
    }
    entries.forEach(([k, v]) => updateField(`stage1.${k}`, v));
    toast({ title: "Fields populated", description: `${entries.length} fields updated from transcript` });
  };

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>Stage 1: Transcription & Auto-Populate (Demo)</CardTitle>
        <CardDescription>Upload audio or paste transcript text, then auto-fill the Stage 1 proforma.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Input ref={fileRef} type="file" accept="audio/*,text/plain" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void loadFile(f);
          }} />
          <Button variant="secondary" type="button" onClick={() => setText(sampleTranscript)}>
            Load sample transcript
          </Button>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tx">Transcript</Label>
          <Textarea id="tx" value={text} onChange={(e) => setText(e.currentTarget.value)} placeholder="Paste transcript here (e.g., 'GP Name: Smith')" rows={8} />
        </div>
        <div className="flex gap-3">
          <Button type="button" onClick={() => applyToForm(parseTranscript(text))}>Auto-populate fields</Button>
          <Button variant="outline" type="button" onClick={() => setText("")}>Clear</Button>
        </div>
      </CardContent>
    </Card>
  );
}

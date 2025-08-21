import React, { useRef, useState } from "react";
import { SpeechToFormService } from "@/services/speechToForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useCaseStore } from "@/store/useCaseStore";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface StageTranscriptionPanelProps {
  stage: "stage1" | "stage2" | "stage3";
  stageTitle: string;
}

const sampleTranscripts = {
  stage1: `Ref: 12345\nGP Name: Smith\nGP Address: 1 Health Street, Dublin\nClient Name: Alex Johnson\nClient Address: 22 Oak Road, Dublin\nDOB: 2013-05-02\nGuardian: Jane Johnson\nContact Number: +353 87 123 4567\nAssessment Date: 2025-09-01\nAssessment Time: 10:00\nAssessment Location: Video call\nCare Manager: A. Psychologist\nPresent: mother and father (both)\nHandedness: right\nYear in School: 6th Class\nSchool: St. Patrick's Primary\nReferral Background: Teacher raised concerns about attention.\nMedical History: Asthma, no hospitalisations.\nMedications / Supplements: Salbutamol PRN.\nPast Surgical/Procedural History: None.\nDrug Allergies/Intolerances: NKDA.\nForensic History: None.\nSubstance History: None.\nHousehold Composition: Lives with both parents and sister.\nOther Family Details: Supportive home environment.\nFamily Medical History: Mother – hypothyroidism.\nFamily Mental Health Difficulties: Maternal aunt – depression.\nFamily Learning Difficulties: Cousin – dyslexia.\nAntenatal Details: Unremarkable.\nDelivery Details: Vaginal delivery, term.\nPostpartum Details: No complications.\nDevelopmental Milestones: Slightly delayed speech.\nAdditional Notes: Sleep onset issues.\nOT: yes\nOT Details: Sensory profile if indicated.\nSLT: no\nCognitive: yes\nCognitive Details: Consider WISC.\nOther Assessment: no\nNext Session Type: In-person S2\nOther Details: None.`,
  
  stage2: `MSE Appearance: Well-groomed, appropriate dress\nBehavior: Fidgety, difficulty remaining seated\nSpeech: Normal rate and volume\nMood: Slightly anxious\nAffect: Congruent with mood\nThought Process: Linear, goal-directed\nThought Content: No delusions or obsessions\nPerception: No hallucinations reported\nCognition: Alert, oriented x3\nInsight: Limited awareness of attention difficulties\nJudgment: Age-appropriate\nADHD Symptoms: Inattention present in multiple settings\nImpulsivity: Frequent interrupting, difficulty waiting turn\nHyperactivity: Restless, leaves seat frequently\nFunctional Impairment: Academic performance declining\nOnset: Symptoms noted since age 6\nDuration: Persistent for 18 months`,
  
  stage3: `Diagnosis: ADHD Combined Presentation (314.01)\nSeverity: Moderate\nCriteria Met: 6/9 inattention, 6/9 hyperactivity-impulsivity\nDifferential: Rule out anxiety disorder\nComorbidities: None identified\nTreatment Plan: Behavioral interventions, school accommodations\nMedication: Consider stimulant trial if behavioral interventions insufficient\nFollow-up: 4-6 weeks\nRecommendations: IEP assessment, parent training\nPrognosis: Good with appropriate interventions\nRisk Factors: Family history of ADHD\nProtective Factors: Supportive family, average intelligence`
};

export default function StageTranscriptionPanel({ stage, stageTitle }: StageTranscriptionPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractionResults, setExtractionResults] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const updateField = useCaseStore((s) => s.updateField);
  const speechService = new SpeechToFormService();

  const loadFile = async (file: File) => {
    if (file.type.startsWith("text/")) {
      const content = await file.text();
      setText(content);
      toast({ title: "Transcript loaded", description: file.name });
      return;
    }
    if (file.type.startsWith("audio/")) {
      setText(sampleTranscripts[stage]);
      toast({
        title: "Demo transcription used",
        description: "Audio providers not configured. Loaded sample transcript.",
      });
      return;
    }
    toast({ title: "Unsupported file", description: "Please upload audio or a .txt file" });
  };

  const processWithOrchestrator = async () => {
    if (!text.trim()) {
      toast({ title: "No transcript", description: "Please provide transcript text" });
      return;
    }

    setIsProcessing(true);
    try {
      const results = await speechService.processTranscript(text);
      setExtractionResults(results);
      
      // Auto-apply high-confidence fields for the current stage
      const autoApplyFields = results.validation.apply_plan.filter(
        plan => plan.status === 'auto_apply' && plan.stage === stage
      );
      
      // Apply extracted fields to the current stage
      if (results.orchestration.stages[stage]?.sections) {
        Object.values(results.orchestration.stages[stage].sections).forEach((section: any) => {
          Object.entries(section.fields).forEach(([fieldId, fieldData]: [string, any]) => {
            const shouldAutoApply = autoApplyFields.some(plan => plan.field_id === fieldId);
            if (shouldAutoApply) {
              updateField(`${stage}.${fieldId}`, fieldData.value);
            }
          });
        });
      }

      const autoAppliedCount = autoApplyFields.length;
      const suggestedCount = results.validation.apply_plan.filter(p => p.stage === stage).length - autoAppliedCount;
      
      toast({ 
        title: "AI Processing Complete", 
        description: `${autoAppliedCount} fields auto-applied, ${suggestedCount} suggestions available`
      });
    } catch (error) {
      toast({ title: "Processing Error", description: "Failed to process transcript" });
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-6">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          🤖 AI Transcription & Auto-Populate for {stageTitle}
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4">
        <Card className="border">
          <CardHeader>
            <CardTitle>{stageTitle}: Transcription & Auto-Populate</CardTitle>
            <CardDescription>Upload audio or paste transcript text, then auto-fill the {stageTitle} fields.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Input ref={fileRef} type="file" accept="audio/*,text/plain" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void loadFile(f);
              }} />
              <Button variant="secondary" type="button" onClick={() => setText(sampleTranscripts[stage])}>
                Load {stage} sample
              </Button>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`tx-${stage}`}>Transcript</Label>
              <Textarea 
                id={`tx-${stage}`} 
                value={text} 
                onChange={(e) => setText(e.currentTarget.value)} 
                placeholder={`Paste ${stage} transcript here...`} 
                rows={6} 
              />
            </div>
            <div className="flex gap-3">
              <Button 
                type="button" 
                onClick={processWithOrchestrator} 
                disabled={isProcessing}
                className="bg-primary"
              >
                {isProcessing ? "Processing..." : "🤖 AI Extract & Populate"}
              </Button>
              <Button variant="outline" type="button" onClick={() => setText("")}>Clear</Button>
            </div>

            {extractionResults && (
              <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">AI Extraction Results for {stageTitle}</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Stage Completion:</strong> {
                      extractionResults.validation.stage_gates[stage]?.completion_ready ? 
                      "✅ Ready" : "⚠️ Incomplete"
                    }
                  </div>
                  {extractionResults.validation.stage_gates[stage]?.missing_required_fields?.length > 0 && (
                    <div>
                      <strong>Missing Required:</strong> {
                        extractionResults.validation.stage_gates[stage].missing_required_fields.join(', ')
                      }
                    </div>
                  )}
                  <div>
                    <strong>Fields Processed:</strong> {
                      extractionResults.validation.apply_plan.filter((p: any) => p.stage === stage).length
                    }
                  </div>
                  <div>
                    <strong>Auto-Applied:</strong> {
                      extractionResults.validation.apply_plan.filter((p: any) => p.status === 'auto_apply' && p.stage === stage).length
                    }
                  </div>
                  <div>
                    <strong>Suggestions:</strong> {
                      extractionResults.validation.apply_plan.filter((p: any) => p.status === 'suggest_only' && p.stage === stage).length
                    }
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
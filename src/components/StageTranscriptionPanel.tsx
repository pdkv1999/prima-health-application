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
import ExtractionReport from "./ExtractionReport";

interface StageTranscriptionPanelProps {
  stage: "stage1" | "stage2" | "stage3";
  stageTitle: string;
  onNavigateToField?: (stage: string, fieldId: string) => void;
}

const sampleTranscripts = {
  stage1: `Reference Number: PH25 - 412
GP Name: Dr. Sarah Mitchell
GP Address: Riverside Medical Centre, 42 Church Lane, Cork, T12 X5Y9
Client Name: Emma O'Sullivan
Client Address: 15 Willow Park, Ballincollig, Cork
Date of Birth: 2014-03-15
Guardian Name: Maria O'Sullivan
Contact Number: +353 86 789 1234
Assessment Date: 2025-09-15
Assessment Time: 14:30
Assessment Location: PrimaHealth Clinic Cork
Clinician: Dr. James McCarthy

Present at Assessment: Both mother and father present

Handedness: Right-handed
Age: 11 years, 6 months
Year in School: 5th Class
School: St. Brigid's National School

Referral Background: Emma was referred following persistent concerns from both parents and her class teacher regarding significant attention difficulties, organizational challenges, and hyperactive behavior observed consistently across home and school settings over the past 18 months. Initial concerns arose during 4th class when academic demands increased.

Medical History: Generally healthy child. History of recurrent ear infections in early childhood, resolved by age 7. No chronic medical conditions. All routine vaccinations up to date.

Medications: None currently. Occasional paracetamol for headaches.

Past Surgical History: Grommets inserted at age 5, removed naturally at age 7. No other surgical procedures.

Drug Allergies: No known drug allergies or intolerances documented.

Forensic History: None applicable.

Substance History: Not applicable for age.

Household Composition: Lives with both biological parents and younger brother (age 8). Supportive family environment with consistent routines.

Family Medical History: Paternal grandfather - Type 2 diabetes. Maternal grandmother - hypertension.

Family Mental Health: Paternal uncle diagnosed with ADHD in adulthood. Maternal side - no known mental health difficulties.

Family Learning Difficulties: Paternal cousin - dyslexia diagnosed in primary school.

Antenatal Details: Uncomplicated pregnancy. Mother took prenatal vitamins. No smoking, alcohol, or substance use during pregnancy.

Delivery Details: Full-term vaginal delivery at 39 weeks gestation. Birth weight 3.2kg. No complications during delivery.

Postpartum Details: Normal postnatal recovery for both mother and baby. Breastfeeding established successfully.

Developmental Milestones: All major milestones achieved within normal timeframes. Walked at 13 months, first words at 12 months, potty trained by 2.5 years.

Additional Notes: Sleep patterns generally good, though sometimes takes longer to settle at bedtime. Active child who enjoys sports and outdoor activities.

Next Steps - Additional Assessments:
OT: Yes - sensory processing assessment recommended
OT Details: Evaluate sensory processing patterns and provide strategies for classroom attention
SLT: No - speech and language development within normal limits
Cognitive: Yes - full cognitive assessment to rule out learning difficulties
Cognitive Details: WISC-V recommended to assess intellectual functioning and identify any specific learning difficulties
Other Assessments: No additional assessments required at this time

Next Session Type: In-person Stage 2 assessment
Other Details: Parents to complete Conners-4 rating scales before next appointment`,
  
  stage2: `Mental State Examination Tasks:
Months of the Year Backwards: No - became confused after September, required prompting
Serial Threes: No - managed first two subtractions (100, 97) then lost track
Digit Span Forward: Yes - achieved 5 digits forward, appropriate for age
Digit Span Reverse: No - struggled with 3 digits reverse, attention wandered to room sounds
Verbal "A" Test: No - missed multiple A words, easily distracted by external stimuli

Additional MSE Notes: Emma demonstrated significant difficulty with sustained attention tasks. Frequently looked around the room, fidgeted with her hands, and required multiple redirections to task. This pattern consistent with attention regulation difficulties characteristic of ADHD.

ADHD Inattention Symptoms Assessment:
1. Careless mistakes in schoolwork: Frequently - teacher reports constant errors in math and written work despite knowing the material
2. Difficulty sustaining attention: Always - cannot focus on homework for more than 5 minutes without redirection
3. Not listening when spoken to: Often - parents report having to repeat instructions multiple times
4. Not following through on instructions: Daily occurrence - starts tasks but fails to complete them
5. Difficulty organizing tasks: Severely impaired - backpack and desk extremely disorganized, loses homework regularly
6. Avoids sustained mental effort: Yes - significant homework battles, avoids reading tasks
7. Loses necessary items: Constantly - pencils, homework sheets, lunch box frequently misplaced
8. Easily distracted: Extremely - distracted by sounds in hallway, peers talking, visual stimuli
9. Forgetful in daily activities: Daily - forgets chores, bringing items to school, completing tasks

ADHD Hyperactivity-Impulsivity Symptoms Assessment:
1. Fidgets with hands/feet: Constantly - cannot sit still, always moving hands or tapping feet
2. Leaves seat inappropriately: Frequently - gets up during lessons, difficult to remain seated during meals
3. Runs/climbs inappropriately: Sometimes - less problematic than when younger but still occurs
4. Difficulty with quiet activities: Yes - cannot engage in quiet independent play for extended periods
5. Often "on the go": Yes - described by parents as having a "motor that won't stop"
6. Talks excessively: Yes - very talkative, interrupts conversations frequently
7. Blurts out answers: Daily at school - teacher reports constant calling out without raising hand
8. Difficulty waiting turn: Severe - cannot wait in lines, interrupts games and activities
9. Interrupts others: Constantly - interrupts parents, peers, and teachers regularly

Other Difficulties Related to ADHD: Sleep onset difficulties due to racing thoughts. Social challenges with peers due to impulsive behavior and difficulty taking turns. Emotional dysregulation with frequent meltdowns when frustrated.

Suspected Comorbidities: Mild anxiety symptoms, particularly around academic performance and social situations. No evidence of mood disorder or other significant psychiatric comorbidities at this time.

Additional Relevant Notes: Parents report that symptoms have been consistent since early childhood but became more problematic when academic demands increased in 4th class. Both home and school environments significantly impacted.

Preliminary Summary of ADHD Assessment: ADHD Combined Presentation (DSM-5) - meets criteria for both inattention and hyperactivity-impulsivity symptom clusters with significant functional impairment across multiple settings.

Next Steps Planning:
OT Assessment: Yes - recommended for sensory processing evaluation and classroom accommodation strategies
OT Details: Focus on attention regulation strategies and sensory tools for classroom use
SLT Assessment: No - language development within expected range
SLT Details: Not applicable
Cognitive Assessment: Yes - completed WISC-V showing average intellectual functioning
Cognitive Details: Full scale IQ 108, no specific learning disabilities identified, attention difficulties primary concern
Other Assessments: No additional formal assessments required
Other Assessment Details: School observation may be beneficial

Next Session Type: Stage 3 - Final consultation with diagnostic feedback and treatment planning
Care Manager Reminders: Review Conners-4 parent and teacher ratings, discuss medication options, prepare psychoeducation materials
Personal Information: Emma enjoys art and creative activities, responds well to positive reinforcement and clear structure`,
  
  stage3: `Mental State Examination - Serial Recitation Tasks (Final Assessment):
Months of the Year Backwards: No - struggled significantly, became confused after August, required multiple prompts
Serial Threes: No - managed only 100, 97, 94 before losing concentration and becoming distracted
Digit Span Forward: Yes - successfully completed 5 digits forward, which is age-appropriate
Digit Span Reverse: No - attempted 3 digits reverse but attention wandered, looked around room
Verbal "A" Test: No - missed several A words including obvious ones like "apple", attention clearly compromised

Mental State Details: Consistent pattern of attention regulation difficulties observed across assessment sessions. Emma's performance on sustained attention tasks remains significantly below expected level for her age and intellectual ability. These findings support the diagnostic impression of ADHD with prominent attention regulation deficits.

Final Diagnosis: ADHD Combined Presentation (DSM-5)

DSM-5 Diagnostic Criteria Assessment:
Criterion A - Symptom Presence: Yes - Emma meets 8/9 inattention symptoms and 7/9 hyperactivity-impulsivity symptoms, well exceeding the required 6 symptoms in each domain for her age group
Criterion B - Age of Onset: Yes - symptoms clearly documented before age 12, with parents reporting concerns since early primary school (age 6-7)
Criterion C - Multiple Settings: Yes - symptoms consistently present and impairing across home, school, and social settings as confirmed by parent report, teacher input, and clinical observation
Criterion D - Functional Impairment: Yes - significant impairment documented in academic performance (declining grades, incomplete work), social relationships (peer difficulties due to impulsivity), and family functioning (daily homework battles, behavioral challenges)
Criterion E - Alternative Explanations: Yes - other conditions appropriately considered and ruled out through comprehensive assessment including cognitive testing, developmental history, and clinical interview

Diagnostic Criteria Details: All five DSM-5 criteria for ADHD Combined Presentation are clearly met with substantial supporting evidence from multiple sources and assessment methods. The diagnosis is confident and well-supported by objective findings.

Diagnosis Plan: 
Confirmed Diagnosis of ADHD Combined Presentation established on 15.09.2025
Comprehensive treatment plan to be initiated incorporating both pharmacological and behavioral interventions

Psychoeducation Provided:
- Comprehensive psychoeducation on ADHD diagnosis and its implications for Emma and family
- Discussion of evidence-based pharmacological vs non-pharmacological treatment options
- Information about Parents Plus program available through ADHD Ireland
- Emphasis on importance of routine, structure, and consistent behavioral strategies
- Information about DARE scheme academic accommodations for secondary school transition

Medical Investigations Recommended:
Blood investigations requested: Full blood count, Vitamin B12, Ferritin, Folate levels, Renal function, Liver function tests, Thyroid function tests
Baseline measurements prior to potential medication trial: Height, weight, blood pressure, heart rate

Review and Follow-up Planning:
Initial review appointment scheduled for 6 weeks post-diagnosis
Medication trial consideration: Methylphenidate to be considered if behavioral interventions prove insufficient
Ongoing monitoring plan established for treatment response and potential side effects

Aftercare and Treatment Recommendations:
- Trial of ADHD medication treatment pending blood work results and family decision
- Omega-3 fish oil supplementation recommended (1000mg daily)
- Iron supplementation if ferritin levels below 50ng/dL
- Behavioral management strategies implementation at home and school

Allied Health Professional Recommendations:
Cognitive and Educational Assessment: Completed - confirms average intellectual ability with attention-based learning difficulties
Occupational Therapy Input: Recommended for sensory processing assessment and development of classroom attention strategies and tools

Allied Health Details: Comprehensive occupational therapy assessment recommended to address sensory processing needs and develop individualized attention regulation strategies for home and school environments. Focus on practical tools and environmental modifications to support Emma's learning and daily functioning.

School Liaison: Recommendations for classroom accommodations and teacher strategies to be provided to support Emma's educational needs and optimize her learning environment.`
};

export default function StageTranscriptionPanel({ stage, stageTitle, onNavigateToField }: StageTranscriptionPanelProps) {
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
      // DEBUG: Let's see what's actually in the transcript
      console.log("=== TRANSCRIPT CONTENT ===");
      console.log(text);
      console.log("=== END TRANSCRIPT ===");
      
      const results = await speechService.processTranscript(text);
      
      // DEBUG: Let's see what the AI extracted
      console.log("=== EXTRACTION RESULTS ===");
      console.log(JSON.stringify(results, null, 2));
      console.log("=== END EXTRACTION ===");
      
      // Auto-apply high-confidence fields across ALL STAGES
      const allAutoApplyFields = results.validation.apply_plan.filter(
        plan => plan.status === 'auto_apply'
      );
      
      // Apply extracted fields to ALL stages, assign 'NA' to missing fields
      ['stage1', 'stage2', 'stage3'].forEach(stageKey => {
        if (results.orchestration.stages[stageKey]?.sections) {
          Object.values(results.orchestration.stages[stageKey].sections).forEach((section: any) => {
            Object.entries(section.fields).forEach(([fieldId, fieldData]: [string, any]) => {
              const shouldAutoApply = allAutoApplyFields.some(plan => plan.field_id === fieldId && plan.stage === stageKey);
              if (shouldAutoApply) {
                console.log(`Applying field: ${stageKey}.${fieldId} = ${fieldData.value}`);
                updateField(`${stageKey}.${fieldId}`, fieldData.value);
              }
            });
          });
        }
      });

      // Assign 'NA' to missing required fields so user can proceed
      const missingFields = results.validation.apply_plan.filter(plan => plan.status === 'suggest_only' && plan.reason?.includes('Empty value'));
      missingFields.forEach(field => {
        console.log(`Assigning NA to: ${field.stage}.${field.field_id}`);
        updateField(`${field.stage}.${field.field_id}`, 'NA');
      });

      // Now check current form state and update validation results accordingly
      const currentState = useCaseStore.getState();
      const updatedResults = updateValidationWithCurrentFormState(results, currentState);
      
      setExtractionResults(updatedResults);

      const totalAutoApplied = allAutoApplyFields.length;
      const totalMissingAssignedNA = missingFields.length;
      const totalProcessed = results.validation.apply_plan.length;
      
      toast({ 
        title: "AI Processing Complete - All Stages", 
        description: `${totalAutoApplied} fields auto-applied, ${totalMissingAssignedNA} missing assigned 'NA', ${totalProcessed} total processed`
      });
    } catch (error) {
      toast({ title: "Processing Error", description: "Failed to process transcript" });
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to update validation results with current form state
  const updateValidationWithCurrentFormState = (results: any, currentState: any) => {
    console.log('Updating validation with current form state:', currentState);
    
    const requiredFieldsByStage = {
      stage1: ['clientName', 'dob', 'guardianName', 'assessmentDate'],
      stage2: ['client_name', 'assessment_date', 'mse'],  
      stage3: ['diagnosis', 'criteria']
    };

    // Update validation for each stage based on current form values
    const updatedStageGates = { ...results.validation.stage_gates };
    
    Object.keys(requiredFieldsByStage).forEach(stageKey => {
      const stageData = currentState[stageKey] || {};
      const requiredFields = requiredFieldsByStage[stageKey as keyof typeof requiredFieldsByStage] || [];
      
      // Check which fields are actually missing/empty in current form
      const actuallyMissingFields = requiredFields.filter(fieldId => {
        const value = stageData[fieldId];
        const isEmpty = !value || value === '' || value === 'NA' || (Array.isArray(value) && value.length === 0);
        console.log(`Checking ${stageKey}.${fieldId}: value="${value}", isEmpty=${isEmpty}`);
        return isEmpty;
      });
      
      console.log(`Stage ${stageKey} - Required: ${requiredFields}, Actually missing: ${actuallyMissingFields}`);
      
      updatedStageGates[stageKey] = {
        completion_ready: actuallyMissingFields.length === 0,
        missing_required_fields: actuallyMissingFields
      };
    });

    // Update apply plan to reflect current form state
    const updatedApplyPlan = results.validation.apply_plan.map((plan: any) => {
      const stageData = currentState[plan.stage] || {};
      const currentValue = stageData[plan.field_id];
      
      if (currentValue && currentValue !== '' && currentValue !== 'NA') {
        // Field is actually filled, mark as applied
        return { ...plan, status: 'auto_apply', reason: 'Already filled in form' };
      } else if (!currentValue || currentValue === '' || currentValue === 'NA') {
        // Field is actually empty/NA, keep as missing
        return { ...plan, status: 'suggest_only', reason: 'Empty value or NA' };
      }
      
      return plan;
    });

    return {
      ...results,
      validation: {
        ...results.validation,
        apply_plan: updatedApplyPlan,
        stage_gates: updatedStageGates
      }
    };
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
              <Button variant="secondary" type="button" onClick={() => {
                setText(sampleTranscripts[stage]);
                toast({ title: "Sample transcript loaded", description: "Now click 'Populate & Generate Report' to process it." });
              }}>
                Load Data
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
                {isProcessing ? "Processing..." : "Populate & Generate Report"}
              </Button>
              <Button variant="outline" type="button" onClick={() => setText("")}>Clear</Button>
            </div>

            <ExtractionReport 
              extractionResults={extractionResults} 
              currentStage={stage}
              onNavigateToField={onNavigateToField}
            />
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
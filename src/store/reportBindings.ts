// Report field bindings - maps report highlights to stage field paths
export const reportBindings = [
  // Client Information
  { id: "rb_clientName", path: "stage1.clientName" },
  { id: "rb_clientAddress", path: "stage1.clientAddress" },
  { id: "rb_dob", path: "stage1.dob" },
  { id: "rb_refNumber", path: "stage1.refNumber" },
  { id: "rb_handedness", path: "stage1.handedness" },
  { id: "rb_age", path: "stage1.age" },
  { id: "rb_schoolYear", path: "stage1.schoolYear" },
  { id: "rb_school", path: "stage1.school" },
  
  // Background & History
  { id: "rb_referralBackground", path: "stage1.referralBackground" },
  { id: "rb_medicalHistory", path: "stage1.medicalHistory" },
  { id: "rb_medications", path: "stage1.medications" },
  { id: "rb_surgicalHistory", path: "stage1.surgicalHistory" },
  { id: "rb_allergies", path: "stage1.allergies" },
  { id: "rb_substanceHistory", path: "stage1.substanceHistory" },
  
  // Family History
  { id: "rb_householdComposition", path: "stage1.householdComposition" },
  { id: "rb_familyMedicalHistory", path: "stage1.familyMedicalHistory" },
  { id: "rb_familyMentalHealth", path: "stage1.familyMentalHealth" },
  { id: "rb_familyLearningDifficulties", path: "stage1.familyLearningDifficulties" },
  
  // Development
  { id: "rb_antenatalDetails", path: "stage1.antenatalDetails" },
  { id: "rb_deliveryDetails", path: "stage1.deliveryDetails" },
  { id: "rb_postpartumDetails", path: "stage1.postpartumDetails" },
  { id: "rb_developmentalMilestones", path: "stage1.developmentalMilestones" },
  
  // Assessment Details
  { id: "rb_assessmentDate", path: "stage1.assessmentDate" },
  { id: "rb_careManager", path: "stage1.careManager" },
  
  // Stage 2 - Clinical Assessment
  { id: "rb_mentalStateNotes", path: "stage2.mental_state_notes" },
  { id: "rb_otherDifficulties", path: "stage2.other_difficulties" },
  { id: "rb_comorbidities", path: "stage2.comorbidities" },
  { id: "rb_preliminarySummary", path: "stage2.preliminary_summary" },
  { id: "rb_diagnosticOutcome", path: "stage2.diagnostic_outcome" },
  
  // Stage 3 - Final Assessment
  { id: "rb_diagnosis", path: "stage3.diagnosis" },
  { id: "rb_otherDiagnosis", path: "stage3.other_diagnosis" },
  { id: "rb_criteriaDetails", path: "stage3.criteria_details" },
  { id: "rb_recommendations", path: "stage3.recommendations" },
  { id: "rb_aftercareDetails", path: "stage3.aftercare_details" },
  { id: "rb_mentalStateDetails", path: "stage3.mental_state_details" },
  { id: "rb_additionalNotesFinal", path: "stage3.additional_notes_final" },
];

// Helper to find binding by ID
export const getBindingById = (id: string) => reportBindings.find(b => b.id === id);

// Helper to find binding by path
export const getBindingByPath = (path: string) => reportBindings.find(b => b.path === path);
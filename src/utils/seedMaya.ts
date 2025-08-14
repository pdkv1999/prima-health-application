export type MayaSeed = {
  meta: any;
  stage1: any;
  stage2: any;
  stage3: any;
  reportPatch: any;
};

function toISO(d: string) {
  // Accept formats like DD.MM.YY or DD.MM.YYYY and return YYYY-MM-DD
  // Fallback: return original if parse fails
  const m = d.match(/^(\d{2})[./-](\d{2})[./-](\d{2,4})$/);
  if (!m) return d;
  const dd = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  let yy = m[3].length === 2 ? 2000 + parseInt(m[3], 10) : parseInt(m[3], 10);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${yy}-${pad(mm)}-${pad(dd)}`;
}

export function getMayaSeed(currentReport?: any): MayaSeed {
  const meta = {
    refNumber: "PH25-0001",
    gpName: "Dr. Sarah O'Brien",
    gpAddress:
      "Esculap Medical Centre,\nBallincollig Primary Care Centre,\n55 Old Fort Road,\nBallincollig,\nCork, P31 XN96",
    clientName: "Alex Morgan",
    clientAddress: "71 An Caislean Drive,\nBallincollig, Co. Cork",
    dob: toISO("22.06.14"),
    guardianName: "Natalia Morgan",
    contactNumber: "+353 87 123 4567",
    assessmentDate: toISO("09.04.25"),
    assessmentTime: "14:30",
    assessmentLocation: "Western Gateway Building, Cork",
    careManager: "Dr. Michael Kelly",
  };

  const stage1 = {
    ...meta,
    handedness: "right",
    age: "10 years, 11 months",
    schoolYear: "4th class",
    school: "Scoil Mhuire Ballincollig",
    referralBackground:
      "Alex’s difficulties with attention, organization, hyperactivity and emotional regulation have become concerning for the family and have had a significant impact on her engagement and performance in school. Concerns have been noted by both Alex’s parents and teachers, prompting the family to seek an assessment to better understand her difficulties. Her teacher specifically raised concerns around a possible ADHD and/or dyslexia.",
    medicalHistory:
      "1. Migraines - She has had no recent migraines; however, the onset of migraines were severe from the age of three and a half that resulted in vomiting and subsequent input through Dr. ABC, Consultant Paediatric Neurologist.\n2. History of low iron",
    medications: "1. Iburpofen PRN\n2. Triptan PRN",
    surgicalHistory: "None",
    allergies: "No known drug allergies",
    forensicHistory: "No known family history.",
    // Family history long text stored here; can be split later if needed
    otherFamilyDetails:
      "The family moved from Poland to Ireland in 2011. Alex is the eldest of three girls. Her younger sisters are Sofia (7) and Lucia (2). Her mother Natalia (36) has a history of depression and anxiety and was recently diagnosed with ADHD. Natalia also has a history of iron deficiency. She is currently working part-time one day a week as a receptionist in a beautician. There is a positive family history of anaphylaxis. A maternal uncle is suspected of being dyslexic but not formally diagnosed. The maternal grandfather passed away secondary to cancer and the maternal grandmother has a known history of thyroid issues. Alex’s father, Jacek (39), works part-time as a chef in a hotel. The paternal grandfather passed away secondary to cancer. The paternal grandmother is alive and working in Germany.",
    antenatalDetails:
      "There is no reported use of prescribed medicines, cigarettes or alcohol during the pregnancy. Overall this was an uneventful pregnancy.",
    deliveryDetails:
      "She was born at full-term via normal delivery, weighing approximately 3 kg.",
    postpartumDetails: "No postnatal complications were reported.",
    developmentalMilestones:
      "She reached her milestones well before the expected timeframe. She walked at 10 months of age and was telling stories before the age of two. There are no reported issues around motor coordination. There were no issues with toilet training.",
  } as any;

  const stage2 = {
    ref: meta.refNumber,
    gp_name: meta.gpName,
    gp_address: meta.gpAddress,
    client_name: meta.clientName,
    client_address: meta.clientAddress,
    dob: meta.dob,
    guardian_name: meta.guardianName,
    contact_number: meta.contactNumber,
    assessment_date: toISO("07.05.25"),
    assessment_time: "14:30",
    location_method: "In-person at Western Gateway Building (14:30 – PrimaHealth Office)",
    careManager: meta.careManager,
    previous_reminders: "Bring school reports, Conners rating scales, and any recent medical reports. Discuss iron supplementation compliance.",
    present: "Both",
    present_other: "",
    intro_notes: "Alex appeared initially shy but warmed up throughout the session. Both parents present and highly engaged. Brought completed Conners rating scales and recent school report as requested.",
    mse: [
      { task: "Months of the Year Backwards", yes: false, no: true, notes: "Struggled significantly, could only manage 3 months backwards" },
      { task: "Serial Threes", yes: false, no: true, notes: "Required multiple prompts, lost track after 97, 94" },
      { task: "Digit Span Forward", yes: true, no: false, notes: "Achieved 5 digits forward successfully" },
      { task: "Digit Span Reverse", yes: false, no: true, notes: "Maximum 3 digits backwards, shows working memory difficulties" },
      { task: "Verbal 'A' Test", yes: false, no: true, notes: "Generated only 8 words in 60 seconds, below expected for age" }
    ],
    mental_state_notes: "Overall MSE suggests attention and working memory difficulties consistent with ADHD presentation. Alex became frustrated with serial tasks but persevered with encouragement.",
    inattention: [
      { freq: "Often", impact: "Severe", other: "Academic", criteria: true, notes: "Makes frequent careless errors in maths, struggles to check work" },
      { freq: "Often", impact: "Severe", other: "Academic", criteria: true, notes: "Cannot sustain attention during lessons, particularly maths and reading" },
      { freq: "Often", impact: "Moderate", other: "Social", criteria: true, notes: "Parents report she often appears not to listen when spoken to directly" },
      { freq: "Often", impact: "Severe", other: "Academic", criteria: true, notes: "Frequently fails to complete homework assignments, starts but doesn't finish" },
      { freq: "Often", impact: "Severe", other: "Academic", criteria: true, notes: "Significant difficulty organizing school materials and homework schedule" },
      { freq: "Often", impact: "Severe", other: "Academic", criteria: true, notes: "Avoids and procrastinates homework, particularly tasks requiring sustained effort" },
      { freq: "Often", impact: "Moderate", other: "Home", criteria: true, notes: "Frequently loses pencils, homework sheets, permission slips" },
      { freq: "Often", impact: "Moderate", other: "Both", criteria: true, notes: "Easily distracted by sounds, movement, internal thoughts" },
      { freq: "Often", impact: "Moderate", other: "Both", criteria: true, notes: "Forgets to bring homework home, forgets to hand in completed work" }
    ],
    hyperimpulsivity: [
      { freq: "Sometimes", impact: "Mild", other: "Academic", criteria: false, notes: "Some fidgeting with pen/pencil during focused tasks" },
      { freq: "Sometimes", impact: "Mild", other: "Academic", criteria: false, notes: "Occasionally leaves seat during class but generally remains seated" },
      { freq: "Often", impact: "Moderate", other: "Both", criteria: true, notes: "Reports feeling restless, internal sense of being 'driven'" },
      { freq: "Sometimes", impact: "Mild", other: "Social", criteria: false, notes: "Can play quietly but prefers more active games" },
      { freq: "Often", impact: "Moderate", other: "Both", criteria: true, notes: "Frequently described as being 'on the go' by parents and teachers" },
      { freq: "Sometimes", impact: "Mild", other: "Social", criteria: false, notes: "Talks quite a bit but not excessively" },
      { freq: "Often", impact: "Moderate", other: "Academic", criteria: true, notes: "Frequently calls out answers or comments without raising hand" },
      { freq: "Often", impact: "Moderate", other: "Social", criteria: true, notes: "Struggles to wait turn in games, conversations, activities" },
      { freq: "Often", impact: "Moderate", other: "Social", criteria: true, notes: "Frequently interrupts siblings and parents during conversations" }
    ],
    other_difficulties: "Sleep difficulties - takes long time to fall asleep, mind appears to 'race' at bedtime. Emotional regulation challenges, becomes easily overwhelmed and tearful when frustrated. Perfectionist tendencies leading to avoidance of tasks.",
    comorbidities: "Possible anxiety disorder - separation anxiety noted, perfectionist traits, worry about academic performance. Sleep disorder requires investigation. Consider assessment for specific learning difficulties in mathematics.",
    other_notes: "Alex showed good rapport throughout assessment. Parents very supportive and understanding. School report confirms attention difficulties across multiple academic subjects. Conners rating scales completed by parents and teacher show elevated scores for inattention subscales.",
    preliminary_summary: "ADHD Combined Presentation (DSM-5)",
    ot: "No",
    ot_details: "",
    slt: "No", 
    slt_details: "",
    cognitive: "Yes",
    cognitive_details: "Educational psychology assessment recommended to assess for specific learning difficulties, particularly in mathematics and reading comprehension",
    other: "Yes",
    other_details: "Sleep study referral if sleep difficulties persist. Consider paediatric psychology for anxiety management strategies",
    next_session_type: "Final assessment and feedback session",
    other_details_ns: "Provide interim strategies for home and school. Liaise with school regarding reasonable adjustments pending formal diagnosis.",
    careManager_reminders: "Confirm Conners scales scores, review school accommodations already in place, prepare comprehensive management recommendations",
    personal_info: "Alex loves art and creative activities, particularly drawing and painting. Strong interest in animals, especially horses. Enjoys swimming and is learning piano.",
    additional_notes: "Family very engaged in process. Alex expressed relief at having someone understand her difficulties. Parents keen to implement strategies immediately.",
    diagnostic_outcome: "ADHD Combined Presentation (DSM-5)"
  } as any;

  const stage3 = {
    assessment_date: toISO("20.05.25"),
    assessment_time: "",
    location_method: "In-person – same office",
    client_name_cc: meta.clientName,
    additional_doctors:
      "Dr. ABC, Consultant Paediatric Neurologist, City Hospital\nPaediatric Cardiology Dept, City Hospital",
    diagnosis: [
      "Attention-Deficit Hyperactivity Disorder Combined Presentation (DSM - 5)",
    ],
    criteria: [
      "Criterion A: >6/9 symptoms in inattention and/or hyperactivity/impulsivity.",
      "Criterion B: Symptoms were present before age 7.",
      "Criterion C: Criteria are met in two or more settings.",
      "Criterion D: The symptoms are causing impairment in social, academic, and home life.",
      "Criterion E (Consideration of other disorders/difficulties): Co-occurring difficulties were considered in the client’s presentation.",
    ],
  } as any;

  const reportPatch = {
    date: "July 2nd, 2025",
    diagnosis_list: [
      "Attention-Deficit Hyperactivity Disorder Combined Presentation (DSM - 5)",
    ],
    plan_dx: [
      "Diagnosis of ADHD Combined Presentation confirmed (20.05.2025)",
      "Letter provided for school with comprehensive practical recommendations",
      "Individual Education Plan (IEP) meeting recommended with school",
      "Ensure regular iron supplementation compliance (aim for Serum Ferritin > 50ng/mL)",
      "Recommend trial of ADHD medication treatment - stimulant medication first-line",
      "Educational psychology assessment to assess for specific learning difficulties",
      "Consider occupational therapy assessment if fine motor difficulties persist",
      "Recommend ADHD Ireland Support Group and Parent Training Programme",
      "Recommend daily Omega-3 fish oils 1000mg daily (moderate level of evidence for ADHD)",
      "Establish consistent sleep routine and sleep hygiene measures",
      "3-month follow-up appointment for progress monitoring"
    ],
    referralBackground: stage1.referralBackground,
    medicalHistory: stage1.medicalHistory,
    medications: stage1.medications,
    surgicalHistory: stage1.surgicalHistory,
    allergies: stage1.allergies,
    familyHistory: stage1.otherFamilyDetails,
    familyMedicalHistory: stage1.familyMedicalHistory,
    familyMentalHealth: stage1.familyMentalHealth,
    familyLearningDifficulties: stage1.familyLearningDifficulties,
    forensicHistory: stage1.forensicHistory,
    substanceHistory: stage1.substanceHistory,
    antenatalDetails: stage1.antenatalDetails,
    deliveryDetails: stage1.deliveryDetails,
    postpartumDetails: stage1.postpartumDetails,
    developmentalMilestones: stage1.developmentalMilestones,
    householdComposition: stage1.householdComposition,
    assessmentFindings: "Comprehensive assessment conducted over three sessions revealed significant attention difficulties consistent with ADHD Combined Presentation. Working memory deficits noted on MSE tasks. Both inattentive and hyperactive-impulsive symptoms present with substantial impairment across home and school settings.",
    mseFindings: "Mental State Examination revealed difficulties with working memory tasks (digit span reverse max 3), serial cognitive tasks (serial threes), and verbal fluency (A words: 11/minute, below age norms). Attention and concentration difficulties evident throughout assessment.",
    inattentionFindings: "All 9 DSM-5 inattention criteria met with severe impairment noted in academic settings. Particular difficulties with sustained attention, task completion, organization, and following through on instructions.",
    hyperactivityFindings: "5/9 DSM-5 hyperactivity-impulsivity criteria met. Mainly internal restlessness, impulsive verbal responses, difficulty waiting turn, and interrupting others. Less overt hyperactivity than typical presentation.",
    comorbidFindings: "Mild anxiety symptoms likely secondary to ADHD and academic struggles. Sleep difficulties with delayed sleep onset. No evidence of mood disorder, autism spectrum disorder, or primary anxiety disorder.",
    functionalImpact: "Significant functional impairment noted across multiple domains: academic performance declining, homework battles at home, peer relationship difficulties due to impulsive behaviours, and family stress around daily routines and school performance.",
    schoolImpact: "Teacher reports significant attention difficulties during lessons, incomplete work, difficulty following multi-step instructions, frequent loss of materials, and calling out without permission. Academic performance below potential particularly in mathematics and reading comprehension.",
    homeImpact: "Parents report daily challenges with homework completion, morning and bedtime routines, chore completion, and sibling interactions. Alex becomes easily overwhelmed and tearful when frustrated with tasks.",
    conners_table: {
      self: { adhd_i: "4/9", adhd_ii: "2/9", odd: "1/8", cd: "0/15", prob: "65%" },
      parent: { adhd_i: "9/9", adhd_ii: "5/9", odd: "3/8", cd: "1/15", prob: "98%" },
      teacher: { adhd_i: "9/9", adhd_ii: "3/9", odd: "2/8", cd: "0/15", prob: "96%" },
    },
    recommendations_immediate: [
      "Implement daily visual schedule and routine charts at home",
      "Break tasks into smaller, manageable steps",
      "Provide frequent positive reinforcement and praise for effort",
      "Establish quiet, organized study space free from distractions",
      "Use timer for homework sessions (15-20 minute intervals with breaks)"
    ],
    recommendations_school: [
      "Preferential seating away from distractions (front of class, away from high-traffic areas)",
      "Extended time for tests and assignments (1.5x time allowance)",
      "Frequent check-ins and prompts to maintain attention",
      "Break large assignments into smaller components with interim deadlines", 
      "Permission to fidget with stress ball or fidget tool during lessons",
      "Daily communication book between home and school",
      "Movement breaks every 20-30 minutes during focused work"
    ],
    recommendations_longterm: [
      "Medication assessment and trial with paediatric psychiatrist",
      "Educational psychology assessment for learning difficulties",
      "Social skills training group if peer difficulties persist",
      "Family therapy to develop coping strategies and reduce stress",
      "Regular review and adjustment of interventions based on progress"
    ],
    prognosis: "With appropriate multimodal treatment including educational accommodations, behavioural interventions, and consideration of medication, Alex's prognosis is good. Early identification and intervention are positive prognostic factors. Continued family and school support will be crucial for optimal outcomes.",
    followUp: "3-month follow-up appointment scheduled to review progress with interventions, assess need for medication, and monitor overall functioning. Interim contact available if concerns arise."
  } as any;

  return { meta, stage1, stage2, stage3, reportPatch };
}

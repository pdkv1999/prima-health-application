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
    refNumber: "PH25 - 317",
    gpName: "Dr. Aanya Sharma",
    gpAddress: `Lotus Medical Centre
Greenfield Primary Care Centre
55 Park Street
Bengaluru
560001`,
    clientName: "Aarav Singh",
    clientAddress: `71 MG Road, Bengaluru, Karnataka`,
    dob: toISO("17.09.13"),
    guardianName: "Isha Singh",
    contactNumber: "+91 98123-45678",
    assessmentDate: toISO("14.08.24"),
    assessmentTime: "10:00",
    assessmentLocation: "PrimaHealth Clinic, Bengaluru",
    careManager: "Dr. Kabir Das",
  };

  const stage1 = {
    ...meta,
    handedness: "right",
    age: "10 years, 11 months",
    schoolYear: "Class 4",
    school: "Vidya Mandir Bengaluru",
    referralBackground: `Thank you for referring Aarav (right-handed, 10 years, 11 months, currently in Class 4 at Vidya Mandir Bengaluru) for an ADHD assessment. The referral was initiated following concerns expressed both by Aarav’s parents and his class teacher about persistent difficulties with attention, organisation, and regulation of activity level. These difficulties have been observed across home and school environments for over two academic years.

An initial telephone intake was conducted on 09.04.25 with both parents present, followed by a clinical evaluation with Aarav and his mother on 07.05.25. A comprehensive cognitive assessment was completed by Dr. Raj Verma (Senior Educational Psychologist) on 12.05.25, with results reviewed jointly on 20.05.25. The assessment process included direct observation, structured interviews, behavioural questionnaires (Conners-4), and collateral input from school staff.`,
    medicalHistory: `Pregnancy & Birth: Aarav was born full-term via spontaneous vaginal delivery, weighing approximately 3 kg. There were no antenatal complications, and his mother reported no tobacco, alcohol, or illicit drug use during pregnancy. No postnatal complications were recorded.
Early Development: Milestones were achieved early — walked at 10 months, first words before 12 months, and short sentences by 18 months. There were no gross or fine motor coordination concerns. Toilet training was achieved within the expected timeframe, and no regression in skills has been noted.
Medical Conditions:
• Migraines: Onset around 3.5 years old, initially severe with vomiting, but markedly improved in the last two years. Managed under paediatric neurology review (Dr. Meera Nair).
• Iron deficiency: Documented in early childhood; requires ongoing supplementation.
• Allergies: No known drug allergies.
Medications:
• Ibuprofen PRN for headaches.
• Triptan PRN for migraines.`,
    medications: `Ibuprofen PRN for headaches.
Triptan PRN for migraines.`,
    surgicalHistory: "None",
    allergies: "No known drug allergies",
    forensicHistory: "No forensic history documented.",
    householdComposition: `The Singh family relocated from northern India to Bengaluru in 2011. Aarav is the eldest of three boys: Rohan (7) and Kabir (2). His mother, Isha (36), works part-time as a receptionist in a wellness clinic and was recently diagnosed with ADHD, alongside a history of depression and anxiety. She also has a history of iron deficiency.
His father, Vihaan (39), works part-time as a chef in a hotel. There is a notable family history of cancer on both maternal and paternal sides, and a suspected (but undiagnosed) dyslexia in a maternal uncle. Maternal grandmother has hypothyroidism.
Home environment is stable, though the family reports challenges in managing routines and discipline given the competing demands of three young children.`,
    antenatalDetails: `There is no reported use of prescribed medicines, cigarettes or alcohol during the pregnancy. Overall this was an uneventful pregnancy.`,
    deliveryDetails: `Spontaneous vaginal delivery at full term, birth weight approximately 3 kg.`,
    postpartumDetails: `No postnatal complications were reported.`,
    developmentalMilestones: `Milestones achieved early: walked at 10 months, first words before 12 months, short sentences by 18 months. No motor coordination concerns; toilet training within expected timeframe.`,
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
    assessment_time: "10:00",
    location_method: "In-person at PrimaHealth Clinic, Bengaluru",
    careManager: meta.careManager,
    previous_reminders: "Bring school reports, Conners rating scales, and any recent medical reports. Discuss iron supplementation compliance.",
    present: "Both",
    present_other: "",
    intro_notes: "Both parents present and highly engaged. Brought completed Conners-4 rating scales and recent school report as requested.",
    mse: [
      { task: "Months of the Year Backwards", yes: false, no: true, notes: "Struggled significantly, could only manage 3 months backwards" },
      { task: "Serial Threes", yes: false, no: true, notes: "Required multiple prompts, lost track after 97, 94" },
      { task: "Digit Span Forward", yes: true, no: false, notes: "Achieved 5 digits forward successfully" },
      { task: "Digit Span Reverse", yes: false, no: true, notes: "Maximum 3 digits backwards, shows working memory difficulties" },
      { task: "Verbal 'A' Test", yes: false, no: true, notes: "Generated only 8 words in 60 seconds, below expected for age" }
    ],
    mental_state_notes: `During clinic observation, Aarav presented as an alert and engaging child, with noticeable restlessness. He frequently shifted posture, tapped his feet, and manipulated objects in his hands. At times, he appeared to attempt self-regulation by sitting on his hands, though leg movements continued.
Aarav was able to articulate his thoughts well and maintained appropriate eye contact intermittently. Notably, he demonstrated a tendency to avert gaze during verbal instructions, which he reported helped him “listen better” by reducing distractions. His mother confirmed this strategy was common at home.`,
    inattention: [
      { freq: "Often", impact: "Severe", other: "Academic", criteria: true, notes: "Makes frequent careless errors in maths, struggles to check work" },
      { freq: "Often", impact: "Severe", other: "Academic", criteria: true, notes: "Cannot sustain attention during lessons, particularly maths and reading" },
      { freq: "Often", impact: "Moderate", other: "Social", criteria: true, notes: "Often appears not to listen when spoken to directly" },
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
    other_difficulties: "Sleep onset difficulties; emotional regulation challenges with frustration; occasional explosive reactions to perceived injustices.",
    comorbidities: "Mild anxiety features; sleep-wake dysregulation; consider assessment for specific learning difficulties.",
    other_notes: `Academic: difficulty sustaining attention during reading/writing; rushes work causing errors; disorganisation (messy bag/desk; lost items). 
Home: requires multiple reminders; easily distracted during meals; interrupts conversations. 
Social: well-liked but may disrupt group activities due to excessive talking; gets bored quickly. 
Emotional/Behavioural: occasional explosive reactions; hoards trivial objects citing 'memories'; sleep onset 2–3 hours.`,
    preliminary_summary: "ADHD Combined Presentation (DSM-5)",
    ot: "No",
    ot_details: "",
    slt: "No", 
    slt_details: "",
    cognitive: "Yes",
    cognitive_details: `Conners-4 (summary):
Informant	ADHD-I	ADHD-II	ODD	CD	Probability Score
Self	4/9	1/9	2/8	0/15	28%
Parent	9/9	8/9	6/8	3/15	99%
Teacher	8/9	3/9	0/8	0/13	94%

Consistent pattern of inattentive and hyperactive-impulsive behaviours across settings.`,
    other: "Yes",
    other_details: "Consider paediatric psychology for anxiety management strategies.",
    next_session_type: "Final Consultation and feedback session",
    other_details_ns: "Provide interim strategies for home and school; liaise with school on adjustments.",
    careManager_reminders: "Confirm Conners scores; review school accommodations; prepare management recommendations.",
    personal_info: "Enjoys drawing, building with blocks, swimming, and story audiobooks.",
    additional_notes: "Family highly engaged; parents keen to implement strategies.",
    diagnostic_outcome: "ADHD Combined Presentation (DSM-5)"
  } as any;

  const stage3 = {
    assessment_date: toISO("20.05.25"),
    assessment_time: "",
    location_method: "In-person – PrimaHealth Clinic, Bengaluru",
    client_name_cc: meta.clientName,
    additional_doctors: `Dr. Meera Nair, Consultant Paediatric Neurologist, Sunrise Hospital, Anna Salai, Chennai
Paediatric Cardiology Dept, Sunrise Hospital, Anna Salai, Chennai`,
    diagnosis: [
      "Attention-Deficit Hyperactivity Disorder Combined Presentation (DSM-5)",
    ],
    criteria: [
      "Criterion A: >6/9 symptoms in inattention and/or hyperactivity/impulsivity.",
      "Criterion B: Symptoms were present before age 12.",
      "Criterion C: Criteria are met in two or more settings.",
      "Criterion D: The symptoms are causing impairment in social, academic, and home life.",
      "Criterion E: Co-occurring difficulties considered; sleep/anxiety monitored.",
    ],
    recommendations: `Medical:
• Consider a trial of stimulant medication under close monitoring for migraine exacerbation.
• Continue iron supplementation and monitor ferritin levels quarterly.
Educational:
• Preferential classroom seating away from high-traffic areas.
• Allow for movement breaks every 20–30 minutes.
• Use visual schedules and checklists for organisation.
Behavioural:
• Implement a home “launch pad” area for essential school items.
• Use object trackers (“Tiles”) for frequently misplaced items.
• Consistent positive reinforcement for task completion.
Sleep:
• Introduce a calming bedtime routine, use of white noise or audiobooks.
• Reduce screen exposure at least 60 minutes before bedtime.`,
    aftercare_details: `Review in 8 weeks to assess effectiveness of school strategies and consider initiation of medication if impairment persists. Parents encouraged to liaise with ADHD India Support Group.`,
    additional_notes_final: `Regards,

Dr. Kabir Das
Clinical Director, Consultant Child & Adolescent Psychiatrist
B.Sc (Pharm) MB BCh BAO Dip Clin Leadership MCPsychI MRCPsych`,
  } as any;

  const reportPatch = {
    date: "14 August 2024",
    diagnosis_list: [
      "Attention-Deficit Hyperactivity Disorder Combined Presentation (DSM-5)",
    ],
    plan_dx: [
      "ADHD diagnosis confirmed.",
      "Written recommendations for school provided, focusing on classroom strategies and individual support.",
      "Maintain regular iron supplementation (target serum ferritin > 50 ng/mL).",
      "Recommend a monitored trial of ADHD medication if behavioural strategies are insufficient.",
      "Suggest family participation in ADHD India Support Group and Parent Education Programme.",
      "Daily Omega-3 supplementation (evidence-based moderate support for ADHD)."
    ],
    referralBackground: (stage1 as any).referralBackground,
    medicalHistory: (stage1 as any).medicalHistory,
    medications: (stage1 as any).medications,
    surgicalHistory: (stage1 as any).surgicalHistory,
    allergies: (stage1 as any).allergies,
    familyHistory: (stage1 as any).otherFamilyDetails,
    familyMedicalHistory: (stage1 as any).familyMedicalHistory,
    familyMentalHealth: (stage1 as any).familyMentalHealth,
    familyLearningDifficulties: (stage1 as any).familyLearningDifficulties,
    forensicHistory: (stage1 as any).forensicHistory,
    substanceHistory: (stage1 as any).substanceHistory,
    antenatalDetails: (stage1 as any).antenatalDetails,
    deliveryDetails: (stage1 as any).deliveryDetails,
    postpartumDetails: (stage1 as any).postpartumDetails,
    developmentalMilestones: (stage1 as any).developmentalMilestones,
    householdComposition: (stage1 as any).householdComposition,
    assessmentFindings: "Findings consistent with ADHD Combined Presentation with notable inattentive symptoms and working memory weaknesses.",
    mseFindings: "MSE shows difficulties with reverse digit span, serial tasks, and verbal fluency; attention and concentration difficulties sustained across assessment.",
    inattentionFindings: "All 9 DSM-5 inattention criteria met with significant impairment in academic settings.",
    hyperactivityFindings: "Hyperactivity-impulsivity symptoms present; internal restlessness prominent; interrupts and struggles to wait turn.",
    comorbidFindings: "Mild anxiety features and delayed sleep onset; no evidence of mood disorder or ASD.",
    functionalImpact: "Functional impairment across academic, social, and home domains; disorganisation and task persistence are key barriers.",
    schoolImpact: "Teacher reports incomplete work, difficulty following multi-step instructions, frequent loss of materials, and calling out.",
    homeImpact: "Parents report daily challenges with routines, homework, and sibling interactions.",
    conners_table: {
      self: { adhd_i: "4/9", adhd_ii: "1/9", odd: "2/8", cd: "0/15", prob: "28%" },
      parent: { adhd_i: "9/9", adhd_ii: "8/9", odd: "6/8", cd: "3/15", prob: "99%" },
      teacher: { adhd_i: "8/9", adhd_ii: "3/9", odd: "0/8", cd: "0/13", prob: "94%" },
    },
    recommendations_immediate: [
      "Implement daily visual schedules and routine charts at home",
      "Break tasks into smaller steps with timers (15–20 minute work blocks)",
      "Provide frequent positive reinforcement",
      "Establish quiet, organized study space free from distractions"
    ],
    recommendations_school: [
      "Preferential seating away from distractions",
      "Extended time for tests and assignments (1.5x)",
      "Frequent check-ins and prompts to maintain attention",
      "Break large assignments into smaller components with interim deadlines",
      "Permission to use a fidget tool",
      "Movement breaks every 20–30 minutes"
    ],
    recommendations_longterm: [
      "Medication assessment and trial with paediatric psychiatrist",
      "Educational psychology assessment for learning difficulties",
      "Social skills group if peer difficulties persist",
      "Regular review and adjustment of interventions"
    ],
    prognosis: "With multimodal treatment and supports, prognosis is good; early intervention and family/school engagement are positive factors.",
    followUp: "Follow up in 8 weeks to review progress, consider medication initiation, and monitor overall functioning.",
  } as any;

  return { meta, stage1, stage2, stage3, reportPatch };
}

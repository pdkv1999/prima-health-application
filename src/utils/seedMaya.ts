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
    refNumber: "0001",
    gpName: "Dr. ABC",
    gpAddress:
      "Esculap Medical Centre,\nBallincollig Primary Care Centre,\n55 Old Fort Road,\nBallincollig,\nCork, P31 XN96",
    clientName: "Alex Morgan",
    clientAddress: "71 An Caislean Drive,\nBallincollig, Co. Cork",
    dob: toISO("22.06.14"),
    guardianName: "Parents/Guardians",
    contactNumber: "",
    assessmentDate: toISO("09.04.25"),
    assessmentTime: "",
    assessmentLocation: "On call",
    careManager: "Dr. ABC",
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
    assessment_date: toISO("07.05.25"),
    assessment_time: "",
    location_method:
      "In-person at Western Gateway Building (2.30 – PrimaHealth Office)",
    careManager: meta.careManager,
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
      "Diagnosis of ADHD confirmed",
      "Letter provided for school with practical recommendations",
      "Ensure regular iron supplementation (aim for Serum Ferritin > 50ng/mL)",
      "Recommend trial of ADHD medication treatment",
      "Recommend ADHD Ireland Support Group and Parent Course/programme",
      "Recommend daily Omega-3 fish oils (Moderate level of evidence for ADHD)",
    ],
    referralBackground: stage1.referralBackground,
    medicalHistory: stage1.medicalHistory,
    medications: stage1.medications,
    surgicalHistory: stage1.surgicalHistory,
    allergies: stage1.allergies,
    familyHistory: stage1.otherFamilyDetails,
    forensicHistory: stage1.forensicHistory,
    antenatalDetails: stage1.antenatalDetails,
    deliveryDetails: stage1.deliveryDetails,
    postpartumDetails: stage1.postpartumDetails,
    developmentalMilestones: stage1.developmentalMilestones,
    conners_table: {
      self: { adhd_i: "4/9", adhd_ii: "1/9", odd: "2/8", cd: "0/15", prob: "28%" },
      parent: { adhd_i: "9/9", adhd_ii: "8/9", odd: "6/8", cd: "3/15", prob: "99%" },
      teacher: { adhd_i: "8/9", adhd_ii: "3/9", odd: "0/8", cd: "0/13", prob: "94%" },
    },
  } as any;

  return { meta, stage1, stage2, stage3, reportPatch };
}

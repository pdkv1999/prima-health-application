export const ph25Spec = {
  app: {
    name: "PrimaHealth ADHD Assessment (PH25)",
    storage_key: "ph25_case_demo",
  },
  meta_keys: [
    "refNumber",
    "gpName",
    "gpAddress",
    "clientName",
    "clientAddress",
    "dob",
    "guardianName",
    "contactNumber",
    "assessmentDate",
    "assessmentTime",
    "assessmentLocation",
    "careManager",
  ],
  validation: {
    required: [
      "refNumber",
      "clientName",
      "dob",
      "guardianName",
      "gpName",
      "assessmentDate",
    ],
  },
  home: {
    hourly_rate_default_eur: 180,
    time_hours: { S1: 1.5, S2: 3.0, S3: 1.5, ReportFinalisation: 2.0 },
  },
  stages: {
    stage1: {
      title: "Stage 1 – Parent Intake Call",
      sections: [
        {
          title: "Reference and Contact Information",
          fields: [
            { key: "refNumber", label: "Reference Number (PH25 - )", type: "text" },
            { key: "gpName", label: "GP Name", type: "text" },
            { key: "gpAddress", label: "GP Address", type: "textarea" },
            { key: "clientName", label: "Client/Patient Name", type: "text" },
            { key: "clientAddress", label: "Client/Patient Home Address", type: "textarea" },
            { key: "dob", label: "Date of Birth", type: "date" },
            { key: "guardianName", label: "Guardian/Mother Name", type: "text" },
            { key: "contactNumber", label: "Contact Number", type: "tel" },
            { key: "assessmentDate", label: "Date of Assessment", type: "date" },
            { key: "assessmentTime", label: "Time of Assessment", type: "time" },
            { key: "assessmentLocation", label: "Location/Method of Assessment", type: "text" },
            { key: "careManager", label: "Care Manager Delivering Assessment", type: "text" },
          ],
        },
        { title: "Intro Notes", fields: [{ key: "introNotes", label: "Any Relevant Intro Notes", type: "textarea" }] },
        {
          title: "Present at Assessment",
          fields: [
            { key: "present", label: "Present", type: "checkboxes", options: ["mother", "father","both", "other"] },
            { key: "presentOther", label: "Specify if Other", type: "text" },
          ],
        },
        { title: "Others to CC in Final Report", fields: [{ key: "ccReport", label: "Others to CC", type: "textarea" }] },
        {
          title: "Client Details",
          fields: [
            { key: "handedness", label: "Handedness", type: "select", options: ["", "right", "left", "ambidextrous"] },
            { key: "age", label: "Year & Months", type: "text" },
            { key: "schoolYear", label: "Year in School", type: "text" },
            { key: "school", label: "School", type: "text" },
          ],
        },
        { title: "Referral Background", fields: [{ key: "referralBackground", label: "Details", type: "textarea" }] },
        { title: "Medical History", fields: [{ key: "medicalHistory", label: "Details", type: "textarea" }] },
        { title: "Medications / Supplements", fields: [{ key: "medications", label: "Details", type: "textarea" }] },
        { title: "Past Surgical/Procedural History", fields: [{ key: "surgicalHistory", label: "Details", type: "textarea" }] },
        { title: "Drug Allergies/Intolerances", fields: [{ key: "allergies", label: "Details", type: "textarea" }] },
        { title: "Forensic History", fields: [{ key: "forensicHistory", label: "Details", type: "textarea" }] },
        { title: "Substance History", fields: [{ key: "substanceHistory", label: "Details", type: "textarea" }] },
        {
          title: "Family History",
          fields: [
            { key: "householdComposition", label: "Household Composition", type: "textarea" },
            { key: "otherFamilyDetails", label: "Other Details", type: "textarea" },
            { key: "familyMedicalHistory", label: "Relevant Family History of Medical Issues", type: "textarea" },
            { key: "familyMentalHealth", label: "Relevant Family History of Mental Health Difficulties", type: "textarea" },
            { key: "familyLearningDifficulties", label: "Relevant Family History of Learning Difficulties", type: "textarea" },
          ],
        },
        {
          title: "Pregnancy and Developmental Milestones",
          fields: [
            { key: "antenatalDetails", label: "Antenatal Details", type: "textarea" },
            { key: "deliveryDetails", label: "Delivery Details", type: "textarea" },
            { key: "postpartumDetails", label: "Postpartum Details", type: "textarea" },
            { key: "developmentalMilestones", label: "Developmental Milestones", type: "textarea" },
          ],
        },
        { title: "Additional Notes", fields: [{ key: "additionalNotes", label: "Any Additional Notes", type: "textarea" }] },
        {
          title: "Next Steps",
          fields: [
            {
              key: "assessments",
              label: "Additional Assessments/Investigations",
              type: "group",
              items: [
                { key: "ot", label: "OT", type: "checkbox_with_notes", notes_key: "otDetails" },
                { key: "slt", label: "SLT", type: "checkbox_with_notes", notes_key: "sltDetails" },
                { key: "cognitive", label: "Cognitive", type: "checkbox_with_notes", notes_key: "cognitiveDetails" },
                { key: "other", label: "Other", type: "checkbox_with_notes", notes_key: "otherAssessmentDetails" },
              ],
            },
            { key: "nextSessionType", label: "Next Session Type", type: "text" },
            { key: "otherDetails", label: "Other Details", type: "textarea" },
          ],
        },
      ],
    },
    stage2: {
      title: "Stage 2 – In-Person Consultation",
      sections: [
        {
          title: "Referral & Client Information",
          fields: [
            { key: "ref", label: "Our Ref", type: "text", default_from: "stage1.refNumber" },
            { key: "gp_name", label: "GP Name", type: "text", default_from: "stage1.gpName" },
            { key: "gp_address", label: "GP Address", type: "textarea", default_from: "stage1.gpAddress" },
            { key: "client_name", label: "Client/Patient Name", type: "text", default_from: "stage1.clientName" },
            { key: "client_address", label: "Client/Patient Address", type: "textarea", default_from: "stage1.clientAddress" },
            { key: "dob", label: "Date of Birth", type: "date", default_from: "stage1.dob" },
            { key: "guardian_name", label: "Guardian/Mother Name", type: "text", default_from: "stage1.guardianName" },
          ],
        },
        {
          title: "Assessment Appointment Details",
          fields: [
            { key: "assessment_date", label: "Date of Assessment", type: "date", default_from: "stage1.assessmentDate" },
            { key: "assessment_time", label: "Time of Assessment", type: "time", default_from: "stage1.assessmentTime" },
            { key: "location_method", label: "Location/Method of Assessment", type: "text", default_from: "stage1.assessmentLocation" },
            { key: "careManager", label: "Care Manager Delivering Assessment", type: "text", default_from: "stage1.careManager" },
          ],
        },
        { title: "Reminders from Previous Sessions", fields: [{ key: "previous_reminders", label: "Notes", type: "textarea" }] },
        { title: "Any Relevant Intro Notes", fields: [{ key: "intro_notes", label: "Intro Notes", type: "textarea" }] },
        {
          title: "Mental State Examination",
          fields: [
            {
              key: "mse",
              label: "MSE Table",
              type: "table",
              columns: ["task", "yes", "no", "notes"],
              rows: [
                { task: "Months of the Year Backwards" },
                { task: "Serial Threes" },
                { task: "Digit Span Forward" },
                { task: "Digit Span Reverse" },
                { task: "Verbal “A” Test" },
              ],
            },
            { key: "mental_state_notes", label: "Additional Notes", type: "textarea" },
          ],
        },
        {
          title: "Inattention (9)",
          fields: [
            {
              key: "inattention",
              type: "criteria9",
              items: [
                "Careless mistakes in school work or activities.",
                "Difficulty sustaining attention in tasks or activities.",
                "Not listening when spoken to (dreamy, pre-occupied).",
                "Not following through on instructions; fails to finish work/chores.",
                "Difficulty organizing tasks/activities.",
                "Avoids/dislikes tasks requiring sustained mental effort.",
                "Losing things necessary for school/home.",
                "Easily distracted by external stimuli.",
                "Often forgetful in daily activities.",
              ],
              subfields: ["freq", "impact", "other", "criteria", "notes"],
            },
          ],
        },
        {
          title: "Hyperactivity/Impulsivity (9)",
          fields: [
            {
              key: "hyperimpulsivity",
              type: "criteria9",
              items: [
                "Fidgets, squirms, taps hands/feet.",
                "Unable to remain seated.",
                "Runs/climbs inappropriately (or inner restlessness).",
                "Unable to engage in play/activities quietly.",
                "Often 'on the go' / 'driven by a motor'.",
                "Talks excessively.",
                "Blurts out answers before questions are completed.",
                "Difficulty waiting their turn.",
                "Interrupts or intrudes on others.",
              ],
              subfields: ["freq", "impact", "other", "criteria", "notes"],
            },
          ],
        },
        { title: "Other Areas of Difficulty Related to ADHD", fields: [{ key: "other_difficulties", label: "Notes", type: "textarea" }] },
        { title: "Any Suspected Comorbidities", fields: [{ key: "comorbidities", label: "Notes", type: "textarea" }] },
        { title: "Any Other Notes", fields: [{ key: "other_notes", label: "Notes", type: "textarea" }] },
        {
          title: "Summary of Preliminary ADHD Assessment",
          fields: [
            {
              key: "preliminary_summary",
              label: "Summary",
              type: "select",
              options: [
                "ADHD Predominantly Inattentive Presentation (DSM-5)",
                "ADHD Combined Presentation (DSM-5)",
                "ADHD Predominantly Hyperactive-Impulsive Presentation (DSM-5)",
                "ADHD Inattentive Presentation (DSM-5)",
                "ADHD Hyperactive-Impulsive Presentation (DSM-5)",
                "ADHD Other Specified",
                "Inconclusive",
              ],
            },
          ],
        },
        {
          title: "Next Steps",
          fields: [
            { key: "ot", label: "OT?", type: "radio_yes_no" },
            { key: "ot_details", label: "Details if Yes", type: "textarea" },
            { key: "slt", label: "SLT?", type: "radio_yes_no" },
            { key: "slt_details", label: "Details if Yes", type: "textarea" },
            { key: "cognitive", label: "Cognitive?", type: "radio_yes_no" },
            { key: "cognitive_details", label: "Details if Yes", type: "textarea" },
            { key: "other", label: "Other?", type: "radio_yes_no" },
            { key: "other_details", label: "Details if Yes", type: "textarea" },
            { key: "next_session_type", label: "Next Session Type?", type: "text" },
            { key: "other_details_ns", label: "Other Details", type: "textarea" },
            { key: "careManager_reminders", label: "Care Manager reminders for next appointment?", type: "textarea" },
            { key: "personal_info", label: "Personal info to lead with next appointment?", type: "textarea" },
            { key: "additional_notes", label: "Any additional relevant notes?", type: "textarea" },
          ],
        },
        {
          title: "Diagnostic Outcome",
          fields: [
            {
              key: "diagnostic_outcome",
              label: "Diagnostic Outcome",
              type: "select",
              options: [
                "ADHD Predominantly Inattentive Presentation (DSM-5)",
                "ADHD Combined Presentation (DSM-5)",
                "ADHD Predominantly Hyperactive-Impulsive Presentation (DSM-5)",
                "ADHD Inattentive Presentation (DSM-5)",
                "ADHD Hyperactive-Impulsive Presentation (DSM-5)",
                "ADHD Other Specified",
                "ADHD Unspecified Presentation",
                "Likely ADHD but further information required",
                "Presentation consistent with ADHD but inconclusive",
                "Presentation does not meet full ADHD diagnostic criteria",
                "Presentation likely influenced by other factors (e.g., trauma, ASD)",
                "Inconclusive - Consider further cognitive assessment",
              ],
            },
          ],
        },
      ],
    },
    stage3: {
      title: "Stage 3 – Final Assessment & Feedback",
      sections: [
        {
          title: "Referral & Client Information",
          fields: [
            { key: "ref_number", label: "Our Ref", type: "text", default_from: "stage1.refNumber" },
            { key: "gp_name", label: "GP Name", type: "text", default_from: "stage1.gpName" },
            { key: "gp_address", label: "GP Address", type: "textarea", default_from: "stage1.gpAddress" },
            { key: "client_name_cc", label: "cc: Parent(s)/Guardian(s) of", type: "text", default_from: "stage1.clientName" },
            { key: "additional_doctors", label: "Additional Doctors (if relevant)", type: "textarea" },
            { key: "client_name", label: "Client Name", type: "text", default_from: "stage1.clientName" },
            { key: "client_address", label: "Client Address", type: "textarea", default_from: "stage1.clientAddress" },
            { key: "dob", label: "Date of Birth", type: "date", default_from: "stage1.dob" },
            { key: "guardian_name", label: "Guardian/Mother Name", type: "text", default_from: "stage1.guardianName" },
            
            { key: "assessment_date", label: "Date of Assessment", type: "date", default_from: "stage2.assessment_date" },
            { key: "assessment_time", label: "Time of Assessment", type: "time", default_from: "stage2.assessment_time" },
            { key: "location_method", label: "Location/Method of Assessment", type: "text", default_from: "stage2.location_method" },
            { key: "careManager", label: "Care Manager Delivering Assessment", type: "text", default_from: "stage1.careManager" },
          ],
        },
        {
          title: "Mental State Examination - Serial Recitation Tasks",
          fields: [
            {
              key: "mse",
              label: "MSE Table",
              type: "table",
              columns: ["task", "yes", "no", "notes"],
              rows: [
                { task: "Months of the Year Backwards" },
                { task: "Serial Threes" },
                { task: "Digit Span Forward" },
                { task: "Digit Span Reverse" },
                { task: "Verbal “A” Test" },
              ],
            },
            { key: "mental_state_details", label: "Additional Details", type: "textarea" },
          ],
        },
        {
          title: "Diagnosis and Management Plan",
          fields: [
            {
              key: "diagnosis",
              label: "Diagnosis",
              type: "checkboxes",
              options: [
                "ADHD Predominantly Inattentive Presentation (DSM - 5)",
                "ADHD Combined Presentation (DSM - 5)",
                "ADHD Predominantly Hyperactive-Impulsive Presentation (DSM - 5)",
                "ADHD Hyperactive-Impulsive Presentation (DSM - 5)",
                "ADHD Other Specified",
                "Inconclusive",
              ],
            },
            { key: "other_diagnosis", label: "Other Diagnosis(es)", type: "textarea" },
            {
              key: "criteria",
              label: "DSM-5 Criteria",
              type: "checkboxes_labeled",
              options: [
                "Criterion A: >6/9 symptoms in inattention and/or hyperactivity/impulsivity",
                "Criterion B: Symptoms were present before age 7/12",
                "Criterion C: Criteria are met in two or more settings",
                "Criterion D: Symptoms are causing impairment in social, academic, and home life",
                "Criterion E: Co-occurring difficulties considered",
              ],
            },
            { key: "criteria_details", label: "Criteria Details", type: "textarea" },
          ],
        },
        {
          title: "Plan & Aftercare",
          fields: [
            {
              key: "plan_dx",
              label: "Diagnosis Plan",
              type: "checkboxes",
              options: [
                "Diagnosis of ADHD (DD.MM.YYYY)",
                "Diagnosis of ADHD confirmed (DD.MM.YYYY)",
                "Inconclusive diagnosis. Separate plan needed.",
              ],
            },
            {
              key: "psychoeducation",
              label: "Psychoeducation",
              type: "checkboxes",
              options: [
                "Psycho-education on diagnosis & implications",
                "Pharmacological vs non-pharmacological interventions",
                "Parents Plus via ADHD Ireland",
                "Need for routine/structure",
                "DARE Scheme reminder",
              ],
            },
            {
              key: "med_investigations",
              label: "Further Medical Investigations",
              type: "group",
              items: [
                { key: "gp_followup", label: "Recommend GP follow up on concerns regarding", type: "text" },
                { key: "bloods", label: "Request blood investigations: FBC, B12, Ferritin, Folate, Renal, LFTs, TFTs, repeat Coeliac Serology", type: "checkbox" },
                { key: "med_other_details", label: "Other (add details)", type: "textarea" },
              ],
            },
            {
              key: "next_steps_aftercare",
              label: "Next Steps & Aftercare",
              type: "group",
              items: [
                { key: "review_time", label: "Review in (text)", type: "text" },
                { key: "medication_trial", label: "Commenced medication trial (free text)", type: "text" },
                {
                  key: "aftercare_checks",
                  label: "Aftercare Checks",
                  type: "checkboxes",
                  options: [
                    "Trial of ADHD medication treatment",
                    "Omega-3 Fish Oils recommendation",
                    "Iron Supplementation (Ferritin > 50ng/dL)",
                  ],
                },
              ],
            },
            {
              key: "allied_health",
              label: "Further Allied Health Assessments & Interventions",
              type: "checkboxes",
              options: [
                "Cognitive & Educational assessment",
                "ASD assessment",
                "Speech and Language assessment",
                "Talking therapies after therapeutic dose",
                "CBT first-line; low threshold for SSRI",
                "OT input for motor coordination",
                "Speech and Language intervention",
              ],
            },
            { key: "allied_details", label: "Allied Details", type: "textarea" },
          ],
        },
      ],
    },
  },
  prepopulate_rules: [
    { from: "stage1.refNumber", to: ["stage2.ref", "stage3.ref_number"] },
    { from: "stage1.gpName", to: ["stage2.gp_name", "stage3.gp_name"] },
    { from: "stage1.gpAddress", to: ["stage2.gp_address", "stage3.gp_address"] },
    { from: "stage1.clientName", to: ["stage2.client_name", "stage3.client_name", "stage3.client_name_cc"] },
    { from: "stage1.clientAddress", to: ["stage2.client_address", "stage3.client_address"] },
    { from: "stage1.dob", to: ["stage2.dob", "stage3.dob"] },
    { from: "stage1.guardianName", to: ["stage2.guardian_name", "stage3.guardian_name"] },
    { from: "stage1.contactNumber", to: ["stage2.contact_number", "stage3.contact_number"] },
    { from: "stage1.assessmentDate", to: ["stage2.assessment_date", "stage3.assessment_date"] },
    { from: "stage1.assessmentTime", to: ["stage2.assessment_time", "stage3.assessment_time"] },
    { from: "stage1.assessmentLocation", to: ["stage2.location_method", "stage3.location_method"] },
    { from: "stage1.careManager", to: ["stage2.careManager", "stage3.careManager"] },

    { from: "stage1.referralBackground", to: ["report.referralBackground"] },
    { from: "stage1.medicalHistory", to: ["report.medicalHistory"] },
    { from: "stage1.medications", to: ["report.medications"] },
    { from: "stage1.surgicalHistory", to: ["report.surgicalHistory"] },
    { from: "stage1.allergies", to: ["report.allergies"] },
    { from: "stage1.forensicHistory", to: ["report.forensicHistory"] },
    { from: "stage1.substanceHistory", to: ["report.substanceHistory"] },
    { from: "stage1.householdComposition", to: ["report.familyHistory"] },
    { from: "stage1.otherFamilyDetails", to: ["report.otherFamilyDetails"] },
    { from: "stage1.familyMedicalHistory", to: ["report.familyMedicalHistory"] },
    { from: "stage1.familyMentalHealth", to: ["report.familyMentalHealth"] },
    { from: "stage1.familyLearningDifficulties", to: ["report.familyLearningDifficulties"] },
    { from: "stage1.antenatalDetails", to: ["report.antenatalDetails"] },
    { from: "stage1.deliveryDetails", to: ["report.deliveryDetails"] },
    { from: "stage1.postpartumDetails", to: ["report.postpartumDetails"] },
    { from: "stage1.developmentalMilestones", to: ["report.developmentalMilestones"] },
    { from: "stage1.additionalNotes", to: ["report.additionalNotes"] },

    { from: "stage2.mse", to: ["report.mse"], condition: "use if stage3.mse empty" },
    { from: "stage2.inattention", to: ["report.inattention"] },
    { from: "stage2.hyperimpulsivity", to: ["report.hyperimpulsivity"] },
    { from: "stage2.other_difficulties", to: ["report.other_difficulties"] },
    { from: "stage2.comorbidities", to: ["report.comorbidities"] },
    { from: "stage2.diagnostic_outcome", to: ["report.diagnostic_outcome"] },
    { from: "stage2.preliminary_summary", to: ["report.preliminary_summary"] },
    { from: "stage2.next_session_type", to: ["report.next_session_type"] },

    { from: "stage3.mse", to: ["report.mse"] },
    { from: "stage3.diagnosis", to: ["report.diagnosis_list"] },
    { from: "stage3.criteria", to: ["report.criteria_checked"] },
    { from: "stage3.criteria_details", to: ["report.criteria_details"] },
    { from: "stage3.plan_dx", to: ["report.plan_dx"] },
    { from: "stage3.next_steps_aftercare", to: ["report.aftercare_block"] },
    { from: "stage3.allied_health", to: ["report.allied_health"] },
  ],
  report_template: {
html: `
<style>
  :root { --text:#111; --muted:#4b5563; }
  .page { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Inter, Roboto, "Helvetica Neue", Arial; color: var(--text); line-height:1.6; }
  .page * { font-family: inherit; }
  .letterhead { display:flex; align-items:flex-start; justify-content:space-between; gap:24px; margin-bottom:24px; }
  .brand { font-size:28px; font-weight:700; color:#39A0D8; }
  .contact { text-align:right; font-size:12px; }
  .date { margin:24px 0 16px; }
  .addr { white-space:pre-line; }
  .small { font-size:12px; color: var(--muted); }
  .re { margin-top:16px; }
  .bold { font-weight:700 !important; }
  .hr { border:0; border-top:2px solid #111; margin:20px 0; }
  .two-col { display:grid; gap:24px; }
  h1, h2, h3, h4, h5, h6 { font-weight:700 !important; font-family: inherit !important; }
  h2 { font-size:18px !important; margin:18px 0 2px !important; font-weight:700 !important; color: var(--text) !important; }
  .criteria-list p { font-weight:400; margin:4px 0; }
  .criteria-list strong { font-weight:700 !important; }
  ol { padding-left:1.25rem; }
  table { width:100%; border-collapse:collapse; }
  th, td { border:1px solid #e5e7eb; padding:8px; font-size:14px; }
  th { background:#f3f4f6; font-weight:600; }
  .note { font-size:12px; color: var(--muted); margin-top:8px; }
</style>
<div class="page">
  <header class="letterhead">
    <img src="/lovable-uploads/7d76cd81-c766-43ee-aa30-c664357d974a.png" alt="PrimaHealth logo" style="max-height:100px; height:auto; width:auto; object-fit:contain; display:block;" />
    <div class="contact">
      2.30 Western Gateway Building<br/>
      University College Cork<br/>
      Western Road, Cork<br/>
      T12 XF62<br/>
      <br/>
      087 394 3349<br/>
      info@PrimaHealth.ie
    </div>
  </header>

  <div class="date">{{report.date}}</div>

  <div class="addr"><span class="bold">{{meta.gpName}}</span>\n{{meta.gpAddress}}</div>
  <div class="small addr"><span class="bold">cc:</span> Parents/Guardians of {{stage3.client_name_cc}}\n{{stage3.additional_doctors}}</div>

  <div class="re">
    <span class="bold">Re:</span> <span class="bold">{{meta.clientName}}</span>, <span class="bold addr">{{meta.clientAddress}}</span><br/>
    <span class="bold">Date of Birth:</span> {{meta.dob}} &nbsp;&nbsp;&nbsp; <span class="bold">Our Ref:</span> PH25 - {{meta.refNumber}}
  </div>

  <div class="re"><span class="bold">Diagnosis:</span> {{report.diagnosis_list; join='; '}}</div>

  <h2>Plan:</h2>
  <ol>{{report.plan_dx | list}}</ol>

  <hr class="hr"/>

  <p>Dear {{meta.gpName}},</p>
  <p>
    Thank you for referring {{meta.clientName}} ({{stage1.handedness}} handed, {{stage1.age}}, {{stage1.schoolYear}} at {{stage1.school}}) for an ADHD assessment.
    An initial intake call was completed on {{stage1.assessmentDate}}. I met the family for clinical assessment on {{stage2.assessment_date}} and provided feedback on {{stage3.assessment_date}}. A summary of my assessment is enclosed below.
  </p>

  <div class="two-col">
    <section>
      <h2>Referral Background</h2>
      <div class="addr">{{report.referralBackground}}</div>

      <h2>Medical History</h2>
      <div class="addr">{{report.medicalHistory}}</div>

      <h2>Medications and Supplements</h2>
      <div class="addr">{{report.medications}}</div>

      <h2>Past Surgical History</h2>
      <div class="addr">{{report.surgicalHistory}}</div>

      <h2>Drug Allergies</h2>
      <div class="addr">{{report.allergies}}</div>

      <h2>Family History</h2>
      <div class="addr">{{report.familyHistory}}</div>
      <div class="addr">{{report.familyMedicalHistory}}</div>
      <div class="addr">{{report.familyMentalHealth}}</div>
      <div class="addr">{{report.familyLearningDifficulties}}</div>
      <div class="addr">{{report.otherFamilyDetails}}</div>

      <h2>Forensic History</h2>
      <div class="addr">{{report.forensicHistory}}</div>

      <h2>Pregnancy and Developmental Milestones</h2>
      <div class="addr">{{report.antenatalDetails}} {{report.deliveryDetails}} {{report.postpartumDetails}} {{report.developmentalMilestones}}</div>
    </section>

    <aside>
      <h2>Conners - 4 Report</h2>
      <table>
        <tr>
          <th></th><th>ADHD-I</th><th>ADHD-II</th><th>ODD</th><th>CD</th><th>Probability Score</th>
        </tr>
        <tr>
          <td>Self-Report</td>
          <td>{{report.conners_table.self.adhd_i}}</td>
          <td>{{report.conners_table.self.adhd_ii}}</td>
          <td>{{report.conners_table.self.odd}}</td>
          <td>{{report.conners_table.self.cd}}</td>
          <td>{{report.conners_table.self.prob}}</td>
        </tr>
        <tr>
          <td>Parent</td>
          <td>{{report.conners_table.parent.adhd_i}}</td>
          <td>{{report.conners_table.parent.adhd_ii}}</td>
          <td>{{report.conners_table.parent.odd}}</td>
          <td>{{report.conners_table.parent.cd}}</td>
          <td>{{report.conners_table.parent.prob}}</td>
        </tr>
        <tr>
          <td>Teacher</td>
          <td>{{report.conners_table.teacher.adhd_i}}</td>
          <td>{{report.conners_table.teacher.adhd_ii}}</td>
          <td>{{report.conners_table.teacher.odd}}</td>
          <td>{{report.conners_table.teacher.cd}}</td>
          <td>{{report.conners_table.teacher.prob}}</td>
        </tr>
      </table>
      <div class="note">Note. ADHD-I = Inattention symptoms; ADHD-II = hyperactivity/impulsivity symptoms; ODD = oppositional defiant disorder symptoms; CD = conduct disorder symptoms.</div>
    </section>

    <aside></aside>
  </div>

  <h2>Clinical Assessment and Reported History</h2>
  <div class="addr">{{report.other_difficulties}}</div>

  <h2>Diagnosis and Management Plan</h2>
  <div class="criteria-list">
    <p><strong>Criterion A:</strong> &gt;6/9 symptoms in inattention and/or hyperactivity/impulsivity</p>
    <p><strong>Criterion B:</strong> Symptoms were present before age 7/12</p>
    <p><strong>Criterion C:</strong> Criteria are met in two or more settings</p>
    <p><strong>Criterion D:</strong> Symptoms are causing impairment in social, academic, and home life</p>
    <p><strong>Criterion E:</strong> Co-occurring difficulties considered</p>
  </div>
  <div class="addr">{{report.criteria_details}}</div>

  <p>If you have any questions or concerns, please do not hesitate to contact me at the clinic.</p>
  <p>Regards,</p>
  <br/>
  <p>____________________</p>
  <p>Dr. {{meta.careManager}}</p>
  <p>Clinical Director, Consultant Child & Adolescent Psychiatrist</p>
</div>
`,
  initial_state: {
    meta: {
      refNumber: "000",
      gpName: "Dr. Sample GP",
      gpAddress: "Sample Practice,\nSample Address Line,\nCity, Postcode",
      clientName: "Sample Patient",
      clientAddress: "Sample Address Line,\nCity, County",
      dob: "2014-01-01",
      guardianName: "Sample Guardian",
      contactNumber: "+353 00 000 0000",
      assessmentDate: "2025-08-01",
      assessmentTime: "10:00",
      assessmentLocation: "Stage 1: Intake call (Telehealth)",
      careManager: "Dr. Sample Clinician",
    },
    stage1: {
      refNumber: "000",
      gpName: "Dr. Sample GP",
      gpAddress: "Sample Practice,\nSample Address Line,\nCity, Postcode",
      clientName: "Sample Patient",
      clientAddress: "Sample Address Line,\nCity, County",
      dob: "2014-01-01",
      guardianName: "Sample Guardian",
      contactNumber: "+353 00 000 0000",
      assessmentDate: "2025-08-01",
      assessmentTime: "10:00",
      assessmentLocation: "On call",
      careManager: "Dr. Sample Clinician",
      introNotes: "",
      present: ["both"],
      ccReport: "",
      handedness: "right",
      age: "10 years 0 months",
      schoolYear: "4th Class",
      school: "Sample Primary School",
      referralBackground: "",
      medicalHistory: "",
      medications: "",
      surgicalHistory: "",
      allergies: "",
      forensicHistory: "",
      substanceHistory: "",
      householdComposition: "",
      otherFamilyDetails: "",
      familyMedicalHistory: "",
      familyMentalHealth: "",
      familyLearningDifficulties: "",
      antenatalDetails: "",
      deliveryDetails: "",
      postpartumDetails: "",
      developmentalMilestones: "",
      additionalNotes: "",
      assessments: {
        ot: false,
        otDetails: "",
        slt: false,
        sltDetails: "",
        cognitive: false,
        cognitiveDetails: "",
        other: false,
        otherAssessmentDetails: "",
      },
      nextSessionType: "Stage 2 – In-person",
      otherDetails: "",
    },
    stage2: {
      assessment_date: "2025-08-15",
      assessment_time: "14:00",
      location_method: "In-person at Western Gateway Building (2.30 – PrimaHealth Office)",
      careManager: "Dr. Sarah Johnson",
      mse: [
        { task: "Months of the Year Backwards", yes: true, no: false, notes: "Needed one prompt" },
        { task: "Serial Threes", yes: true, no: false, notes: "Minor errors" },
        { task: "Digit Span Forward", yes: true, no: false, notes: "4 digits" },
        { task: "Digit Span Reverse", yes: false, no: true, notes: "Difficulty with reverse" },
        { task: "Verbal “A” Test", yes: true, no: false, notes: "Within expectations" },
      ],
      mental_state_notes: "Alert, oriented; mild distractibility.",
      inattention: {
        1: { freq: true, impact: true, other: false, criteria: true, notes: "Careless math mistakes" },
        2: { freq: true, impact: true, other: false, criteria: true, notes: "Struggles with homework" },
        3: { freq: true, impact: true, other: false, criteria: true, notes: "Appears preoccupied" },
        4: { freq: true, impact: true, other: false, criteria: true, notes: "Needs repeated instructions" },
        5: { freq: true, impact: true, other: false, criteria: true, notes: "Poor organisation" },
        6: { freq: true, impact: true, other: false, criteria: true, notes: "Avoids sustained tasks" },
        7: { freq: true, impact: true, other: false, criteria: true, notes: "Loses stationery" },
        8: { freq: true, impact: true, other: false, criteria: true, notes: "Distracted by noise" },
        9: { freq: true, impact: true, other: false, criteria: true, notes: "Forgets daily tasks" },
      },
      hyperimpulsivity: {
        1: { freq: true, impact: true, other: false, criteria: true, notes: "Fidgets in class" },
        2: { freq: true, impact: true, other: false, criteria: true, notes: "Leaves seat often" },
        3: { freq: false, impact: false, other: false, criteria: false, notes: "" },
        4: { freq: true, impact: true, other: false, criteria: true, notes: "Noisy play" },
        5: { freq: true, impact: true, other: false, criteria: true, notes: "Always on the go" },
        6: { freq: true, impact: true, other: false, criteria: true, notes: "Talks over peers" },
        7: { freq: true, impact: true, other: false, criteria: true, notes: "Blurts answers" },
        8: { freq: true, impact: true, other: false, criteria: true, notes: "Impatient in queues" },
        9: { freq: true, impact: true, other: false, criteria: true, notes: "Interrupts conversations" },
      },
      other_difficulties: "Organisation skills; homework planning.",
      comorbidities: "Rule out ASD; monitor anxiety symptoms.",
      preliminary_summary: "ADHD Combined Presentation (DSM-5)",
      diagnostic_outcome: "Likely ADHD but further information required",
      next_session_type: "Stage 3 – Feedback",
      careManager_reminders: "Bring Conners summary; confirm teacher call notes.",
      personal_info: "Enjoys soccer; mention recent match.",
      additional_notes: "Parent to share teacher email.",
    },
    stage3: {
      assessment_date: "2025-08-22",
      assessment_time: "11:00",
      location_method: "In-person – same office",
      mse: [
        { task: "Months of the Year Backwards", yes: true, no: false, notes: "Fluent" },
        { task: "Serial Threes", yes: true, no: false, notes: "Accurate" },
        { task: "Digit Span Forward", yes: true, no: false, notes: "5 digits" },
        { task: "Digit Span Reverse", yes: false, no: true, notes: "Persistent difficulty" },
        { task: "Verbal “A” Test", yes: true, no: false, notes: "Appropriate" },
      ],
      diagnosis: ["ADHD Combined Presentation (DSM - 5)"],
      other_diagnosis: "",
      criteria: [
        "Criterion A: >6/9 symptoms in inattention and/or hyperactivity/impulsivity",
        "Criterion B: Symptoms were present before age 7/12",
        "Criterion C: Criteria are met in two or more settings",
        "Criterion D: Symptoms are causing impairment in social, academic, and home life",
        "Criterion E: Co-occurring difficulties considered",
      ],
      criteria_details: "Parent and teacher reports consistent; impairment across home and school.",
      plan_dx: ["Diagnosis of ADHD confirmed (DD.MM.YYYY)"],
      psychoeducation: [
        "Psycho-education on diagnosis & implications",
        "Pharmacological vs non-pharmacological interventions",
        "Need for routine/structure",
        "DARE Scheme reminder",
      ],
      med_investigations: {
        gp_followup: "Sleep hygiene; nutrition; vision screen.",
        bloods: true,
        med_other_details: "",
      },
      next_steps_aftercare: {
        review_time: "8 weeks or sooner if needed",
        medication_trial: "Methylphenidate IR 5mg mane; titrate per response",
        aftercare_checks: [
          "Trial of ADHD medication treatment",
          "Omega-3 Fish Oils recommendation",
          "Iron Supplementation (Ferritin > 50ng/dL)",
        ],
      },
      allied_health: [
        "Cognitive & Educational assessment",
        "Speech and Language assessment",
        "OT input for motor coordination",
      ],
      allied_details: "Coordinate with school SEN for supports.",
    },
report: {
  date: "22.08.2025",
  referralBackground: "Referred by GP; concerns include distractibility and hyperactivity affecting academic progress.",
  medicalHistory: "Unremarkable; vaccinations up to date.",
  medications: "None at baseline.",
  surgicalHistory: "No surgeries.",
  allergies: "Pollen only.",
  familyHistory: "Paternal ADHD; maternal anxiety.",
  substanceHistory: "N/A.",
  forensicHistory: "N/A.",
  antenatalDetails: "Normal pregnancy.",
  deliveryDetails: "Uncomplicated vaginal delivery.",
  postpartumDetails: "Healthy neonate.",
  developmentalMilestones: "Gross/fine motor within expected range.",
  other_difficulties: "Organisation and homework planning challenges. Include detailed clinical narrative here.",
  criteria_checked: [
    "Criterion A: >6/9 symptoms in inattention and/or hyperactivity/impulsivity",
    "Criterion B: Symptoms were present before age 7/12",
    "Criterion C: Criteria are met in two or more settings",
    "Criterion D: Symptoms are causing impairment in social, academic, and home life",
    "Criterion E: Co-occurring difficulties considered",
  ],
  criteria_details: "Symptoms longstanding; cross-context; functional impairment confirmed. Expand with rich details as needed.",
  diagnosis_list: ["ADHD Combined Presentation (DSM - 5)"],
  plan_dx: [
    "Diagnosis of ADHD confirmed (22.08.2025)",
    "Letter provided for school with practical recommendations",
    "Ensure regular iron supplementation (aim for Serum Ferritin > 50ng/mL)",
    "Recommend trial of ADHD medication treatment",
    "Recommend ADHD Ireland Support Group and Parent Course/programme",
    "Recommend daily Omega-3 fish oils (Moderate level of evidence for ADHD)",
  ],
  conners_table: {
    self:    { adhd_i: "4/9", adhd_ii: "1/9", odd: "2/8", cd: "0/15", prob: "28%" },
    parent:  { adhd_i: "9/9", adhd_ii: "8/9", odd: "6/8", cd: "3/15", prob: "99%" },
    teacher: { adhd_i: "8/9", adhd_ii: "3/9", odd: "0/8", cd: "0/13", prob: "94%" },
  },
  aftercare_block: {
    review_time: "8 weeks or sooner",
    medication_trial: "Methylphenidate IR 5mg mane; titrate per response",
    aftercare_checks: [
      "Medication trial",
      "Omega-3 recommendation",
      "Iron Supplementation",
    ],
  },
  allied_health: [
    "Cognitive & Educational assessment",
    "Speech and Language assessment",
    "OT input for motor coordination",
  ],
},
  },
}} as const;

export type Ph25Spec = typeof ph25Spec;

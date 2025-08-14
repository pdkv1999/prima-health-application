// Enhanced report template with complete content and highlighting
export const reportTemplate = `
<div class="medical-report">
  <header class="report-header">
    <div class="clinic-info">
      <h1>PrimaHealth ADHD Assessment (PH25)</h1>
      <p>Clinical Director: <span data-bind="rb_careManager" id="rb_careManager">{{meta.careManager}}</span></p>
      <p>Date: <span data-bind="rb_assessmentDate" id="rb_assessmentDate">{{meta.assessmentDate}}</span></p>
    </div>
  </header>

  <div class="recipient-info">
    <p><strong>To:</strong> <span data-bind="rb_gpName" id="rb_gpName">{{meta.gpName}}</span><br>
    <span data-bind="rb_gpAddress" id="rb_gpAddress">{{meta.gpAddress}}</span></p>
    
    <p><strong>cc:</strong> Parents of <span data-bind="rb_clientName" id="rb_clientName">{{meta.clientName}}</span><br>
    <span data-bind="rb_additionalDoctors" id="rb_additionalDoctors">{{stage3.additional_doctors}}</span></p>
  </div>

  <div class="patient-info">
    <p><strong>Re:</strong> <span data-bind="rb_clientName" id="rb_clientName_2">{{meta.clientName}}</span>, <span data-bind="rb_clientAddress" id="rb_clientAddress">{{meta.clientAddress}}</span><br>
    <strong>Date of Birth:</strong> <span data-bind="rb_dob" id="rb_dob">{{meta.dob}}</span> &nbsp;&nbsp; <strong>Our Ref:</strong> <span data-bind="rb_refNumber" id="rb_refNumber">{{meta.refNumber}}</span><br>
    <strong>Diagnosis:</strong> <span data-bind="rb_diagnosticOutcome" id="rb_diagnosticOutcome">{{stage2.diagnostic_outcome}}</span></p>
  </div>

  <section class="plan-summary">
    <h2>Plan Summary</h2>
    <ul>
      <li>ADHD diagnosis confirmed.</li>
      <li>Written recommendations for school provided, focusing on classroom strategies and individual support.</li>
      <li>Maintain regular iron supplementation (target serum ferritin > 50 ng/mL).</li>
      <li>Recommend a monitored trial of ADHD medication if behavioural strategies are insufficient.</li>
      <li>Suggest family participation in ADHD India Support Group and Parent Education Programme.</li>
      <li>Daily Omega-3 supplementation (evidence-based moderate support for ADHD).</li>
    </ul>
  </section>

  <section class="introduction">
    <h2>1. Introduction and Referral Background</h2>
    <p><span data-bind="rb_referralBackground" id="rb_referralBackground">{{stage1.referralBackground}}</span></p>
    
    <p>An initial telephone intake was conducted on 09.04.25 with both parents present, followed by a clinical evaluation with <span data-bind="rb_clientName" id="rb_clientName_3">{{meta.clientName}}</span> and his mother on 07.05.25. A comprehensive cognitive assessment was completed by Dr. Raj Verma (Senior Educational Psychologist) on 12.05.25, with results reviewed jointly on 20.05.25. The assessment process included direct observation, structured interviews, behavioural questionnaires (Conners-4), and collateral input from school staff.</p>
  </section>

  <section class="medical-history">
    <h2>2. Developmental and Medical History</h2>
    
    <h3>Pregnancy & Birth:</h3>
    <p><span data-bind="rb_antenatalDetails" id="rb_antenatalDetails">{{stage1.antenatalDetails}}</span> <span data-bind="rb_deliveryDetails" id="rb_deliveryDetails">{{stage1.deliveryDetails}}</span> <span data-bind="rb_postpartumDetails" id="rb_postpartumDetails">{{stage1.postpartumDetails}}</span></p>
    
    <h3>Early Development:</h3>
    <p><span data-bind="rb_developmentalMilestones" id="rb_developmentalMilestones">{{stage1.developmentalMilestones}}</span></p>
    
    <h3>Medical Conditions:</h3>
    <p><span data-bind="rb_medicalHistory" id="rb_medicalHistory">{{stage1.medicalHistory}}</span></p>
    
    <h3>Medications:</h3>
    <p><span data-bind="rb_medications" id="rb_medications">{{stage1.medications}}</span></p>
  </section>

  <section class="family-background">
    <h2>3. Family and Social Background</h2>
    <p><span data-bind="rb_householdComposition" id="rb_householdComposition">{{stage1.householdComposition}}</span> <span data-bind="rb_familyMentalHealth" id="rb_familyMentalHealth">{{stage1.familyMentalHealth}}</span></p>
    
    <p><span data-bind="rb_familyMedicalHistory" id="rb_familyMedicalHistory">{{stage1.familyMedicalHistory}}</span> <span data-bind="rb_familyLearningDifficulties" id="rb_familyLearningDifficulties">{{stage1.familyLearningDifficulties}}</span></p>
  </section>

  <section class="assessment-results">
    <h2>4. Behavioural Assessment – Conners-4</h2>
    <table class="assessment-table">
      <thead>
        <tr>
          <th>Informant</th>
          <th>ADHD-I</th>
          <th>ADHD-II</th>
          <th>ODD</th>
          <th>CD</th>
          <th>Probability Score</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Self</td>
          <td>4/9</td>
          <td>1/9</td>
          <td>2/8</td>
          <td>0/15</td>
          <td>28%</td>
        </tr>
        <tr>
          <td>Parent</td>
          <td>9/9</td>
          <td>8/9</td>
          <td>6/8</td>
          <td>3/15</td>
          <td>99%</td>
        </tr>
        <tr>
          <td>Teacher</td>
          <td>8/9</td>
          <td>3/9</td>
          <td>0/8</td>
          <td>0/13</td>
          <td>94%</td>
        </tr>
      </tbody>
    </table>
    <p>Scores from multiple informants indicate a consistent pattern of inattentive and hyperactive-impulsive behaviours, particularly noted by parents and teachers.</p>
  </section>

  <section class="clinical-observations">
    <h2>5. Clinical Observations</h2>
    <p><span data-bind="rb_mentalStateNotes" id="rb_mentalStateNotes">{{stage2.mental_state_notes}}</span></p>
  </section>

  <section class="functional-impact">
    <h2>6. Reported Functional Impact</h2>
    
    <h3>Academic:</h3>
    <p>• Difficulty sustaining attention during reading and written tasks.</p>
    <p>• Frequently rushes work, resulting in avoidable errors.</p>
    <p>• Disorganisation: school bag and desk consistently messy, leading to misplaced items and incomplete homework submissions.</p>
    
    <h3>Home:</h3>
    <p>• Requires multiple reminders to complete simple tasks.</p>
    <p>• Easily distracted during meals and conversations.</p>
    <p>• Frequently interrupts others in conversation due to fear of forgetting his point.</p>
    
    <h3>Social:</h3>
    <p>• Well-liked by peers but sometimes disrupts group activities by excessive talking or inability to wait his turn.</p>
    <p>• Easily bored with activities, including video games, which he abandons quickly.</p>
    
    <h3>Emotional/Behavioural:</h3>
    <p><span data-bind="rb_otherDifficulties" id="rb_otherDifficulties">{{stage2.other_difficulties}}</span></p>
  </section>

  <section class="teacher-perspective">
    <h2>7. Teacher's Perspective</h2>
    <p><span data-bind="rb_teacherNotes" id="rb_teacherNotes">{{stage2.other_notes}}</span></p>
  </section>

  <section class="clinical-formulation">
    <h2>8. Clinical Formulation</h2>
    <p><span data-bind="rb_criteriaDetails" id="rb_criteriaDetails">{{stage3.criteria_details}}</span></p>
    
    <p><span data-bind="rb_comorbidities" id="rb_comorbidities">{{stage2.comorbidities}}</span></p>
  </section>

  <section class="recommendations">
    <h2>9. Recommendations</h2>
    <p><span data-bind="rb_recommendations" id="rb_recommendations">{{stage3.recommendations}}</span></p>
    
    <h3>Medical:</h3>
    <p><span data-bind="rb_medOtherDetails" id="rb_medOtherDetails">{{stage3.med_other_details}}</span></p>
    
    <h3>Educational:</h3>
    <p><span data-bind="rb_alliedDetails" id="rb_alliedDetails">{{stage3.allied_details}}</span></p>
  </section>

  <section class="follow-up">
    <h2>10. Follow-up</h2>
    <p><span data-bind="rb_aftercareDetails" id="rb_aftercareDetails">{{stage3.aftercare_details}}</span></p>
    
    <p><span data-bind="rb_additionalNotesFinal" id="rb_additionalNotesFinal">{{stage3.additional_notes_final}}</span></p>
  </section>

  <footer class="report-footer">
    <p>Regards,<br><br>
    <span data-bind="rb_careManager" id="rb_careManager_2">{{meta.careManager}}</span><br>
    Clinical Director, Consultant Child & Adolescent Psychiatrist<br>
    B.Sc (Pharm) MB BCh BAO Dip Clin Leadership MCPsychI MRCPsych</p>
  </footer>
</div>
`;
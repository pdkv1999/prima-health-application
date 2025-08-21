import { ph25Spec } from '@/spec/ph25Spec';
import { 
  TranscriptTurn, 
  FieldSchema, 
  OrchestrationResult, 
  StageResult,
  OntologyMapping,
  BusinessRules 
} from './types';
import { SectionExtractor } from './sectionExtractor';

export class SpeechToFormOrchestrator {
  private fieldSchema: FieldSchema[];
  private ontology: OntologyMapping;
  private businessRules: BusinessRules;

  constructor() {
    this.fieldSchema = this.buildFieldSchema();
    this.ontology = this.buildOntology();
    this.businessRules = this.buildBusinessRules();
  }

  private buildFieldSchema(): FieldSchema[] {
    const fields: FieldSchema[] = [];
    
    // Convert ph25Spec to FieldSchema format
    Object.entries(ph25Spec.stages).forEach(([stageKey, stage]) => {
      stage.sections.forEach((section) => {
        section.fields.forEach((field) => {
          fields.push({
            id: field.key,
            label: field.label,
            stage: stageKey,
            section: section.title.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
            type: field.type as any,
            required: ph25Spec.validation.required?.includes(field.key) || false,
            allowed_values: field.options,
            examples: field.examples
          });
        });
      });
    });
    
    return fields;
  }

  private buildOntology(): OntologyMapping {
    return {
      synonyms: {
        'medications': ['meds', 'drugs', 'medicine', 'medication', 'tablets', 'pills'],
        'allergies': ['allergic', 'allergy', 'nkda', 'drug allergies'],
        'medical_history': ['medical', 'health history', 'medical background'],
        'family_history': ['family medical', 'family background', 'genetics'],
        'age': ['years old', 'y.o.', 'aged'],
        'handedness': ['handed', 'dominant hand'],
        'school': ['school year', 'grade', 'class']
      },
      keywords: {
        'stage1': ['phone call', 'initial', 'intake', 'background'],
        'stage2': ['in-person', 'consultation', 'assessment'],
        'stage3': ['final', 'feedback', 'results', 'diagnosis']
      }
    };
  }

  private buildBusinessRules(): BusinessRules {
    return {
      required_fields_per_stage: {
        stage1: ['clientName', 'dob', 'guardianName', 'assessmentDate'],
        stage2: ['client_name', 'assessment_date', 'mse'],
        stage3: ['diagnosis', 'criteria']
      },
      cross_field_rules: [
        {
          condition: 'if age < 18 then guardian_name required',
          message: 'Guardian name is required for clients under 18'
        }
      ],
      min_confidence_to_autofill: 0.78
    };
  }

  private routeTranscriptToSections(transcript: TranscriptTurn[]): Record<string, TranscriptTurn[]> {
    const sections: Record<string, TranscriptTurn[]> = {};
    
    // Simple routing based on content analysis
    // In a real implementation, this would use NLP to classify content
    
    for (const turn of transcript) {
      const text = turn.text.toLowerCase();
      
      // Route to appropriate sections based on keywords
      if (/medication|drug|tablet|pill|mg|dose/i.test(text)) {
        if (!sections['medications']) sections['medications'] = [];
        sections['medications'].push(turn);
      }
      
      if (/allerg|nkda/i.test(text)) {
        if (!sections['allergies']) sections['allergies'] = [];
        sections['allergies'].push(turn);
      }
      
      if (/medical history|health|condition|diagnosis/i.test(text)) {
        if (!sections['medical_history']) sections['medical_history'] = [];
        sections['medical_history'].push(turn);
      }
      
      if (/family|mother|father|parent|sibling/i.test(text)) {
        if (!sections['family_history']) sections['family_history'] = [];
        sections['family_history'].push(turn);
      }
      
      if (/age|years old|school|grade|class|handed/i.test(text)) {
        if (!sections['client_details']) sections['client_details'] = [];
        sections['client_details'].push(turn);
      }
      
      // Default routing - add to general section
      if (!sections['general']) sections['general'] = [];
      sections['general'].push(turn);
    }
    
    return sections;
  }

  private mergeConflictingFields(candidates: any[]): any {
    // Simple merge strategy - take highest confidence, most recent if tied
    if (candidates.length === 0) return null;
    if (candidates.length === 1) return candidates[0];
    
    candidates.sort((a, b) => {
      if (a.confidence !== b.confidence) return b.confidence - a.confidence;
      return (b.evidence.end_ms || 0) - (a.evidence.end_ms || 0);
    });
    
    return candidates[0];
  }

  async orchestrate(transcript: TranscriptTurn[]): Promise<OrchestrationResult> {
    // Route transcript to sections
    const sectionTranscripts = this.routeTranscriptToSections(transcript);
    
    // Extract fields from each section
    const extractions: Record<string, any> = {};
    
    for (const [sectionId, sectionTranscript] of Object.entries(sectionTranscripts)) {
      const sectionFields = this.fieldSchema.filter(f => 
        f.section === sectionId || f.id.includes(sectionId)
      );
      
      if (sectionFields.length > 0) {
        const extractor = new SectionExtractor(sectionId, sectionFields);
        const result = extractor.extract(sectionTranscript);
        extractions[sectionId] = result;
      }
    }
    
    // Organize by stages
    const stageResults: Record<string, StageResult> = {
      stage1: { sections: {}, completion_ready: false, missing_required_fields: [] },
      stage2: { sections: {}, completion_ready: false, missing_required_fields: [] },
      stage3: { sections: {}, completion_ready: false, missing_required_fields: [] }
    };
    
    // Distribute extracted fields to appropriate stages
    Object.values(extractions).forEach((extraction: any) => {
      if (extraction.fields) {
        Object.entries(extraction.fields).forEach(([fieldId, fieldData]: [string, any]) => {
          const fieldSchema = this.fieldSchema.find(f => f.id === fieldId);
          if (fieldSchema) {
            const stage = fieldSchema.stage;
            if (!stageResults[stage].sections[extraction.section_id]) {
              stageResults[stage].sections[extraction.section_id] = { fields: {} };
            }
            stageResults[stage].sections[extraction.section_id].fields[fieldId] = fieldData;
          }
        });
      }
    });
    
    // Check completion readiness for each stage
    Object.keys(stageResults).forEach(stageKey => {
      const requiredFields = this.businessRules.required_fields_per_stage[stageKey] || [];
      const extractedFields = this.getExtractedFieldsForStage(stageResults[stageKey]);
      const missing = requiredFields.filter(field => !extractedFields.includes(field));
      
      stageResults[stageKey].missing_required_fields = missing;
      stageResults[stageKey].completion_ready = missing.length === 0;
    });
    
    return {
      stages: stageResults as any,
      global_conflicts: [] // Simplified - would identify actual conflicts in real implementation
    };
  }

  private getExtractedFieldsForStage(stage: StageResult): string[] {
    const fields: string[] = [];
    Object.values(stage.sections).forEach(section => {
      Object.keys(section.fields).forEach(fieldId => {
        fields.push(fieldId);
      });
    });
    return fields;
  }

  // Convert simple transcript text to TranscriptTurn format
  convertTextToTranscript(text: string, speaker: string = 'Guardian'): TranscriptTurn[] {
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    const turns: TranscriptTurn[] = [];
    
    let currentTime = 0;
    const avgWordsPerMinute = 150; // Assume average speaking rate
    
    lines.forEach((line) => {
      const wordCount = line.split(/\s+/).length;
      const durationMs = (wordCount / avgWordsPerMinute) * 60 * 1000;
      
      turns.push({
        speaker,
        start_ms: currentTime,
        end_ms: currentTime + durationMs,
        text: line.trim()
      });
      
      currentTime += durationMs + 1000; // Add 1 second pause between lines
    });
    
    return turns;
  }
}
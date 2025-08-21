// Speech-to-Form Orchestrator Types

export interface TranscriptTurn {
  speaker: string;
  start_ms: number;
  end_ms: number;
  text: string;
}

export interface FieldSchema {
  id: string;
  label: string;
  stage: string;
  section: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'checkboxes' | 'date' | 'time' | 'group' | 'checkbox_with_notes';
  required?: boolean;
  allowed_values?: string[];
  regex?: string;
  examples?: string[];
  options?: string[];
}

export interface Evidence {
  speaker: string;
  start_ms: number | null;
  end_ms: number | null;
  quote: string;
}

export interface ExtractedField {
  value: any;
  confidence: number;
  evidence: Evidence;
  notes: string;
}

export interface SectionExtraction {
  section_id: string;
  fields: Record<string, ExtractedField>;
}

export interface StageResult {
  sections: Record<string, { fields: Record<string, ExtractedField> }>;
  completion_ready: boolean;
  missing_required_fields: string[];
}

export interface OrchestrationResult {
  stages: {
    stage1: StageResult;
    stage2: StageResult;
    stage3: StageResult;
  };
  global_conflicts: Array<{
    field_id: string;
    candidates: Array<{ value: any; confidence: number }>;
    resolution: string;
  }>;
}

export interface ValidationResult {
  apply_plan: Array<{
    field_id: string;
    stage: string;
    status: 'auto_apply' | 'suggest_only';
    reason?: string;
  }>;
  stage_gates: Record<string, {
    completion_ready: boolean;
    missing_required_fields: string[];
  }>;
}

export interface BusinessRules {
  required_fields_per_stage: Record<string, string[]>;
  cross_field_rules: Array<{
    condition: string;
    message: string;
  }>;
  min_confidence_to_autofill: number;
}

export interface OntologyMapping {
  synonyms: Record<string, string[]>;
  keywords: Record<string, string[]>;
}
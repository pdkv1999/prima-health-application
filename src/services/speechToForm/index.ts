// Speech-to-Form Orchestrator Service
export { SpeechToFormOrchestrator } from './orchestrator';
export { SectionExtractor } from './sectionExtractor';
export { ValidationAndGating } from './validator';
export * from './types';

// Main service interface
import { SpeechToFormOrchestrator } from './orchestrator';
import { ValidationAndGating } from './validator';
import { TranscriptTurn, OrchestrationResult, ValidationResult } from './types';

export class SpeechToFormService {
  private orchestrator: SpeechToFormOrchestrator;
  private validator: ValidationAndGating;

  constructor() {
    this.orchestrator = new SpeechToFormOrchestrator();
    this.validator = new ValidationAndGating({
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
    });
  }

  async processTranscript(
    transcriptText: string, 
    speaker: string = 'Guardian'
  ): Promise<{
    orchestration: OrchestrationResult;
    validation: ValidationResult;
  }> {
    // Convert text to transcript format
    const transcript = this.orchestrator.convertTextToTranscript(transcriptText, speaker);
    
    // Orchestrate extraction
    const orchestration = await this.orchestrator.orchestrate(transcript);
    
    // Validate and gate
    const validation = this.validator.validate(orchestration);
    
    return {
      orchestration,
      validation
    };
  }

  async processTranscriptTurns(transcript: TranscriptTurn[]): Promise<{
    orchestration: OrchestrationResult;
    validation: ValidationResult;
  }> {
    // Orchestrate extraction
    const orchestration = await this.orchestrator.orchestrate(transcript);
    
    // Validate and gate
    const validation = this.validator.validate(orchestration);
    
    return {
      orchestration,
      validation
    };
  }
}
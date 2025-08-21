import { OrchestrationResult, ValidationResult, BusinessRules } from './types';

export class ValidationAndGating {
  private businessRules: BusinessRules;

  constructor(businessRules: BusinessRules) {
    this.businessRules = businessRules;
  }

  private validateFieldValue(fieldId: string, value: any, fieldType: string): {
    isValid: boolean;
    reason?: string;
  } {
    if (value === null || value === undefined || value === '') {
      return { isValid: false, reason: 'Empty value' };
    }

    switch (fieldType) {
      case 'date':
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(value)) {
          return { isValid: false, reason: 'Invalid date format (expected YYYY-MM-DD)' };
        }
        break;
      
      case 'time':
        const timeRegex = /^\d{2}:\d{2}$/;
        if (!timeRegex.test(value)) {
          return { isValid: false, reason: 'Invalid time format (expected HH:MM)' };
        }
        break;
      
      case 'select':
        // Would validate against allowed_values in real implementation
        break;
      
      case 'checkbox':
        if (typeof value !== 'boolean') {
          return { isValid: false, reason: 'Checkbox value must be boolean' };
        }
        break;
      
      case 'checkboxes':
        if (!Array.isArray(value)) {
          return { isValid: false, reason: 'Checkboxes value must be an array' };
        }
        break;
    }

    return { isValid: true };
  }

  private evaluateCrossFieldRules(orchestrationResult: OrchestrationResult): string[] {
    const errors: string[] = [];
    
    // Simple rule evaluation - in real implementation would use expression parser
    this.businessRules.cross_field_rules.forEach(rule => {
      if (rule.condition.includes('age < 18')) {
        // Check if any stage has age < 18 and guardian_name is missing
        Object.values(orchestrationResult.stages).forEach(stage => {
          Object.values(stage.sections).forEach(section => {
            const ageField = section.fields.age;
            const guardianField = section.fields.guardianName || section.fields.guardian_name;
            
            if (ageField && ageField.value) {
              const ageMatch = ageField.value.toString().match(/(\d+)/);
              if (ageMatch && parseInt(ageMatch[1]) < 18 && !guardianField) {
                errors.push(rule.message);
              }
            }
          });
        });
      }
    });
    
    return errors;
  }

  validate(orchestrationResult: OrchestrationResult): ValidationResult {
    const applyPlan: ValidationResult['apply_plan'] = [];
    const stageGates: ValidationResult['stage_gates'] = {};
    
    // Evaluate cross-field rules
    const crossFieldErrors = this.evaluateCrossFieldRules(orchestrationResult);
    
    // Process each stage
    Object.entries(orchestrationResult.stages).forEach(([stageKey, stage]) => {
      const requiredFields = this.businessRules.required_fields_per_stage[stageKey] || [];
      const missingFields: string[] = [];
      let hasHardErrors = false;
      
      // Process each field in the stage
      Object.values(stage.sections).forEach(section => {
        Object.entries(section.fields).forEach(([fieldId, field]) => {
          const validation = this.validateFieldValue(fieldId, field.value, 'text'); // Simplified
          
          if (!validation.isValid) {
            hasHardErrors = true;
            applyPlan.push({
              field_id: fieldId,
              stage: stageKey,
              status: 'suggest_only',
              reason: `Validation error: ${validation.reason}`
            });
          } else if (field.confidence >= this.businessRules.min_confidence_to_autofill) {
            applyPlan.push({
              field_id: fieldId,
              stage: stageKey,
              status: 'auto_apply'
            });
          } else {
            applyPlan.push({
              field_id: fieldId,
              stage: stageKey,
              status: 'suggest_only',
              reason: `Low confidence (${(field.confidence * 100).toFixed(1)}%)`
            });
          }
        });
      });
      
      // Check for missing required fields
      const extractedFieldIds = this.getExtractedFieldIdsForStage(stage);
      const missing = requiredFields.filter(field => !extractedFieldIds.includes(field));
      missingFields.push(...missing);
      
      stageGates[stageKey] = {
        completion_ready: !hasHardErrors && missingFields.length === 0 && crossFieldErrors.length === 0,
        missing_required_fields: missingFields
      };
    });
    
    return {
      apply_plan: applyPlan,
      stage_gates: stageGates
    };
  }

  private getExtractedFieldIdsForStage(stage: any): string[] {
    const fieldIds: string[] = [];
    Object.values(stage.sections).forEach((section: any) => {
      Object.keys(section.fields).forEach(fieldId => {
        fieldIds.push(fieldId);
      });
    });
    return fieldIds;
  }
}
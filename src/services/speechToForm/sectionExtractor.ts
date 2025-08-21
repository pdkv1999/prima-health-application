import { TranscriptTurn, FieldSchema, SectionExtraction, ExtractedField, Evidence } from './types';

export class SectionExtractor {
  private sectionSchema: FieldSchema[];
  private sectionId: string;

  constructor(sectionId: string, sectionSchema: FieldSchema[]) {
    this.sectionId = sectionId;
    this.sectionSchema = sectionSchema;
  }

  private normalizeText(text: string): string {
    return text.trim().toLowerCase().replace(/[^a-z0-9\s]+/g, ' ').replace(/\s+/g, ' ');
  }

  private extractMedications(transcript: TranscriptTurn[]): ExtractedField | null {
    for (const turn of transcript) {
      const text = turn.text.toLowerCase();
      
      // Look for medication patterns
      const medPatterns = [
        /(?:on|taking|prescribed)\s+(.*?)(?:\s+(?:mg|milligrams?|tablets?|daily|twice|once))/gi,
        /medications?[:\s]+(.*?)(?:\.|;|$)/gi,
        /(?:methylphenidate|concerta|ritalin|adderall|strattera|intuniv)\s*(?:\d+\s*mg)?/gi
      ];

      for (const pattern of medPatterns) {
        const matches = [...text.matchAll(pattern)];
        if (matches.length > 0) {
          const medications = matches.map(m => m[1] || m[0]).filter(Boolean);
          return {
            value: medications,
            confidence: 0.85,
            evidence: {
              speaker: turn.speaker,
              start_ms: turn.start_ms,
              end_ms: turn.end_ms,
              quote: turn.text
            },
            notes: `Extracted ${medications.length} medication(s)`
          };
        }
      }

      // Check for "no medications"
      if (/no.*?(?:medications?|meds|drugs)|not.*?(?:taking|on).*?(?:anything|medications?)/i.test(text)) {
        return {
          value: [],
          confidence: 0.9,
          evidence: {
            speaker: turn.speaker,
            start_ms: turn.start_ms,
            end_ms: turn.end_ms,
            quote: turn.text
          },
          notes: 'Explicit negation of medications'
        };
      }
    }
    return null;
  }

  private extractAllergies(transcript: TranscriptTurn[]): ExtractedField | null {
    for (const turn of transcript) {
      const text = turn.text.toLowerCase();
      
      // Look for allergy patterns
      if (/allergi(?:es|c)|nkda|no known drug allergi/i.test(text)) {
        if (/no.*?allergi|nkda|no known/i.test(text)) {
          return {
            value: 'NKDA',
            confidence: 0.95,
            evidence: {
              speaker: turn.speaker,
              start_ms: turn.start_ms,
              end_ms: turn.end_ms,
              quote: turn.text
            },
            notes: 'No known drug allergies identified'
          };
        }
        
        const allergies = text.match(/allergi(?:es|c)\s*(?:to\s+)?([^.;,]+)/i);
        if (allergies) {
          return {
            value: allergies[1].trim(),
            confidence: 0.8,
            evidence: {
              speaker: turn.speaker,
              start_ms: turn.start_ms,
              end_ms: turn.end_ms,
              quote: turn.text
            },
            notes: 'Allergy information extracted'
          };
        }
      }
    }
    return null;
  }

  private extractDemographics(transcript: TranscriptTurn[]): Record<string, ExtractedField> {
    const results: Record<string, ExtractedField> = {};

    for (const turn of transcript) {
      const text = turn.text;
      
      // Age extraction
      const ageMatch = text.match(/(?:age|is)\s*(\d+)\s*(?:years?\s*old|y\.?o\.?)/i);
      if (ageMatch && !results.age) {
        results.age = {
          value: `${ageMatch[1]} years`,
          confidence: 0.9,
          evidence: {
            speaker: turn.speaker,
            start_ms: turn.start_ms,
            end_ms: turn.end_ms,
            quote: text
          },
          notes: 'Age extracted from conversation'
        };
      }

      // School year extraction
      const schoolMatch = text.match(/(?:in\s+)?(?:year\s+)?(\d+)(?:st|nd|rd|th)?\s*(?:class|grade|year)/i);
      if (schoolMatch && !results.schoolYear) {
        results.schoolYear = {
          value: `${schoolMatch[1]}${this.getOrdinalSuffix(parseInt(schoolMatch[1]))} Class`,
          confidence: 0.85,
          evidence: {
            speaker: turn.speaker,
            start_ms: turn.start_ms,
            end_ms: turn.end_ms,
            quote: text
          },
          notes: 'School year extracted'
        };
      }

      // Handedness
      const handMatch = text.match(/(right|left)[-\s]?handed/i);
      if (handMatch && !results.handedness) {
        results.handedness = {
          value: handMatch[1].toLowerCase(),
          confidence: 0.9,
          evidence: {
            speaker: turn.speaker,
            start_ms: turn.start_ms,
            end_ms: turn.end_ms,
            quote: text
          },
          notes: 'Handedness identified'
        };
      }
    }

    return results;
  }

  private getOrdinalSuffix(num: number): string {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  }

  private extractTextareaFields(transcript: TranscriptTurn[]): Record<string, ExtractedField> {
    const results: Record<string, ExtractedField> = {};
    
    const textareaFields = this.sectionSchema.filter(f => f.type === 'textarea');
    
    for (const field of textareaFields) {
      const patterns = this.getFieldPatterns(field);
      
      for (const turn of transcript) {
        const text = turn.text;
        
        for (const pattern of patterns) {
          const match = text.match(pattern);
          if (match && !results[field.id]) {
            const extractedText = match[1] || match[0];
            results[field.id] = {
              value: extractedText.trim(),
              confidence: 0.75,
              evidence: {
                speaker: turn.speaker,
                start_ms: turn.start_ms,
                end_ms: turn.end_ms,
                quote: text
              },
              notes: `Extracted for ${field.label}`
            };
            break;
          }
        }
        if (results[field.id]) break;
      }
    }
    
    return results;
  }

  private getFieldPatterns(field: FieldSchema): RegExp[] {
    const label = field.label.toLowerCase();
    const patterns: RegExp[] = [];
    
    // Generate patterns based on field label
    if (label.includes('medical history')) {
      patterns.push(
        /medical history[:\s]+([^.;]+)/gi,
        /(?:past )?medical[:\s]+([^.;]+)/gi,
        /(?:history of|has)\s+([^.;]+?)(?:\.|;|$)/gi
      );
    } else if (label.includes('referral')) {
      patterns.push(
        /referral[:\s]+([^.;]+)/gi,
        /referred (?:because|for|due to)\s+([^.;]+)/gi,
        /(?:teacher|gp|doctor).*?(?:raised|mentioned|said).*?([^.;]+)/gi
      );
    } else if (label.includes('family history')) {
      patterns.push(
        /family history[:\s]+([^.;]+)/gi,
        /(?:mother|father|parent|family).*?(?:history of|has|had)\s+([^.;]+)/gi
      );
    }
    
    return patterns;
  }

  extract(transcript: TranscriptTurn[]): SectionExtraction {
    const fields: Record<string, ExtractedField> = {};

    // Section-specific extraction logic
    if (this.sectionId.includes('medication')) {
      const medResult = this.extractMedications(transcript);
      if (medResult) fields.medications = medResult;
      
      const allergyResult = this.extractAllergies(transcript);
      if (allergyResult) fields.allergies = allergyResult;
    }

    if (this.sectionId.includes('client') || this.sectionId.includes('demographic')) {
      Object.assign(fields, this.extractDemographics(transcript));
    }

    // Extract textarea fields
    Object.assign(fields, this.extractTextareaFields(transcript));

    return {
      section_id: this.sectionId,
      fields
    };
  }
}
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { useCaseStore } from "@/store/useCaseStore";
import { reportBindings } from "@/store/reportBindings";

type ValidationResult = {
  isComplete: boolean;
  missing: Array<{
    path: string;
    label: string;
    stage: string;
    fieldKey: string;
  }>;
};

const getFieldLabel = (stage: string, fieldKey: string): string => {
  // This would ideally come from the spec, but for now we'll use simple labels
  const labelMap: Record<string, string> = {
    clientName: "Client Name",
    referralBackground: "Referral Background", 
    medicalHistory: "Medical History",
    medications: "Medications",
    familyMentalHealth: "Family Mental Health",
    mental_state_notes: "Mental State Notes",
    diagnostic_outcome: "Diagnostic Outcome",
    diagnosis: "Final Diagnosis",
    recommendations: "Recommendations",
    aftercare_details: "Aftercare Details"
  };
  
  return labelMap[fieldKey] || fieldKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

const validateCompleteness = (stageData: any): ValidationResult => {
  const missing: ValidationResult['missing'] = [];
  
  const checkValue = (value: any): boolean => {
    if (value == null) return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') {
      // For objects, check if they have meaningful content
      const keys = Object.keys(value);
      if (keys.length === 0) return false;
      
      // For criteria objects, check if at least some items are filled
      if (keys.some(k => k.match(/^\d+$/))) {
        return Object.values(value).some((item: any) => 
          item && typeof item === 'object' && Object.values(item).some(v => v)
        );
      }
      
      return keys.some(k => checkValue(value[k]));
    }
    return true;
  };
  
  // Check all report bindings to ensure they have values
  reportBindings.forEach(binding => {
    const [stage, ...fieldParts] = binding.path.split('.');
    const fieldKey = fieldParts.join('.');
    
    const stageDataToCheck = stageData[stage];
    if (!stageDataToCheck) return;
    
    const value = fieldParts.reduce((acc, key) => (acc ? acc[key] : undefined), stageDataToCheck);
    
    if (!checkValue(value)) {
      missing.push({
        path: binding.path,
        label: getFieldLabel(stage, fieldKey),
        stage,
        fieldKey
      });
    }
  });
  
  return {
    isComplete: missing.length === 0,
    missing
  };
};

type Props = {
  onNavigateToField: (path: string) => void;
};

export function CompletenessValidator({ onNavigateToField }: Props) {
  const stage1 = useCaseStore(s => s.stage1);
  const stage2 = useCaseStore(s => s.stage2);
  const stage3 = useCaseStore(s => s.stage3);
  const meta = useCaseStore(s => s.meta);

  const validation = React.useMemo(() => {
    return validateCompleteness({ stage1, stage2, stage3, meta });
  }, [stage1, stage2, stage3, meta]);

  if (validation.isComplete) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          All required fields are completed. Ready for final export.
        </AlertDescription>
      </Alert>
    );
  }

  const missingByStage = validation.missing.reduce((acc, item) => {
    if (!acc[item.stage]) acc[item.stage] = [];
    acc[item.stage].push(item);
    return acc;
  }, {} as Record<string, typeof validation.missing>);

  return (
    <Alert className="border-amber-200 bg-amber-50">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertDescription>
        <div className="text-amber-800">
          <p className="font-medium mb-2">
            {validation.missing.length} field(s) need to be completed before finalizing:
          </p>
          
          {Object.entries(missingByStage).map(([stage, fields]) => (
            <div key={stage} className="mb-3">
              <p className="font-medium text-sm mb-1 capitalize">
                {stage.replace(/(\d+)/, ' $1')}:
              </p>
              <div className="space-y-1">
                {fields.map((field, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span>• {field.label}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigateToField(field.path)}
                      className="ml-2 h-6 text-xs"
                    >
                      Go fix <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
}
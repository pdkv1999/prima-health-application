import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle, FileText } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface ExtractionReportProps {
  extractionResults: any;
  currentStage?: string;
  onNavigateToField?: (stage: string, fieldId: string) => void;
}

export default function ExtractionReport({ extractionResults, currentStage, onNavigateToField }: ExtractionReportProps) {
  if (!extractionResults) return null;

  const [isOpen, setIsOpen] = React.useState(true);

  // Calculate section-wise statistics - filter by current stage if provided
  const getSectionStats = () => {
    const stats: Record<string, { completed: number; missing: number; total: number; fields: Array<{fieldId: string, status: string, reason?: string}> }> = {};
    
    extractionResults.validation.apply_plan
      .filter((plan: any) => !currentStage || plan.stage === currentStage)
      .forEach((plan: any) => {
        const sectionKey = plan.stage;
        if (!stats[sectionKey]) {
          stats[sectionKey] = { completed: 0, missing: 0, total: 0, fields: [] };
        }
        
        stats[sectionKey].total++;
        stats[sectionKey].fields.push({
          fieldId: plan.field_id,
          status: plan.status,
          reason: plan.reason
        });
        
        if (plan.status === 'auto_apply') {
          stats[sectionKey].completed++;
        } else {
          stats[sectionKey].missing++;
        }
      });
    
    return stats;
  };

  const sectionStats = getSectionStats();
  
  // Overall statistics - filter by current stage if provided
  const filteredApplyPlan = extractionResults.validation.apply_plan
    .filter((p: any) => !currentStage || p.stage === currentStage);
  const totalFields = filteredApplyPlan.length;
  const completedFields = filteredApplyPlan.filter((p: any) => p.status === 'auto_apply').length;
  const missingFields = totalFields - completedFields;
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'auto_apply':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'suggest_only':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStageName = (stage: string) => {
    switch (stage) {
      case 'stage1': return 'Stage 1 - Phone Call';
      case 'stage2': return 'Stage 2 - In-Person';
      case 'stage3': return 'Stage 3 - Final Consultation';
      default: return stage;
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-6">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            📊 AI Extraction Report - Field Population Summary
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4">
        <Card className="border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              AI Extraction Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Summary */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>
                    <strong>Total Fields Processed:</strong> {totalFields} | 
                    <strong className="text-green-600 ml-2">Auto-Applied:</strong> {completedFields} | 
                    <strong className="text-yellow-600 ml-2">Missing/Low Confidence:</strong> {missingFields}
                  </span>
                  <Badge variant={completedFields === totalFields ? "default" : "secondary"}>
                    {Math.round((completedFields / totalFields) * 100)}% Complete
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>

            {/* Section-wise breakdown */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Section-wise Field Population</h4>
              
              {Object.entries(sectionStats).map(([stage, stats]) => (
                <Card key={stage} className="border-l-4 border-l-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{getStageName(stage)}</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-green-600">
                          ✓ {stats.completed}
                        </Badge>
                        <Badge variant="outline" className="text-yellow-600">
                          ⚠ {stats.missing}
                        </Badge>
                        <Badge variant="secondary">
                          {Math.round((stats.completed / stats.total) * 100)}%
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {stats.fields.map((field, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/30">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(field.status)}
                            <span className="font-mono text-sm">{field.fieldId}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {field.status === 'auto_apply' ? (
                              <Badge variant="outline" className="text-green-600">Applied</Badge>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-yellow-600">
                                  {field.reason?.includes('Low confidence') ? 'Low Conf.' : 
                                   field.reason?.includes('Empty value') ? 'Assigned NA' : 'Needs Review'}
                                </Badge>
                                {onNavigateToField && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => onNavigateToField(stage, field.fieldId)}
                                    className="h-6 px-2 text-xs"
                                  >
                                    Fix
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Stage completion status */}
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Stage Completion Status</h4>
              {Object.entries(extractionResults.validation.stage_gates)
                .filter(([stage]) => !currentStage || stage === currentStage)
                .map(([stage, gateInfo]: [string, any]) => (
                <div key={stage} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    {gateInfo.completion_ready ? 
                      <CheckCircle className="h-5 w-5 text-green-500" /> : 
                      <XCircle className="h-5 w-5 text-red-500" />
                    }
                    <span className="font-medium">{getStageName(stage)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={gateInfo.completion_ready ? "default" : "destructive"}>
                      {gateInfo.completion_ready ? "✅ Ready" : "⚠️ Incomplete"}
                    </Badge>
                    {gateInfo.missing_required_fields?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {gateInfo.missing_required_fields.map((fieldId: string, index: number) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-xs text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                            onClick={() => onNavigateToField?.(stage, fieldId)}
                          >
                            {fieldId} ⚠
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action required summary */}
            {missingFields > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Action Required:</strong> {missingFields} fields need attention. Missing fields have been automatically assigned 'NA' to allow progression. Review and update as needed using the "Fix" buttons above.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
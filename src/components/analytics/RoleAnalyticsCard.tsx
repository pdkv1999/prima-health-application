import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, TrendingUp, Users } from "lucide-react";

interface RoleData {
  role: string;
  beforeTimePerCase: number;
  afterTimePerCase: number;
  hourlyRate: number;
  description: string;
}

interface RoleAnalyticsCardProps {
  roleData: RoleData;
  caseCount: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function RoleAnalyticsCard({ roleData, caseCount }: RoleAnalyticsCardProps) {
  const { role, beforeTimePerCase, afterTimePerCase, hourlyRate, description } = roleData;
  
  const totalTimeBefore = beforeTimePerCase * caseCount;
  const totalTimeAfter = afterTimePerCase * caseCount;
  const timeSaved = totalTimeBefore - totalTimeAfter;
  const timeSavedPercent = Math.round((timeSaved / totalTimeBefore) * 100);
  
  const costBefore = totalTimeBefore * hourlyRate;
  const costAfter = totalTimeAfter * hourlyRate;
  const costSaved = costBefore - costAfter;
  
  const efficiencyGain = Math.round(((beforeTimePerCase - afterTimePerCase) / beforeTimePerCase) * 100);

  return (
    <Card className="glass-button h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg text-slate-800 mb-1">{role}</CardTitle>
            <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
          </div>
          <Badge variant="secondary" className="ml-2 flex-shrink-0">
            {efficiencyGain}% faster
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Time Comparison */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Time per case</span>
            <div className="flex items-center gap-1 text-emerald-600">
              <Clock className="h-3 w-3" />
              <span className="font-medium">{timeSaved.toFixed(1)}h saved</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded">
              <div className="text-slate-500">Before</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">{beforeTimePerCase}h</div>
            </div>
            <div className="text-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded">
              <div className="text-emerald-600">After</div>
              <div className="font-semibold text-emerald-700 dark:text-emerald-400">{afterTimePerCase}h</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Efficiency improvement</span>
            <span className="font-medium text-slate-800">{timeSavedPercent}%</span>
          </div>
          <Progress value={timeSavedPercent} className="h-2" />
        </div>

        {/* Time Impact Summary */}
        <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
            <TrendingUp className="h-3 w-3" />
            <span className="text-xs">Total Time Saved</span>
          </div>
          <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            {timeSaved.toFixed(1)} hours
          </div>
        </div>

        {/* Cases handled */}
        <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-1 text-slate-600">
            <Users className="h-3 w-3" />
            <span>Cases processed</span>
          </div>
          <span className="font-medium text-slate-800 dark:text-slate-200">{caseCount}</span>
        </div>
      </CardContent>
    </Card>
  );
}
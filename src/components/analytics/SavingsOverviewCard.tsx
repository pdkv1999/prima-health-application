import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Euro, 
  TrendingUp, 
  Users, 
  Zap,
  Target
} from "lucide-react";

interface SavingsData {
  totalTimeSaved: number;
  averageEfficiencyGain: number;
  additionalCasesCapacity: number;
  throughputImprovement: number;
}

interface SavingsOverviewCardProps {
  savingsData: SavingsData;
  caseCount: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SavingsOverviewCard({ savingsData, caseCount }: SavingsOverviewCardProps) {
  const {
    totalTimeSaved,
    averageEfficiencyGain,
    additionalCasesCapacity,
    throughputImprovement
  } = savingsData;

  const kpiData = [
    {
      label: "Total Time Saved",
      value: `${totalTimeSaved.toFixed(1)}h`,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      label: "Efficiency Gain",
      value: `${averageEfficiencyGain}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      label: "Additional Capacity",
      value: `+${additionalCasesCapacity}`,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    },
    {
      label: "Throughput Boost",
      value: `${throughputImprovement}%`,
      icon: Zap,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20"
    }
  ];

  return (
    <Card className="glass-button">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-slate-800 mb-1">Overall Impact Summary</CardTitle>
            <p className="text-sm text-slate-600">
              System performance improvements for {caseCount} cases
            </p>
          </div>
          <Badge variant="default" className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            High Impact
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => {
            const IconComponent = kpi.icon;
            return (
              <div 
                key={index}
                className={`p-4 rounded-lg ${kpi.bgColor} border border-slate-200 dark:border-slate-700`}
              >
                <div className={`flex items-center gap-2 mb-2 ${kpi.color}`}>
                  <IconComponent className="h-4 w-4" />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {kpi.label}
                  </span>
                </div>
                <div className={`text-lg font-bold ${kpi.color}`}>
                  {kpi.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional insights */}
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            Key Benefits Achieved:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Reduced manual administrative tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Improved data accuracy and consistency</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Enhanced clinical workflow efficiency</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Better resource utilization</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
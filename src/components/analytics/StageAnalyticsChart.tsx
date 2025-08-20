import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface StageData {
  stage: string;
  beforeTime: number;
  afterTime: number;
  description: string;
}

interface StageAnalyticsChartProps {
  stageData: StageData[];
  caseCount: number;
  title: string;
}

export default function StageAnalyticsChart({ stageData, caseCount, title }: StageAnalyticsChartProps) {
  const chartData = stageData.map((stage) => ({
    stage: stage.stage,
    Before: stage.beforeTime * caseCount,
    After: stage.afterTime * caseCount,
    Saved: (stage.beforeTime - stage.afterTime) * caseCount,
  }));

  const totalTimeBefore = chartData.reduce((sum, item) => sum + item.Before, 0);
  const totalTimeAfter = chartData.reduce((sum, item) => sum + item.After, 0);
  const totalSaved = totalTimeBefore - totalTimeAfter;
  const percentSaved = Math.round((totalSaved / totalTimeBefore) * 100);

  return (
    <Card className="glass-button">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-800">{title}</CardTitle>
          <div className="text-right">
            <div className="text-sm text-slate-600">Total time saved</div>
            <div className="text-lg font-semibold text-emerald-600">
              {totalSaved.toFixed(1)}h ({percentSaved}%)
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            Before: { 
              label: "Before System", 
              color: "hsl(var(--muted-foreground))" 
            },
            After: { 
              label: "After System", 
              color: "hsl(var(--primary))" 
            },
          }}
          className="w-full h-[300px]"
        >
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
            <defs>
              <linearGradient id="beforeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.85} />
                <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.25} />
              </linearGradient>
              <linearGradient id="afterGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.85} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="stage" 
              tick={{ fontSize: 11 }}
              angle={0}
              textAnchor="middle"
              height={60}
              interval={0}
            />
            <YAxis 
              label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Bar 
              dataKey="Before" 
              radius={[4, 4, 0, 0]} 
              fill="url(#beforeGradient)"
            />
            <Bar 
              dataKey="After" 
              radius={[4, 4, 0, 0]} 
              fill="url(#afterGradient)"
            />
            <ChartTooltip 
              content={<ChartTooltipContent labelKey="stage" />}
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)}h`,
                name
              ]}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
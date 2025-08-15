import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface ThroughputChartProps {
  caseCount: number;
}

export default function ThroughputChart({ caseCount }: ThroughputChartProps) {
  // Generate monthly projection data based on case count
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const baselineCasesPerMonth = Math.round(caseCount / 6); // Distribute cases over 6 months
  
  const chartData = months.map((month, index) => {
    const adoption = 0.2 + (index * 0.15); // 20% to 95% adoption over 6 months
    const beforeCases = baselineCasesPerMonth;
    const afterCases = Math.round(baselineCasesPerMonth * (1 + adoption * 1.5)); // Up to 2.5x capacity
    const improvement = ((afterCases - beforeCases) / beforeCases) * 100;
    
    return {
      month,
      Before: beforeCases,
      After: afterCases,
      Improvement: Math.round(improvement),
    };
  });

  const finalImprovement = chartData[chartData.length - 1].Improvement;

  return (
    <Card className="glass-button">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-800">Throughput Improvement Over Time</CardTitle>
          <div className="text-right">
            <div className="text-sm text-slate-600">Peak improvement</div>
            <div className="text-lg font-semibold text-emerald-600">
              +{finalImprovement}%
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
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="beforeArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="afterArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              label={{ value: 'Cases per Month', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Area
              type="monotone"
              dataKey="Before"
              stroke="hsl(var(--muted-foreground))"
              fill="url(#beforeArea)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="After"
              stroke="hsl(var(--primary))"
              fill="url(#afterArea)"
              strokeWidth={2}
            />
            <ChartTooltip 
              content={<ChartTooltipContent labelKey="month" />}
              formatter={(value: number, name: string) => [
                `${value} cases`,
                name
              ]}
            />
          </AreaChart>
        </ChartContainer>
        
        {/* Monthly breakdown table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left p-2 text-slate-600">Month</th>
                <th className="text-right p-2 text-slate-600">Before</th>
                <th className="text-right p-2 text-slate-600">After</th>
                <th className="text-right p-2 text-slate-600">Improvement</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((row, index) => (
                <tr key={index} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="p-2 font-medium text-slate-800 dark:text-slate-200">{row.month}</td>
                  <td className="p-2 text-right text-slate-600">{row.Before}</td>
                  <td className="p-2 text-right text-emerald-600 font-medium">{row.After}</td>
                  <td className="p-2 text-right text-emerald-600 font-medium">+{row.Improvement}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
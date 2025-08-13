import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useCaseStore } from "@/store/useCaseStore";
import { ph25Spec } from "@/spec/ph25Spec";
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
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Euro, Gauge, Timer, ChartBar, Target } from "lucide-react";

function formatCurrencyEUR(v: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(v);
}

function isEmpty(val: any) {
  if (val == null) return true;
  if (Array.isArray(val)) return val.length === 0;
  if (typeof val === "object") return Object.keys(val).length === 0;
  return String(val).trim() === "";
}

export default function Analytics() {
  const storeRate = useCaseStore((s) => s.hourlyRate);
  const hourlyRate = Number.isFinite(storeRate) ? storeRate : ph25Spec.home.hourly_rate_default_eur;
  const meta = useCaseStore((s) => s.meta);
  const stage1 = useCaseStore((s) => s.stage1);
  const getStageProgress = useCaseStore((s) => s.getStageProgress);

  const stage1Status = getStageProgress("stage1");
  const required = ph25Spec.validation.required;
  const filledCount = required.filter((k) => !isEmpty((meta as any)[k] ?? (stage1 as any)[k])).length;
  const percentComplete = Math.round((filledCount / required.length) * 100);

  const baselineHours = 8;
  const newHours = ph25Spec.home.time_hours.S1; // 1.5h
  const hoursSaved = baselineHours - newHours; // 6.5h
  const pctSaved = Math.round((hoursSaved / baselineHours) * 100);
  const moneySavedPerPatient = hoursSaved * hourlyRate;
  const capacityX = baselineHours / newHours; // ~5.3x
  const capacityXDisplay = Math.min(5, Math.round(capacityX * 10) / 10); // cap at 5x for messaging

  const [casesPerMonth, setCasesPerMonth] = useState<number>(20);

  useEffect(() => {
    document.title = "Analytics Dashboard – PrimaHealth ADHD (PH25)";
    const desc =
      "Analytics dashboard showing time saved, money saved, capacity, and governance impact for ADHD assessments.";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", desc);

    // Canonical tag
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", window.location.href);
  }, []);

  // Trend data (illustrative ramp-up over 6 months)
  const trendData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const adoption = [0.15, 0.3, 0.45, 0.6, 0.7, 0.8];
    return months.map((m, i) => {
      const timeSavedH = casesPerMonth * hoursSaved * adoption[i];
      const moneySaved = timeSavedH * hourlyRate;
      return { month: m, timeSavedH, moneySaved };
    });
  }, [casesPerMonth, hourlyRate]);

  useEffect(() => {
    console.log("[Analytics] render", {
      hourlyRate,
      stage1Status,
      filledCount,
      trendSample: trendData[0],
    });
  }, [hourlyRate, stage1Status, filledCount, trendData]);

  const timeCompare = [
    { label: "Before", hours: baselineHours },
    { label: "With PH25", hours: newHours },
  ];

  const capacityData = [
    { label: "Before", cases: 1 },
    { label: "With PH25", cases: Math.round(capacityX) },
  ];

  const qualityData = [
    { metric: "Consistency", Before: 60, After: 90 },
    { metric: "Objectivity", Before: 55, After: 88 },
  ];

  const standardisationTrend = [
    { month: "Jan", adoption: 20 },
    { month: "Feb", adoption: 35 },
    { month: "Mar", adoption: 50 },
    { month: "Apr", adoption: 65 },
    { month: "May", adoption: 75 },
    { month: "Jun", adoption: 85 },
  ];

  const focusPre = [
    { name: "Clinical judgement", value: 40 },
    { name: "Admin/process", value: 60 },
  ];
  const focusPost = [
    { name: "Clinical judgement", value: 85 },
    { name: "Admin/process", value: 15 },
  ];

  const pieColors = ["hsl(var(--primary))", "hsl(var(--muted-foreground))"];

  return (
    <div className="grid gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Analytics Dashboard</h1>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Cases / month</span>
            <Input
              aria-label="Cases per month"
              type="number"
              className="w-24"
              value={casesPerMonth}
              min={1}
              onChange={(e) => setCasesPerMonth(Math.max(1, Number(e.currentTarget.value || 1)))}
            />
          </div>
        </div>
      </header>

      <main className="grid gap-6">
        {/* KPI cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Time saved per patient</CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div className="text-2xl font-semibold">{hoursSaved.toFixed(1)}h</div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Timer className="h-4 w-4" />
                <span className="text-sm font-medium">{pctSaved}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Money saved per patient</CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div className="text-2xl font-semibold">{formatCurrencyEUR(moneySavedPerPatient)}</div>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Capacity impact</CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div className="text-2xl font-semibold">Up to {capacityXDisplay}×</div>
              <Gauge className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Stage 1 status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={stage1Status === "Complete" ? "default" : stage1Status === "In Progress" ? "secondary" : "outline"}>
                  {stage1Status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {filledCount}/{required.length} required fields
                </span>
              </div>
              <Progress value={Number.isFinite(percentComplete) ? percentComplete : 0} aria-label="Stage 1 completion" />
            </CardContent>
          </Card>
        </section>

        {/* Charts row 1 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Time savings</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  hours: { label: "Hours", color: "hsl(var(--primary))" },
                }}
                className="w-full"
              >
                <BarChart data={timeCompare}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Bar dataKey="hours" radius={[6, 6, 0, 0]} />
                  <ChartTooltip content={<ChartTooltipContent labelKey="label" />} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Capacity impact</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  cases: { label: "Cases", color: "hsl(var(--primary))" },
                }}
                className="w-full"
              >
                <BarChart data={capacityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Bar dataKey="cases" radius={[6, 6, 0, 0]} />
                  <ChartTooltip content={<ChartTooltipContent labelKey="label" />} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>

        {/* Charts row 2 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly savings trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  timeSavedH: { label: "Hours saved", color: "hsl(var(--primary))" },
                  moneySaved: { label: "Money saved", color: "hsl(var(--chart-2, var(--primary)))" },
                }}
                className="w-full"
              >
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="money" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => formatCurrencyEUR(v)} />
                  <Area yAxisId="left" type="monotone" dataKey="timeSavedH" stroke="hsl(var(--primary))" fill="url(#money)" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="moneySaved" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} />
                  <ChartTooltip content={<ChartTooltipContent labelKey="month" />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quality & objectivity</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  Before: { label: "Before", color: "hsl(var(--muted-foreground))" },
                  After: { label: "With PH25", color: "hsl(var(--primary))" },
                }}
                className="w-full"
              >
                <BarChart data={qualityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis domain={[0, 100]} />
                  <Bar dataKey="Before" radius={[6, 6, 0, 0]} fill="hsl(var(--muted-foreground))" />
                  <Bar dataKey="After" radius={[6, 6, 0, 0]} fill="hsl(var(--primary))" />
                  <ChartTooltip content={<ChartTooltipContent labelKey="metric" />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>

        {/* Charts row 3 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Standardisation & governance</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ adoption: { label: "Standardised docs adoption (%)", color: "hsl(var(--primary))" } }}
                className="w-full"
              >
                <LineChart data={standardisationTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Line type="monotone" dataKey="adoption" stroke="hsl(var(--primary))" strokeWidth={2} dot />
                  <ChartTooltip content={<ChartTooltipContent labelKey="month" />} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Focus shift</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-2 text-sm text-muted-foreground">Before</div>
                  <ChartContainer
                    config={{ value: { label: "Focus share", color: "hsl(var(--primary))" } }}
                    className="w-full h-[220px]"
                  >
                    <PieChart>
                      <Pie data={focusPre} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4}>
                        {focusPre.map((_, idx) => (
                          <Cell key={idx} fill={pieColors[idx % pieColors.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </div>
                <div>
                  <div className="mb-2 text-sm text-muted-foreground">With PH25</div>
                  <ChartContainer
                    config={{ value: { label: "Focus share", color: "hsl(var(--primary))" } }}
                    className="w-full h-[220px]"
                  >
                    <PieChart>
                      <Pie data={focusPost} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4}>
                        {focusPost.map((_, idx) => (
                          <Cell key={idx} fill={pieColors[idx % pieColors.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

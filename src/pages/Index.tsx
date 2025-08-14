import { useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Clock, PhoneCall, Users, ClipboardList, FileText, Brain, CheckCircle2 } from "lucide-react";

interface Stage {
  id: number;
  name: string;
  durationHours: number;
  summary: string;
  details: string[];
  icon: JSX.Element;
}

const stages: Stage[] = [
  {
    id: 1,
    name: "Phone Call (Family Details Collection)",
    durationHours: 1.5,
    summary:
      "1-hour call to capture family and medical history, followed by 30 minutes to complete a structured proforma.",
    details: [
      "60-minute call with psychiatrist",
      "30 minutes to input data into pre-populated proforma",
      "Captures family, medical, and contextual background",
    ],
    icon: <PhoneCall className="h-5 w-5" aria-hidden />,
  },
  {
    id: 2,
    name: "In-Person Consultation",
    durationHours: 3,
    summary:
      "2-hour appointment with parent and child, then 1 hour finalising notes. Evaluates ADHD behaviours across DSM-5 domains.",
    details: [
      "120-minute in-person session (parent + child)",
      "Documents examples across 18 DSM-5 ADHD symptom categories",
      "Considers 1,000+ DSM-5 categories for differential/co-occurring conditions",
      "60 minutes post-session to complete structured proforma",
    ],
    icon: <Users className="h-5 w-5" aria-hidden />,
  },
  {
    id: 3,
    name: "Final Consultation & Feedback",
    durationHours: 1.5,
    summary:
      "1-hour in-person Consultation of mental state and feedback, plus 30 minutes to update the Stage 3 proforma.",
    details: [
      "60-minute appointment for assessment + feedback",
      "30 minutes updating the Stage 3 proforma",
    ],
    icon: <ClipboardList className="h-5 w-5" aria-hidden />,
  },
  {
    id: 4,
    name: "Report Compilation",
    durationHours: 2,
    summary:
      "System generates a draft report from all proformas; psychiatrist spends 2 hours finalising and formatting.",
    details: [
      "Automated draft assembled from the three proformas",
      "~120 minutes of clinician time to review, refine, and format",
    ],
    icon: <FileText className="h-5 w-5" aria-hidden />,
  },
];

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalHours = useMemo(() => stages.reduce((acc, s) => acc + s.durationHours, 0), []);

  useEffect(() => {
    // SEO title + description
    const title = "ADHD Assessment Process – 4 Stages (8 Hours Total)";
    const description =
      "Structured 4-stage ADHD assessment: intake, in-person consultations, final Consultation, and report compilation. Total psychiatrist time ~8 hours.";
    document.title = title;

    const ensureMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    ensureMeta("description", description);

    // Canonical tag
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;

    // Structured data (HowTo)
    const howto = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "ADHD Assessment Process",
      description,
      totalTime: "PT8H",
      step: stages.map((s, idx) => ({
        "@type": "HowToStep",
        position: idx + 1,
        name: s.name,
        url: window.location.href + `#stage-${s.id}`,
        totalTime: `PT${Math.floor(s.durationHours)}H${(s.durationHours % 1) * 60 || 0}M`,
        description: s.summary,
      })),
    } as const;

    const scriptId = "ld-howto";
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();
    const scriptEl = document.createElement("script");
    scriptEl.id = scriptId;
    scriptEl.type = "application/ld+json";
    scriptEl.textContent = JSON.stringify(howto);
    document.head.appendChild(scriptEl);
  }, []);

  // Signature interaction: subtle reactive gradient following pointer
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return;
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--pos-x", `${x}%`);
      el.style.setProperty("--pos-y", `${y}%`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={containerRef} className="apple-bg min-h-screen relative">
      <header className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-70 animate-float-slow"
          style={{ backgroundImage: "var(--gradient-hero)" }}
        />
        <div className="container py-14 md:py-20">
          <div className="flex flex-col items-center text-center gap-4 animate-fade-in-up">
            <Badge className="glass-button border-white/20">Clinical Workflow</Badge>
            <h1 className="text-3xl md:text-5xl font-light tracking-tight text-slate-800">
              ADHD Assessment Process – 4 Stages
            </h1>
            <p className="text-slate-600 max-w-2xl font-light">
              A clear, structured pathway from intake to final report. Designed to capture DSM-5 criteria while keeping clinician cognitive load in mind.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mt-4">
              <MetricCard title="Total Time" icon={<Clock className="h-4 w-4" aria-hidden />}>~{totalHours} hours</MetricCard>
              <MetricCard title="Stages" icon={<CheckCircle2 className="h-4 w-4" aria-hidden />}>4</MetricCard>
              <MetricCard title="Cognitive Load" icon={<Brain className="h-4 w-4" aria-hidden />}>High (DSM-5)</MetricCard>
            </div>
          </div>
        </div>
      </header>

      <main className="container pb-16">
        <section aria-labelledby="stages-heading" className="space-y-6">
          <h2 id="stages-heading" className="sr-only">Assessment Stages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stages.map((s) => (
              <Card
                key={s.id}
                id={`stage-${s.id}`}
                className="report-glass text-slate-800 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
              >
                <CardHeader className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-slate-700/10">
                      {s.icon}
                    </span>
                    <span className="text-sm">Stage {s.id}</span>
                  </div>
                  <CardTitle className="text-xl text-slate-800">{s.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-slate-600">
                    <Clock className="h-4 w-4" aria-hidden />
                    <span>{s.durationHours} hours</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">{s.summary}</p>
                  <Separator className="bg-white/20" />
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={`details-${s.id}`}>
                      <AccordionTrigger className="text-slate-700">View details</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                          {s.details.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="container pb-10 text-center text-xs text-slate-500">
        <p>This page is SEO-optimized with a single H1, structured data (HowTo), and a canonical URL.</p>
      </footer>
    </div>
  );
};

function MetricCard({ title, icon, children }: { title: string; icon: JSX.Element; children: React.ReactNode }) {
  return (
    <Card className="report-glass text-slate-800">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-600">{title}</p>
            <p className="text-lg font-medium text-slate-800">{children}</p>
          </div>
          <div className="h-9 w-9 rounded-md bg-slate-700/10 grid place-items-center text-slate-700">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Index;

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Helmet } from "react-helmet-async";
import heroImage from "@/assets/hero-healthcare.jpg";
import { MessageCircle, ShieldCheck, FileText, CalendarDays, PhoneCall, Users, ListChecks, ClipboardList, Send, LifeBuoy, ChevronRight } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: CalendarDays,
      title: "Booking & Referral Management",
      desc: "Simple patient booking and referral intake with Yes/No parameters to streamline triage.",
    },
    {
      icon: PhoneCall,
      title: "Screening Call",
      desc: "Evaluate ADHD suitability and identify possible co-occurrences with guided prompts.",
    },
    {
      icon: Users,
      title: "Stage 1: Family Details Collection",
      desc: "Gather ADHD occurrence and co-occurrence data including relevant family history.",
    },
    {
      icon: ListChecks,
      title: "Stage 2: DSM-5 Categorization",
      desc: "Structured ADHD diagnostic classification aligned with DSM-5 criteria.",
    },
    {
      icon: ClipboardList,
      title: "Stage 3: Conners Questionnaire",
      desc: "Integrated with MHS for automatic sending and feedback preparation.",
    },
    {
      icon: Send,
      title: "Final Report Delivery",
      desc: "Secure, encrypted report delivery to patients and caregivers.",
    },
    {
      icon: LifeBuoy,
      title: "Aftercare Support",
      desc: "Ongoing follow-up, resources, and pathways for continuing care.",
    },
  ];

  const steps = [
    "Booking",
    "Screening",
    "Stage 1",
    "Stage 2",
    "Stage 3",
    "Report",
    "Aftercare",
  ];


  return (
    <>
      <Helmet>
        <title>ADHD Assessment Platform – Streamlined Patient Management</title>
        <meta
          name="description"
          content="Hospital-grade ADHD assessment and patient management platform. From booking to aftercare in one secure system."
        />
        <link rel="canonical" href="/" />
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "PrimaHealth ADHD Platform",
            "url": "/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "/?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
          `}
        </script>
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "PrimaHealth",
            "url": "/",
            "logo": "/favicon.ico",
            "sameAs": []
          }
          `}
        </script>
      </Helmet>

      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/70 bg-background/80 border-b border-border">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-semibold hover-scale">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden />
            <span>PrimaHealth</span>
          </Link>
          <div className="hidden gap-6 md:flex">
            <a href="#features" className="story-link">Features</a>
            <a href="#process" className="story-link">Process</a>
            <a href="#whatsapp" className="story-link">WhatsApp</a>
            
          </div>
          <div className="hidden md:block">
            <Button asChild>
              <Link to="/stage1">Start Now</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section id="home" className="relative overflow-hidden">
          <div
            className="relative mx-auto max-w-7xl px-4 pt-10 pb-16 md:flex md:items-center md:gap-10 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24"
          >
            <div className="relative z-10 max-w-2xl animate-fade-in">
              <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
                Streamlined ADHD Assessment & Patient Management
              </h1>
              <p className="mt-4 text-muted-foreground md:text-lg">
                From first contact to aftercare — all in one secure, easy-to-use platform.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/stage1" aria-label="Start ADHD assessment now">
                    Start Now
                    <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="#features" aria-label="Learn more about platform features">Learn More</a>
                </Button>
              </div>

              {/* Icon row */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card className="hover-scale">
                  <CardHeader className="flex-row items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-primary" aria-hidden />
                    <CardTitle className="text-base">WhatsApp Communication</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="hover-scale">
                  <CardHeader className="flex-row items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" aria-hidden />
                    <CardTitle className="text-base">Digital Terms via WhatsApp</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="hover-scale">
                  <CardHeader className="flex-row items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-primary" aria-hidden />
                    <CardTitle className="text-base">Easy & Secure for Clinicians</CardTitle>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Hero visual */}
            <div className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" aria-hidden />
            <div className="relative mt-8 h-56 w-full overflow-hidden rounded-xl shadow-lg md:mt-0 md:h-80 md:flex-1 lg:h-96">
              <img
                src={heroImage}
                alt="Clinicians supporting a patient in a modern hospital setting"
                loading="eager"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-7xl px-4 py-12">
          <header className="mb-6">
            <h2 className="text-2xl font-semibold">Core Capabilities</h2>
            <p className="text-muted-foreground">Designed for hospital and mental health service workflows.</p>
          </header>
          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="group hover-scale animate-fade-in">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" aria-hidden />
                    </span>
                    <CardTitle className="text-lg">{title}</CardTitle>
                  </div>
                  <CardDescription className="pt-2">{desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" asChild className="justify-start px-0">
                    <Link to={title.includes("Stage 1") ? "/stage1" : title.includes("Stage 2") ? "/stage2" : title.includes("Stage 3") ? "/stage3" : "/"}>
                      Learn more
                      <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Process Stepper */}
        <section id="process" className="mx-auto max-w-7xl px-4 py-12">
          <header className="mb-6">
            <h2 className="text-2xl font-semibold">End-to-End Process</h2>
            <p className="text-muted-foreground">A clear 7-step pathway from booking to aftercare.</p>
          </header>
          <div className="overflow-x-auto">
            <ol className="flex min-w-[640px] items-center gap-4">
              {steps.map((label, idx) => (
                <li key={label} className="flex items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                      {idx + 1}
                    </div>
                    <span className="whitespace-nowrap text-sm">{label}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="h-px w-12 flex-shrink-0 bg-border" aria-hidden />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* WhatsApp Preview */}
        <section id="whatsapp" className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="animate-fade-in">
              <h2 className="text-2xl font-semibold">WhatsApp Communication</h2>
              <p className="mt-2 text-muted-foreground">
                Send screening links, digital terms, and appointment reminders via secure WhatsApp messages.
              </p>
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>Patient-friendly, low-friction engagement</li>
                <li>Time-stamped consent and message history</li>
                <li>Works alongside email and SMS if needed</li>
              </ul>
            </div>
            <Card className="animate-fade-in">
              <CardHeader className="flex-row items-center gap-3 border-b border-border">
                <MessageCircle className="h-5 w-5 text-primary" aria-hidden />
                <div>
                  <CardTitle className="text-base">WhatsApp Preview</CardTitle>
                  <CardDescription>Secure, audit-ready communication</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="flex items-start gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10" aria-hidden />
                  <div className="max-w-[75%] rounded-2xl bg-muted px-3 py-2 text-sm">
                    Hi Sarah, please review our digital Terms of Service and confirm consent.
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <div className="max-w-[75%] rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground">
                    Consent confirmed. Thank you!
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10" aria-hidden />
                  <div className="max-w-[75%] rounded-2xl bg-muted px-3 py-2 text-sm">
                    Your ADHD screening link: example.com/screening — we’ll follow up after completion.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm md:flex-row">
          <p className="text-muted-foreground">© {new Date().getFullYear()} PrimaHealth. All rights reserved.</p>
          <nav className="flex items-center gap-5">
            <a href="#features" className="hover-scale">Features</a>
            <Link to="/report" className="hover-scale">Reports</Link>
            <a href="#" className="hover-scale">Privacy</a>
            <a href="#" className="hover-scale">Contact</a>
          </nav>
        </div>
      </footer>
    </>
  );
}

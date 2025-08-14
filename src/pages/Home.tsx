import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";
import heroImage from "@/assets/hero-healthcare.jpg";
import { MessageCircle, ShieldCheck, FileText, CalendarDays, PhoneCall, Users, ListChecks, ClipboardList, Send, LifeBuoy, ChevronRight } from "lucide-react";

/* --- Expandable chat bubble --- */
function ExpandableBubble({
  text,
  className = "",
  collapsedMaxHeight = 120, // px height when collapsed
  moreLabel = "Read more",
  lessLabel = "Show less",
}) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const needsClamp = el.scrollHeight > collapsedMaxHeight + 4;
    setIsClamped(needsClamp);
  }, [text, collapsedMaxHeight]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={contentRef}
        className="whitespace-pre-line transition-all duration-200 ease-in-out"
        style={{
          maxHeight: expanded ? "none" : collapsedMaxHeight,
          overflow: expanded ? "visible" : "hidden",
        }}
      >
        {text}
      </div>

      {!expanded && isClamped && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-8 h-12 bg-gradient-to-t from-muted to-transparent"
        />
      )}

      {isClamped && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-xs font-medium underline underline-offset-2 text-slate-700 hover:text-slate-900"
          aria-expanded={expanded}
        >
          {expanded ? lessLabel : moreLabel}
        </button>
      )}
    </div>
  );
}

export default function Home() {
  const features = [
    {
      icon: CalendarDays,
      title: "Booking & Referral Management",
      desc: "Simple patient booking and referral intake with Yes/No parameters to streamline triage.",
    },
    {
      icon: PhoneCall,
      title: "Stage 1: Phone Call (Family Details Collection)",
      desc: "Gather ADHD occurrence and co-occurrence data including relevant family history.",
    },
    {
      icon: ClipboardList,
      title: "Stage 1A: Conners Questionnaire",
      desc: "Integrated with MHS for automatic sending and feedback preparation.",
    },
    {
      icon: ListChecks,
      title: "Stage 2: In person Consultation (DSM-5 Categorisation)",
      desc: "Structured ADHD diagnostic classification aligned with DSM-5 criteria.",
    },
    {
      icon: Users,
      title: "Stage 3: In person Consultation (Final Consultation/Feedback)",
      desc: "Face-to-face consultation with detailed feedback and recommendations.",
    },
    {
      icon: Send,
      title: "Final Report Delivery",
      desc: "Secure, encrypted report delivery to parents and GP.",
    },
    {
      icon: LifeBuoy,
      title: "Aftercare Support",
      desc: "Ongoing follow-up, resources, and pathways for continuing care.",
    },
  ];
  
  const steps = [
    "Booking",
    "Stage 1: Phone Consultation (Family Details Collection, etc.,)",
    "Stage 1A: Conners Questionnaire",
    "Stage 2: In person Consultation (DSM-5 Categorisation)",
    "Stage 3: In person Consultation (Final Consultation/Feedback)",
    "Report",
    "Aftercare",
  ];
  

  return (
    <div className="apple-bg">
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

      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/10 border-b border-white/20">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 font-semibold hover-scale">
            <ShieldCheck className="h-5 w-5 text-slate-700" aria-hidden />
            <span className="text-slate-800">PrimaHealth</span>
          </Link>
          <div className="hidden gap-6 md:flex">
            <a href="#features" className="story-link text-slate-700 hover:text-slate-900">Features</a>
            <a href="#process" className="story-link text-slate-700 hover:text-slate-900">Process</a>
            <a href="#whatsapp" className="story-link text-slate-700 hover:text-slate-900">WhatsApp</a>
          </div>
          <div className="hidden md:block">
            <Button asChild className="glass-button text-slate-700 font-medium">
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
                PrimaHealth's ADHD Assessment Pathway
              </h1>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/stage1" aria-label="Start ADHD assessment now">
                    Start Now
                    <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </div>

              {/* Icon row */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card className="hover-scale report-glass">
                  <CardHeader className="flex-row items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-slate-700" aria-hidden />
                    <CardTitle className="text-base text-slate-800">WhatsApp Communication</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="hover-scale report-glass">
                  <CardHeader className="flex-row items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-slate-700" aria-hidden />
                    <CardTitle className="text-base text-slate-800">Easy & Secure Platform for Clinicians</CardTitle>
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
            <p className="text-muted-foreground">Designed for Administrative and Clinical efficiency.</p>
          </header>
          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="group hover-scale animate-fade-in report-glass">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-700/10">
                      <Icon className="h-5 w-5 text-slate-700" aria-hidden />
                    </span>
                    <CardTitle className="text-lg text-slate-800">{title}</CardTitle>
                  </div>
                  <CardDescription className="pt-2 text-slate-600">{desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" asChild className="justify-start px-0 text-slate-700 hover:text-slate-900">
                    <Link to={
                      title.includes("Stage 1") ? "/stage1" :
                      title.includes("Stage 2") ? "/stage2" :
                      title.includes("Stage 3") ? "/stage3" : "/"
                    }>
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
                {/* Long inbound message with Read more */}
                <div className="flex items-start gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10" aria-hidden />
                  <ExpandableBubble
                    className="max-w-[75%] rounded-2xl bg-muted px-3 py-2 text-sm"
                    text={`Hi John,

Ciara from PrimaHealth here, thank you for requesting a call-back.

Please find attached some information about PrimaHealth’s ADHD Assessment Pathway and Terms of Service, including pricing. Please note we currently have a 4-6 month waiting list for assessments.

If you're a parent seeking an ADHD assessment for your child, would you be available for a call in the coming weeks to begin the process? Here is a booking link where you can select a day and time that works best for you: https://PrimaHealthBooking.as.me/Screening-PhoneCall

Otherwise, please let me know how we might be able to assist.

Kind regards,
Ciara Ryan
Care Coordinator/Administrator`}
                  />
                </div>

                {/* Short outbound reply (unchanged) */}
                <div className="flex justify-end gap-2">
                  <div className="max-w-[75%] rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground">
                    Hi Ciara, I’ve booked a call using the link provided for next Tuesday. Thank you!
                  </div>
                </div>

                {/* Follow-up long message with Read more */}
                <div className="flex items-start gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10" aria-hidden />
                  <ExpandableBubble
                    className="max-w-[75%] rounded-2xl bg-muted px-3 py-2 text-sm"
                    text={`Hi John,

Thank you for booking the Screening Call. 

Please note, after the call, we will need the following to proceed further: 
- GP referral letter 
- School email address (for questionnaires to be sent) 
- Any previous diagnosis reports (if applicable)

After our call, and upon receipt of the above documents/information, our consultant psychiatrist will review the case before commencing the assessment process. Please note we currently have a 4-6 month waiting list for assessments.

Your GP can send scanned written referrals in PDF format to info@PrimaHealth.ie, or send them by post to:

PrimaHealth
2.30 Western Gateway Building,
University College Cork, 
Cork
T12 XF62

Please let me know if you have any questions.

Kind regards,
Ciara Ryan
Care Coordinator / Administrator`}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/20 bg-white/5 backdrop-blur-sm">
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
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCaseStore } from "@/store/useCaseStore";
import { ph25Spec } from "@/spec/ph25Spec";
import { renderTemplate } from "@/utils/template";
import { handleReportClick } from "@/utils/navigation";
import { sendEncryptedEmail } from "@/utils/emailService";

export default function Report() {
  const meta = useCaseStore((s) => s.meta);
  const report = useCaseStore((s) => s.report);
  const stage1 = useCaseStore((s) => s.stage1);
  const stage2 = useCaseStore((s) => s.stage2);
  const stage3 = useCaseStore((s) => s.stage3);

  const data = useMemo(() => ({ meta, report, stage1, stage2, stage3 }), [meta, report, stage1, stage2, stage3]);

  // Render two versions:
  // - htmlHighlighted: used in on-screen editing/review (shows subtle yellow highlight)
  // - cleanHtml: used for preview/send/save (no highlight)
  const htmlHighlighted = useMemo(
    () => renderTemplate(ph25Spec.report_template.html, data, { highlightDynamic: true }),
    [data]
  );
  const cleanHtml = useMemo(
    () => renderTemplate(ph25Spec.report_template.html, data, { highlightDynamic: false }).replace(/\n/g, ""),
    [data]
  );

  const updateField = useCaseStore((s) => s.updateField);
  const [open, setOpen] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const reportRef = useRef<HTMLDivElement>(null);

  // Split report content into pages for better navigation
  const reportSections = useMemo(() => {
    if (!htmlHighlighted) return [];
    
    const splits = htmlHighlighted.split('<h2>');
    const sections = [
      { title: "Patient Information & Referral", content: splits[0] + (splits[1] ? '<h2>' + splits[1].split('<h2>')[0] : '') },
      { title: "Developmental & Medical History", content: splits[2] ? '<h2>' + splits[2].split('<h2>')[0] : '' },
      { title: "Clinical Assessment & Observations", content: splits[3] ? '<h2>' + splits[3].split('<h2>')[0] : '' },
      { title: "Diagnosis & Recommendations", content: splits.slice(4).map(section => '<h2>' + section).join('') }
    ].filter(section => section.content && section.content.trim());
    
    return sections;
  }, [htmlHighlighted]);

  const totalPages = Math.max(1, reportSections.length);
  const currentSection = reportSections[currentPage - 1] || { title: "", content: htmlHighlighted };

  const saveReport = async () => {
    const finalText = (new DOMParser().parseFromString(cleanHtml, "text/html")).body.innerText;
    const finalHtml = cleanHtml;
    updateField("report.final_text", finalText);
    updateField("report.final_html", finalHtml);
    toast({
      title: "Report Saved",
      description: "The final report has been saved successfully.",
    });
  };

  const previewReport = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Report Preview</title>
      <style>
        body { 
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial; 
          line-height:1.6; 
          padding:24px; 
          max-width: 8.5in;
          margin: 0 auto;
        }
        .autofill-highlight { 
          background: transparent !important; 
          padding: 0 !important;
        }
        h2 { color: #333; font-size: 1.25rem; margin-top: 2rem; margin-bottom: 1rem; }
        .assessment-table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
        .assessment-table th, .assessment-table td { border: 1px solid #ddd; padding: 0.5rem; }
        .assessment-table th { background-color: #f5f5f5; }
      </style>
    </head><body>
      <div class="page">${cleanHtml}</div>
    </body></html>`);
    w.document.close();
    w.focus();
  };

  useEffect(() => {
    // Setup click handlers for report highlights
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const bindingId = target.getAttribute('data-bind');
      if (bindingId) {
        handleReportClick(bindingId);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="apple-bg min-h-screen">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Top Title */}
        <div className="text-center">
          <h1 className="text-3xl font-light tracking-tight text-slate-800 mb-2">Final Report – Under 12s</h1>
          <p className="text-slate-600 font-light">PrimaHealth ADHD Assessment (PH25)</p>
        </div>

        {/* Section title at top-center */}
        <div className="text-center mb-2">
          <h2 className="text-lg font-medium text-slate-700">
            {totalPages > 1 ? currentSection.title : "Complete Report"}
          </h2>
        </div>

        {/* Three-column layout: left button | report | right button */}
        <div className="grid grid-cols-[96px_minmax(0,1fr)_96px] gap-4">
          {/* Left column: Previous (outside report) */}
          <div className="flex items-center justify-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              ← Previous
            </Button>
          </div>

          {/* Middle column: Report content */}
          <div
            id="reportContent"
            ref={reportRef}
            className="report-glass p-8 min-h-[600px]"
          >
            <article className="prose prose-slate max-w-none">
              <div dangerouslySetInnerHTML={{ __html: totalPages > 1 ? currentSection.content : htmlHighlighted }} />
            </article>
          </div>

          {/* Right column: Next (outside report) */}
          <div className="flex items-center justify-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages <= 1}
            >
              Next →
            </Button>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-wrap gap-3 justify-between items-center">
          {/* Total Pages at Bottom-Left */}
          <div className="text-sm text-muted-foreground">
            {totalPages > 1 ? `Page ${currentPage} of ${totalPages}` : `Single page report`}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={saveReport}>Save Report</Button>
            <Button variant="outline" onClick={previewReport}>Preview & Export</Button>
            <Button onClick={() => setOpen(true)}>Send Encrypted Email</Button>
          </div>
        </div>

        {/* Email dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Encrypted Email</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {emailSending ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Sending encrypted email...</p>
                </div>
              ) : (
                <div className="text-sm space-y-2">
                  <p>✅ Report cleaned of all highlighting</p>
                  <p>✅ PDF generated with professional formatting</p>
                  <p>✅ Encrypted with PrimaHealthID protocol</p>
                  <p>✅ Email sent successfully to GP and parents</p>
                  <p className="text-muted-foreground text-xs mt-2">
                    In production: Secure PDF attachment, delivery confirmation, audit trail
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button 
                onClick={async () => {
                  setEmailSending(true);
                  await sendEncryptedEmail(cleanHtml, meta.gpName || "gp@example.com");
                  setEmailSending(false);
                  toast({
                    title: "Email Sent",
                    description: "Encrypted report sent successfully to all recipients.",
                  });
                  setOpen(false);
                }}
                disabled={emailSending}
              >
                {emailSending ? "Sending..." : "Send Email"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

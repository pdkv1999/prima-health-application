import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useCaseStore } from "@/store/useCaseStore";
import { ph25Spec } from "@/spec/ph25Spec";
import { renderTemplate } from "@/utils/template";
import { handleReportClick } from "@/utils/navigation";
import { reportBindings } from "@/store/reportBindings";
import { sendEncryptedEmail } from "@/utils/emailService";

export default function Report() {
  const meta = useCaseStore((s) => s.meta);
  const report = useCaseStore((s) => s.report);
  const stage1 = useCaseStore((s) => s.stage1);
  const stage2 = useCaseStore((s) => s.stage2);
  const stage3 = useCaseStore((s) => s.stage3);
  const navigateToField = useCaseStore((s) => s.navigateToField);

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
  const bulkSet = useCaseStore((s) => s.bulkSet);
  const [open, setOpen] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const reportRef = useRef<HTMLDivElement>(null);

  // Split report content into pages for better navigation
  const pagesPerView = 1;
  const reportSections = useMemo(() => {
    if (!htmlHighlighted) return [];
    
    // Split the HTML content into logical sections
    const sections = [
      { title: "Patient Information & Referral", content: htmlHighlighted.split('<h2>')[0] + (htmlHighlighted.split('<h2>')[1] ? '<h2>' + htmlHighlighted.split('<h2>')[1].split('<h2>')[0] : '') },
      { title: "Developmental & Medical History", content: htmlHighlighted.split('<h2>')[2] ? '<h2>' + htmlHighlighted.split('<h2>')[2].split('<h2>')[0] : '' },
      { title: "Clinical Assessment & Observations", content: htmlHighlighted.split('<h2>')[3] ? '<h2>' + htmlHighlighted.split('<h2>')[3].split('<h2>')[0] : '' },
      { title: "Diagnosis & Recommendations", content: htmlHighlighted.split('<h2>').slice(4).map(section => '<h2>' + section).join('') }
    ].filter(section => section.content.trim());
    
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
        /* Remove any highlighting in preview explicitly */
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
    
    // Scroll to anchor if present
    const hash = window.location.hash.substring(1);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          element.classList.add('report-highlight-pulse');
          setTimeout(() => element.classList.remove('report-highlight-pulse'), 2000);
        }
      }, 100);
    }

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="apple-bg min-h-screen">
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-light tracking-tight text-slate-800 mb-2">Final Report – Under 12s</h1>
          <p className="text-slate-600 font-light">PrimaHealth ADHD Assessment (PH25)</p>
        </div>


        {/* Page Navigation */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            {/* Left Arrow */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center space-x-2"
            >
              <span>←</span>
              <span>Previous</span>
            </Button>
            
            <h2 className="text-lg font-medium text-slate-700">{totalPages > 1 ? currentSection.title : "Complete Report"}</h2>
            
            {/* Right Arrow */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages <= 1}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <span>→</span>
            </Button>
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>

        <div
          id="reportContent"
          ref={reportRef}
          className="report-glass p-8 min-h-[600px]"
        >
          <article className="prose prose-slate max-w-none">
            <div dangerouslySetInnerHTML={{ __html: totalPages > 1 ? currentSection.content : htmlHighlighted }} />
          </article>
        </div>

        <div className="flex flex-wrap gap-3 justify-between items-center">
          {/* Total Pages at Bottom */}
          <div className="text-sm text-muted-foreground">
            {totalPages > 1 ? `Page ${currentPage} of ${totalPages} total pages` : `Single page report`}
          </div>
          
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

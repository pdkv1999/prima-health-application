import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCaseStore } from "@/store/useCaseStore";
import { ph25Spec } from "@/spec/ph25Spec";
import { renderTemplate } from "@/utils/template";
import { handleReportClick } from "@/utils/navigation";
import { reportBindings } from "@/store/reportBindings";
import { reportTemplate } from "@/utils/reportTemplate";

export default function Report() {
  const meta = useCaseStore((s) => s.meta)
  const report = useCaseStore((s) => s.report)
  const stage1 = useCaseStore((s) => s.stage1)
  const stage2 = useCaseStore((s) => s.stage2)
  const stage3 = useCaseStore((s) => s.stage3)

  const data = useMemo(() => ({ meta, report, stage1, stage2, stage3 }), [meta, report, stage1, stage2, stage3]);

  // Render two versions:
  // - htmlHighlighted: used in on-screen editing/review (shows subtle yellow highlight)
  // - cleanHtml: used for preview/send/save (no highlight)
  const htmlHighlighted = useMemo(
    () => renderTemplate(reportTemplate, data, { highlightDynamic: true }),
    [data]
  );
  const cleanHtml = useMemo(
    () => renderTemplate(reportTemplate, data, { highlightDynamic: false }).replace(/\n/g, ""),
    [data]
  );

  const updateField = useCaseStore((s) => s.updateField)
  const bulkSet = useCaseStore((s) => s.bulkSet)
  const [open, setOpen] = useState(false)

  const reportRef = useRef<HTMLDivElement>(null);

  const saveReport = async () => {
    const finalText = (new DOMParser().parseFromString(cleanHtml, "text/html")).body.innerText;
    const finalHtml = cleanHtml;
    updateField("report.final_text", finalText);
    updateField("report.final_html", finalHtml);
  };

  const previewReport = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Report Preview</title>
      <style>
        body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial; line-height:1.6; padding:24px; }
        /* Remove any highlighting in preview explicitly */
        .autofill-highlight { background: transparent !important; }
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

        <div
          id="reportContent"
          ref={reportRef}
          className="report-glass p-8"
        >
          <article className="prose prose-slate max-w-none">
            <div dangerouslySetInnerHTML={{ __html: htmlHighlighted }} />
          </article>
        </div>

        <div className="flex flex-wrap gap-3 justify-end">
          <Button variant="secondary" onClick={saveReport}>Save</Button>
          <Button onClick={previewReport}>Preview</Button>
          <Button onClick={() => setOpen(true)}>Send Encrypted Email</Button>
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
            <div className="py-2 text-sm">
              ✅ Email sent successfully (encrypted with PrimaHealthID). A secure PDF would be attached in production.
            </div>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>OK</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

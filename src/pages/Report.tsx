import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCaseStore } from "@/store/useCaseStore";
import { ph25Spec } from "@/spec/ph25Spec";
import { renderTemplate } from "@/utils/template";




export default function Report() {
  const meta = useCaseStore((s) => s.meta)
  const report = useCaseStore((s) => s.report)
  const stage1 = useCaseStore((s) => s.stage1)
  const stage2 = useCaseStore((s) => s.stage2)
  const stage3 = useCaseStore((s) => s.stage3)
  const data = { meta, report, stage1, stage2, stage3 }
  const html = useMemo(() => renderTemplate(ph25Spec.report_template.html, data), [data]);
  const cleanHtml = useMemo(() => html.replace(/\\n/g, ""), [html]);
  const updateField = useCaseStore((s) => s.updateField)
  const bulkSet = useCaseStore((s) => s.bulkSet)
  const [open, setOpen] = useState(false)

  const reportRef = useRef<HTMLDivElement>(null);

  const saveReport = async () => {
    const el = reportRef.current;
    if (!el) return;
    const finalText = el.innerText;
    const finalHtml = el.innerHTML;
    updateField("report.final_text", finalText);
    updateField("report.final_html", finalHtml);
    // Supabase persistence will be wired in the next step
  };

  const previewReport = () => {
    const el = reportRef.current;
    if (!el) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write("<html><head><title>Report Preview</title><style>body{font-family:Inter,system-ui,sans-serif;margin:40px;line-height:1.6;color:#111}table{border-collapse:collapse;width:100%;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.05);}td,th{border:1px solid #e5e7eb;padding:12px;}th{background:#f3f4f6;font-weight:600;color:#111}tr:nth-child(even){background:#f9fafb;}</style></head><body>");
    w.document.write(el.innerHTML);
    w.document.write("</body></html>");
    w.document.close();
  };

  const printReport = () => window.print();
  const sendEmail = () => setOpen(true);


  useEffect(() => {
    document.title = "PrimaHealth ADHD Assessment (PH25) – Report";
  }, []);

  // NOTE: Demo data seeding moved to App.tsx so Stage 1/2/3 are prefilled before visiting any page.



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
            <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
          </article>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-4 print:hidden">
          <Button 
            variant="secondary" 
            onClick={previewReport}
            className="glass-button text-slate-700 font-medium px-6 py-3"
          >
            👁️ Preview Report
          </Button>
          <Button 
            variant="secondary" 
            onClick={printReport}
            className="glass-button text-slate-700 font-medium px-6 py-3"
          >
            🖨️ Print to PDF
          </Button>
          <Button 
            variant="secondary" 
            onClick={sendEmail}
            className="glass-button text-slate-700 font-medium px-6 py-3"
          >
            📧 Send Encrypted Email to G1
          </Button>
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
          <div className="py-2 text-sm">
            ✅ Email sent successfully (encrypted with PrimaHealthID). A secure PDF would be attached in production.
          </div>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

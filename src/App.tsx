import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Stage1 from "@/pages/Stage1";
import Stage2 from "@/pages/Stage2";
import Stage3 from "@/pages/Stage3";
import Report from "@/pages/Report";
import Analytics from "@/pages/Analytics";
import Transcription from "@/pages/Transcription";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { useCaseStore } from "@/store/useCaseStore";
import { getMayaSeed } from "@/utils/seedMaya";

const queryClient = new QueryClient();

const App = () => {
  const report = useCaseStore((s) => s.report);
  const bulkSet = useCaseStore((s) => s.bulkSet);

  useEffect(() => {
    // Seed demo content once at app start so all stages are prefilled
    // @ts-ignore dynamic flag on report
    if ((report as any)?.__applied_maya_content_v1) return;
    const seed = getMayaSeed(report);
    bulkSet({
      meta: seed.meta,
      stage1: seed.stage1,
      stage2: seed.stage2,
      stage3: seed.stage3,
      report: { ...(report as any), ...seed.reportPatch, __applied_maya_content_v1: true },
    });
  }, [report, bulkSet]);

  // Ensure key Stage 1 fields are prefilled in the form if empty
  useEffect(() => {
    const s = useCaseStore.getState();
    const seed = getMayaSeed(s.report);
    const patch: any = { ...s.stage1 };
    let changed = false;
    if (!patch?.medicalHistory || String(patch.medicalHistory).trim() === "") {
      patch.medicalHistory = seed.stage1.medicalHistory;
      changed = true;
    }
    if (!patch?.referralBackground || String(patch.referralBackground).trim() === "") {
      patch.referralBackground = seed.stage1.referralBackground;
      changed = true;
    }
    if (changed) bulkSet({ stage1: patch });
  }, [bulkSet]);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/stage1" element={<Stage1 />} />
                <Route path="/stage2" element={<Stage2 />} />
                <Route path="/stage3" element={<Stage3 />} />
                {/* New dedicated route for the transcription demo */}
                <Route path="/transcription" element={<Transcription />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/report" element={<Report />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;

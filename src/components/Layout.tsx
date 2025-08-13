import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useEffect, useRef } from "react";
import { useCaseStore, appName } from "@/store/useCaseStore";
import { toast } from "@/hooks/use-toast";

function useAutosaveToast() {
  const mounted = useRef(false);
  useEffect(() => {
    let timeout: any;
    const unsub = useCaseStore.subscribe(() => {
      if (!mounted.current) {
        mounted.current = true;
        return;
      }
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        toast({ description: "Saved" });
      }, 600);
    });
    return () => {
      clearTimeout(timeout);
      unsub();
    };
  }, []);
}

export default function Layout() {
  const rawRef = useCaseStore((s) => s.meta?.refNumber || s.stage1?.refNumber || "—");
  const rawClient = useCaseStore((s) => s.meta?.clientName || s.stage1?.clientName || "—");

  // Mask sensitive identifiers in UI
  const refNumber = "D-0001";
  const clientName = "Alex Morgan";

  useAutosaveToast();

  useEffect(() => {
    document.title = `${appName} – ${clientName}`;
  }, [clientName]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center justify-between border-b px-3 bg-gradient-to-r from-secondary to-accent/40 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-sm font-medium">{appName}</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Ref: PH25 - {refNumber} • Patient: {clientName}
            </div>
          </header>
          <main className="p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

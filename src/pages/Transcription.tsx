import { useEffect } from "react";
import TranscriptionPanel from "@/components/TranscriptionPanel";

export default function Transcription() {
  useEffect(() => {
    const title = "PrimaHealth – Transcription & Auto-Populate";
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

    ensureMeta(
      "description",
      "Transcription & auto-populate: upload audio/text or paste transcripts to map data into case fields securely."
    );

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;
  }, []);

  return (
    <div className="grid gap-6">
      <h1 className="text-xl font-semibold">Transcription & Auto-Populate (Demo)</h1>
      <TranscriptionPanel />
    </div>
  );
}

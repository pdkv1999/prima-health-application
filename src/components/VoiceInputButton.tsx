import * as React from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface VoiceInputButtonProps {
  onResult: (text: string) => void;
  className?: string;
  label?: string;
}

export function VoiceInputButton({ onResult, className, label = "Speak" }: VoiceInputButtonProps) {
  const [listening, setListening] = React.useState(false);
  const recognitionRef = React.useRef<any>(null);

  const supported = typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const stop = React.useCallback(() => {
    try {
      recognitionRef.current?.stop?.();
    } catch {}
    setListening(false);
  }, []);

  const start = React.useCallback(() => {
    if (!supported) {
      toast({ title: "Voice input unavailable", description: "Your browser does not support speech recognition." });
      return;
    }
    try {
      const Rec: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new Rec();
      recognitionRef.current = rec;
      let finalTranscript = "";
      rec.lang = (navigator.language || "en-GB");
      rec.continuous = false;
      rec.interimResults = true;

      rec.onstart = () => setListening(true);
      rec.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          }
        }
      };
      rec.onerror = (e: any) => {
        setListening(false);
        toast({ title: "Microphone error", description: e?.error || "Could not capture audio." });
      };
      rec.onend = () => {
        setListening(false);
        const text = finalTranscript.trim();
        if (text) onResult(text);
      };

      rec.start();
    } catch (e: any) {
      setListening(false);
      toast({ title: "Voice input failed", description: e?.message || "Please check microphone permissions." });
    }
  }, [onResult, supported]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button type="button" variant="secondary" size="sm" onClick={listening ? stop : start} aria-pressed={listening} aria-label={label}>
        {listening ? <Square className="shrink-0" /> : <Mic className="shrink-0" />}
        <span>{listening ? "Stop" : label}</span>
      </Button>
      <span className="text-xs text-muted-foreground" aria-live="polite">
        {supported ? (listening ? "Listening…" : "") : "Not supported"}
      </span>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { returnToReport } from "@/utils/navigation";

export function ReturnToReportButton() {
  const returnAnchor = localStorage.getItem('returnAnchor');
  
  if (!returnAnchor) return null;
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => returnToReport()}
      className="mb-4"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back to Report
    </Button>
  );
}
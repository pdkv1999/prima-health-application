import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCaseStore } from "@/store/useCaseStore";
import { ph25Spec } from "@/spec/ph25Spec";
import RoleAnalyticsCard from "@/components/analytics/RoleAnalyticsCard";
import StageAnalyticsChart from "@/components/analytics/StageAnalyticsChart";
import SavingsOverviewCard from "@/components/analytics/SavingsOverviewCard";
import ThroughputChart from "@/components/analytics/ThroughputChart";
import { Download, Calculator, RefreshCw } from "lucide-react";

export default function Analytics() {
  const [caseCount, setCaseCount] = useState<number>(50);

  // Role-specific data with hourly rates and time improvements
  const roleData = [
    {
      role: "Associate Psychologist",
      beforeTimePerCase: 1.5,
      afterTimePerCase: 0.5,
      hourlyRate: 40,
      description: "Pre-assessment tasks, patient communications, and documentation"
    },
    {
      role: "Care Coordinator", 
      beforeTimePerCase: 2.0,
      afterTimePerCase: 0.8,
      hourlyRate: 35,
      description: "Scheduling, follow-ups, and data entry coordination"
    },
    {
      role: "Care Manager",
      beforeTimePerCase: 1.2,
      afterTimePerCase: 0.4,
      hourlyRate: 45,
      description: "Case progress tracking and stakeholder coordination"
    }
  ];

  // Clinical stage-wise data
  const clinicalStages = [
    {
      stage: "Stage 1\nInitial Assessment",
      beforeTime: 2.5,
      afterTime: 1.0,
      description: "Initial patient assessment and screening"
    },
    {
      stage: "Stage 2\nDiagnostic Evaluation", 
      beforeTime: 3.0,
      afterTime: 1.5,
      description: "Comprehensive diagnostic evaluation"
    },
    {
      stage: "Stage 3\nFinal Consultation",
      beforeTime: 1.5,
      afterTime: 0.8,
      description: "Final consultation and treatment planning"
    },
    {
      stage: "Report Review",
      beforeTime: 1.0,
      afterTime: 0.3,
      description: "Report generation and review process"
    }
  ];

  // Calculate overall savings (time-focused)
  const calculateSavings = () => {
    const roleSavings = roleData.reduce((acc, role) => {
      const timeSaved = (role.beforeTimePerCase - role.afterTimePerCase) * caseCount;
      return acc + timeSaved;
    }, 0);

    const stageSavings = clinicalStages.reduce((acc, stage) => {
      const timeSaved = (stage.beforeTime - stage.afterTime) * caseCount;
      return acc + timeSaved;
    }, 0);

    const totalTimeSaved = roleSavings + stageSavings;
    
    const totalTimeBefore = roleData.reduce((acc, role) => acc + (role.beforeTimePerCase * caseCount), 0) +
                           clinicalStages.reduce((acc, stage) => acc + (stage.beforeTime * caseCount), 0);
    
    const averageEfficiencyGain = Math.round((totalTimeSaved / totalTimeBefore) * 100);
    const additionalCasesCapacity = Math.round((totalTimeSaved / (totalTimeBefore / caseCount)) * 0.8); // Conservative estimate
    const throughputImprovement = Math.round(((totalTimeBefore / (totalTimeBefore - totalTimeSaved)) - 1) * 100);

    return {
      totalTimeSaved,
      averageEfficiencyGain,
      additionalCasesCapacity,
      throughputImprovement
    };
  };

  const savingsData = calculateSavings();

  useEffect(() => {
    document.title = "Impact Analysis Dashboard – PrimaHealth ADHD (PH25)";
    const desc =
      "Comprehensive impact analysis showing role-wise and stage-wise efficiency gains, time savings, and throughput improvements for ADHD assessments.";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", desc);

    // Canonical tag
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", window.location.href);
  }, []);

  const handleExportReport = () => {
    // This would implement PDF/image export functionality
    console.log("Exporting analytics report...");
  };

  const handleRecalculate = () => {
    // Force recalculation - useful for demonstration
    console.log("Recalculating with", caseCount, "cases");
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-light tracking-tight text-slate-800 mb-3">
          Impact Analysis Dashboard
        </h1>
        <p className="text-lg text-slate-600 font-light mb-6">
          Stage-Wise Efficiency Gains & Role-Based Performance Tracking
        </p>
        <Badge variant="outline" className="text-sm px-4 py-2">
          Real-Time Analytics & Dynamic Calculations
        </Badge>
      </div>

      <div className="report-glass p-8 space-y-8">
        {/* Input Controls */}
        <header className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Calculator className="h-5 w-5 text-slate-600" />
              <label htmlFor="case-input" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Number of Cases:
              </label>
              <Input
                id="case-input"
                type="number"
                className="w-24 h-9"
                value={caseCount}
                min={1}
                max={1000}
                onChange={(e) => setCaseCount(Math.max(1, Math.min(1000, Number(e.target.value || 1))))}
              />
            </div>
            <Button 
              onClick={handleRecalculate}
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Recalculate
            </Button>
          </div>
          
          <Button 
            onClick={handleExportReport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </header>

        {/* Overall Impact Summary */}
        <SavingsOverviewCard 
          savingsData={savingsData}
          caseCount={caseCount}
        />

        {/* Role-Based Analysis */}
        <section>
          <h2 className="text-2xl font-light text-slate-800 mb-6">Role-Based Impact Analysis</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {roleData.map((role, index) => (
              <RoleAnalyticsCard
                key={index}
                roleData={role}
                caseCount={caseCount}
              />
            ))}
          </div>
        </section>

        {/* Stage-Wise Clinical Analysis */}
        <section>
          <h2 className="text-2xl font-light text-slate-800 mb-6">Clinical Stage-Wise Analysis</h2>
          <StageAnalyticsChart
            stageData={clinicalStages}
            caseCount={caseCount}
            title="Clinician Time per Stage (Before vs After)"
          />
        </section>

        {/* Throughput Analysis */}
        <section>
          <h2 className="text-2xl font-light text-slate-800 mb-6">Throughput & Capacity Analysis</h2>
          <ThroughputChart caseCount={caseCount} />
        </section>

        {/* Impact Summary Footer */}
        <footer className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
              System Implementation Benefits
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              The analysis demonstrates significant improvements across all roles and stages, with measurable time savings 
              and enhanced throughput. These metrics provide concrete evidence of system effectiveness 
              and efficiency gains for stakeholder reporting.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

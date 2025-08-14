import { reportBindings } from "@/store/reportBindings";

// Focus a specific field element
export const focusField = (fieldKey: string) => {
  setTimeout(() => {
    const element = document.getElementById(`field-${fieldKey}`) || 
                   document.querySelector(`[data-field="${fieldKey}"]`) ||
                   document.querySelector(`input[name="${fieldKey}"]`) ||
                   document.querySelector(`textarea[name="${fieldKey}"]`);
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        element.focus();
      }
      // Add temporary highlight
      element.classList.add('field-highlight');
      setTimeout(() => element.classList.remove('field-highlight'), 2000);
    }
  }, 100);
};

// Handle click on report highlight
export const handleReportClick = (bindingId: string) => {
  const binding = reportBindings.find(b => b.id === bindingId);
  if (!binding) return;
  
  const [stage, field] = binding.path.split('.');
  const stageRoutes = { 
    stage1: '/stage1', 
    stage2: '/stage2', 
    stage3: '/stage3' 
  };
  
  if (stageRoutes[stage as keyof typeof stageRoutes]) {
    // Store the field to focus and the return anchor
    localStorage.setItem('focusField', field);
    localStorage.setItem('returnAnchor', bindingId);
    window.location.href = stageRoutes[stage as keyof typeof stageRoutes];
  }
};

// Return to report with anchor
export const returnToReport = (anchorId?: string) => {
  const anchor = anchorId || localStorage.getItem('returnAnchor');
  localStorage.removeItem('focusField');
  localStorage.removeItem('returnAnchor');
  
  if (anchor) {
    window.location.href = `/report#${anchor}`;
  } else {
    window.location.href = '/report';
  }
};

// Check if all required fields are filled
export const validateCompleteness = (stageData: any): { isComplete: boolean; missing: string[] } => {
  const missing: string[] = [];
  
  const checkValue = (value: any): boolean => {
    if (value == null) return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
  };
  
  const checkObject = (obj: any, prefix = '') => {
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        checkObject(value, fullKey);
      } else if (!checkValue(value)) {
        missing.push(fullKey);
      }
    });
  };
  
  checkObject(stageData);
  
  return {
    isComplete: missing.length === 0,
    missing
  };
};
/**
 * BuildFlow ERP — Project module dropdown constants
 */

export const PROJECT_CATEGORIES = [
  { value: 'architecture_consultancy', label: 'Architecture Consultancy', description: 'Planning, designing, drawings, approvals' },
  { value: 'construction', label: 'Construction', description: 'Construction work only' },
  { value: 'interior_design', label: 'Interior Design', description: 'Interior designing and execution' },
  { value: 'layout_development', label: 'Layout Development', description: 'Land development into plots' },
  { value: 'plotting_survey', label: 'Plotting & Survey', description: 'Land surveying and plotting services' },
  { value: 'renovation', label: 'Renovation', description: 'Renovation and remodeling work' },
] as const;

export const PROJECT_TYPE_GROUPS = [
  {
    label: 'Residential',
    options: [
      { value: 'independent_house', label: 'Independent House' },
      { value: 'villa', label: 'Villa' },
      { value: 'apartment', label: 'Apartment' },
      { value: 'row_house', label: 'Row House' },
    ],
  },
  {
    label: 'Commercial',
    options: [
      { value: 'office_building', label: 'Office Building' },
      { value: 'shopping_complex', label: 'Shopping Complex' },
      { value: 'mall', label: 'Mall' },
      { value: 'hotel', label: 'Hotel' },
      { value: 'hospital', label: 'Hospital' },
    ],
  },
  {
    label: 'Industrial',
    options: [
      { value: 'factory', label: 'Factory' },
      { value: 'warehouse', label: 'Warehouse' },
    ],
  },
  {
    label: 'Infrastructure',
    options: [
      { value: 'road', label: 'Road' },
      { value: 'layout', label: 'Layout' },
      { value: 'school', label: 'School' },
      { value: 'college', label: 'College' },
    ],
  },
  {
    label: 'Agriculture',
    options: [
      { value: 'farm_house', label: 'Farm House' },
      { value: 'resort', label: 'Resort' },
    ],
  },
] as const;

export const OWNERSHIP_TYPES = [
  { value: 'self_owned', label: 'Self Owned', description: 'Company-owned project' },
  { value: 'client_owned', label: 'Client Owned', description: 'Client land; company executes; client pays' },
  { value: 'joint_venture', label: 'Joint Venture', description: 'Land owner and company jointly develop' },
  { value: 'partnership', label: 'Partnership', description: 'Multiple partners/investors participate' },
] as const;

export const PAYMENT_TERMS = [
  { value: 'fixed_price', label: 'Fixed Price' },
  { value: 'monthly_billing', label: 'Monthly Billing' },
  { value: 'running_bill', label: 'Running Bill' },
  { value: 'milestone_based', label: 'Milestone Based (slab wise)' },
  { value: 'time_material', label: 'Time & Material' },
  { value: 'custom', label: 'Custom' },
] as const;

export const LAND_AREA_UNITS = [
  { value: 'sq_ft', label: 'Sq. Ft.' },
  { value: 'sq_m', label: 'Sq. M.' },
  { value: 'acres', label: 'Acres' },
  { value: 'guntha', label: 'Guntha' },
  { value: 'hectare', label: 'Hectare' },
] as const;

export const BUILT_AREA_UNITS = [
  { value: 'sq_ft', label: 'Sq. Ft.' },
  { value: 'sq_m', label: 'Sq. M.' },
] as const;

export const DOCUMENT_TYPES = [
  'Client Agreement',
  'Site Layout Plan',
  'Architectural Drawings',
  'Building Plans',
  'Survey Documents',
  'Government Approvals',
  'NOC Documents',
  'Estimation/BOQ',
  'Site Photographs',
  'Other Supporting Document',
] as const;

export const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx'];

export function getProjectTypeLabel(value: string): string {
  for (const group of PROJECT_TYPE_GROUPS) {
    const match = group.options.find((o) => o.value === value);
    if (match) return match.label;
  }
  return value;
}

export function getCategoryLabel(value: string): string {
  return PROJECT_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function getOwnershipLabel(value: string): string {
  return OWNERSHIP_TYPES.find((o) => o.value === value)?.label ?? value;
}

export function getPaymentTermsLabel(value: string): string {
  return PAYMENT_TERMS.find((p) => p.value === value)?.label ?? value;
}

export function getAreaUnitLabel(value: string): string {
  return LAND_AREA_UNITS.find((u) => u.value === value)?.label ?? value;
}

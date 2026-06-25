/**
 * BuildFlow ERP — TypeScript Type Definitions
 */

// ============ Auth ============
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role: 'admin' | 'accountant' | 'sales' | 'manager';
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'accountant' | 'sales' | 'manager';
  is_active: boolean;
}

// ============ Common ============
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  search?: string;
}

// ============ Project ============
export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  budget: number;
  spent: number;
  status: ProjectStatus;
  start_date: string | null;
  end_date: string | null;
  progress_percent: number;
  location: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectExpense {
  id: string;
  project_id: string;
  expense_type: 'material' | 'labor' | 'equipment' | 'overhead' | 'other';
  description: string | null;
  amount: number;
  expense_date: string | null;
  vendor_name: string | null;
  receipt_url: string | null;
  created_by: string | null;
  created_at: string;
}

export interface ProjectDocument {
  id: string;
  project_id: string;
  title: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  uploaded_by: string | null;
  created_at: string;
}

// ============ Contractor ============
export interface Contractor {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  specialty: string | null;
  bank_details: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface ContractorPayment {
  id: string;
  contractor_id: string;
  project_id: string | null;
  amount: number;
  payment_date: string | null;
  due_date: string | null;
  status: PaymentStatus;
  notes: string | null;
  approved_by: string | null;
  created_at: string;
}

// ============ Employee ============
export interface Employee {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  designation: string | null;
  department: string | null;
  base_salary: number;
  joining_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SalaryPayment {
  id: string;
  employee_id: string;
  amount: number;
  deductions: number;
  bonus: number;
  net_amount: number;
  month_year: string;
  payment_date: string | null;
  status: 'pending' | 'paid';
  created_at: string;
}

// ============ Office Expense ============
export interface OfficeExpense {
  id: string;
  category: 'rent' | 'utilities' | 'supplies' | 'maintenance' | 'misc';
  description: string | null;
  amount: number;
  expense_date: string | null;
  receipt_url: string | null;
  created_by: string | null;
  created_at: string;
}

// ============ Investment ============
export interface Investment {
  id: string;
  property_name: string;
  property_type: string | null;
  location: string | null;
  total_value: number;
  amount_paid: number;
  remaining_balance: number;
  purchase_date: string | null;
  status: 'active' | 'sold' | 'cancelled';
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvestmentPayment {
  id: string;
  investment_id: string;
  amount: number;
  payment_date: string | null;
  due_date: string | null;
  payment_type: 'receivable' | 'payable';
  status: 'pending' | 'received' | 'paid' | 'overdue';
  notes: string | null;
  created_at: string;
}

// ============ Property & Sales ============
export interface PropertyUnit {
  id: string;
  project_id: string | null;
  unit_number: string;
  unit_type: string | null;
  area_sqft: number | null;
  price: number;
  status: 'available' | 'reserved' | 'sold';
  floor: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  cnic: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertySale {
  id: string;
  property_id: string;
  customer_id: string;
  total_price: number;
  discount: number;
  net_price: number;
  amount_paid: number;
  outstanding_balance: number;
  sale_date: string | null;
  agreement_date: string | null;
  status: 'active' | 'completed' | 'cancelled';
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface InstallmentSchedule {
  id: string;
  sale_id: string;
  installment_number: number;
  amount: number;
  due_date: string;
  paid_date: string | null;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  paid_amount: number;
  notes: string | null;
  created_at: string;
}

// ============ Loan ============
export interface Loan {
  id: string;
  loan_type: 'lent' | 'borrowed';
  party_name: string;
  party_phone: string | null;
  principal_amount: number;
  amount_paid: number;
  outstanding_balance: number;
  interest_rate: number;
  loan_date: string | null;
  due_date: string | null;
  status: 'active' | 'settled' | 'defaulted';
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoanPayment {
  id: string;
  loan_id: string;
  amount: number;
  payment_date: string | null;
  notes: string | null;
  recorded_by: string | null;
  created_at: string;
}

// ============ Dashboard ============
export interface DashboardKPI {
  total_revenue: number;
  total_expenses: number;
  outstanding_payments: number;
  active_projects: number;
  total_investments: number;
  net_profit: number;
  revenue_trend: number;
  expense_trend: number;
  outstanding_trend: number;
  projects_trend: number;
  investments_trend: number;
  profit_trend: number;
}

export interface RevenueSummary {
  month: string;
  revenue: number;
  expenses: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  user_name: string;
  created_at: string;
}

// ============ Notification ============
export interface Notification {
  id: string;
  title: string;
  message: string | null;
  type: 'info' | 'warning' | 'success' | 'error';
  is_read: boolean;
  link: string | null;
  created_at: string;
}

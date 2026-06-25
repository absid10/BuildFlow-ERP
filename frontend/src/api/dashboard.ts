/**
 * BuildFlow ERP — Dashboard API (MOCKED FOR OFFLINE DEMO)
 */

import type { DashboardKPI, RevenueSummary, RecentActivity } from '../types';

export const dashboardApi = {
  getKPIs: async (): Promise<DashboardKPI> => {
    return {
      total_revenue: 1250000,
      total_expenses: 850000,
      outstanding_payments: 120000,
      active_projects: 12,
      total_investments: 3500000,
      net_profit: 400000,
      revenue_trend: 12.5,
      expense_trend: -5.2,
      outstanding_trend: 2.1,
      projects_trend: 15.0,
      investments_trend: 8.4,
      profit_trend: 10.5,
    };
  },

  getRevenueSummary: async (): Promise<RevenueSummary[]> => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((m, i) => ({
      month: m,
      revenue: 100000 + i * 15000,
      expenses: 60000 + i * 8000
    }));
  },

  getRecentActivity: async (): Promise<RecentActivity[]> => {
    return [
      {
        id: "1",
        action: "Created new project",
        entity_type: "Project",
        entity_id: "proj_1",
        user_name: "Admin User",
        created_at: new Date().toISOString()
      },
      {
        id: "2",
        action: "Approved payment",
        entity_type: "Payment",
        entity_id: "pay_1",
        user_name: "John Doe",
        created_at: new Date(Date.now() - 7200000).toISOString()
      }
    ];
  },
};

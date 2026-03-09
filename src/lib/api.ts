/**
 * API Service for Sales Analytics Dashboard
 * Handles all communication with the backend API
 * Uses Next.js API routes as proxy with fallback data
 */

export interface SalesSummary {
  total_revenue: number;
  total_profit: number;
  total_orders: number;
  avg_order_value: number;
  revenue_growth: number;
  profit_growth: number;
  profit_margin: number;
}

export interface MonthlyData {
  year_month: string;
  month: string;
  sales: number;
  profit: number;
  quantity: number;
  orders: number;
}

export interface MonthlySalesResponse {
  data: MonthlyData[];
  highest_month: { month: string; sales: number } | null;
  lowest_month: { month: string; sales: number } | null;
}

export interface TopProduct {
  product: string;
  revenue: number;
  profit: number;
  quantity: number;
  orders: number;
  profit_margin: number;
}

export interface CategoryDistribution {
  category: string;
  sales: number;
  profit: number;
  quantity: number;
  percentage: number;
}

export interface TopProductsResponse {
  top_products: TopProduct[];
  category_distribution: CategoryDistribution[];
}

export interface RegionalData {
  region: string;
  revenue: number;
  profit: number;
  quantity: number;
  orders: number;
  profit_margin: number;
  percentage: number;
}

export interface RegionalSalesResponse {
  data: RegionalData[];
  best_region: RegionalData | null;
  worst_region: RegionalData | null;
}

export interface ProfitRevenueData {
  product: string;
  revenue: number;
  profit: number;
  quantity: number;
  category: string;
  profit_margin: number;
  classification: string;
}

export interface Insight {
  type: string;
  icon: string;
  title: string;
  description: string;
  metric: string;
  recommendation: string;
}

export interface FilterOptions {
  years: number[];
  regions: string[];
  categories: string[];
}

// API fetch functions using Next.js API routes as proxy
async function fetchAPI<T>(endpoint: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL('/api/sales', window.location.origin);
  url.searchParams.append('endpoint', endpoint);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export const api = {
  getSalesSummary: () => fetchAPI<SalesSummary>('/api/sales-summary'),
  
  getMonthlySales: (year?: number, region?: string, category?: string) => 
    fetchAPI<MonthlySalesResponse>('/api/monthly-sales', { 
      year: year?.toString(), 
      region, 
      category 
    }),
  
  getTopProducts: (limit: number = 10) => 
    fetchAPI<TopProductsResponse>('/api/top-products', { limit }),
  
  getRegionalSales: () => fetchAPI<RegionalSalesResponse>('/api/regional-sales'),
  
  getProfitRevenue: () => fetchAPI<ProfitRevenueData[]>('/api/profit-revenue'),
  
  getInsights: () => fetchAPI<Insight[]>('/api/insights'),
  
  getFilterOptions: () => fetchAPI<FilterOptions>('/api/filter-options'),
};

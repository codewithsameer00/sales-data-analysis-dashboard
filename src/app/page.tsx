/**
 * Sales Data Analysis & Business Insights Dashboard
 * Main page component with all dashboard features
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Package,
  Map,
  Lightbulb,
  LayoutDashboard,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

// Components
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { KPICard } from '@/components/dashboard/KPICard';
import { InsightsGrid } from '@/components/dashboard/InsightsCard';
import { SalesTrendChart } from '@/components/charts/SalesTrendChart';
import { TopProductsChart } from '@/components/charts/TopProductsChart';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { RegionalSalesChart } from '@/components/charts/RegionalSalesChart';
import { ProfitRevenueChart } from '@/components/charts/ProfitRevenueChart';

// API and types
import { api, SalesSummary, MonthlySalesResponse, TopProductsResponse, RegionalSalesResponse, ProfitRevenueData, Insight, FilterOptions } from '@/lib/api';

// Section configuration
const sectionConfig = {
  dashboard: { title: 'Dashboard Overview', subtitle: 'Monitor your sales performance at a glance' },
  trends: { title: 'Sales Trends', subtitle: 'Analyze monthly sales performance and patterns' },
  products: { title: 'Product Analysis', subtitle: 'Explore top products and category distribution' },
  regions: { title: 'Regional Performance', subtitle: 'Compare sales across different regions' },
  insights: { title: 'Business Insights', subtitle: 'AI-powered recommendations for your business' },
};

export default function Dashboard() {
  // State management
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data state
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [monthlySales, setMonthlySales] = useState<MonthlySalesResponse | null>(null);
  const [topProducts, setTopProducts] = useState<TopProductsResponse | null>(null);
  const [regionalSales, setRegionalSales] = useState<RegionalSalesResponse | null>(null);
  const [profitRevenueData, setProfitRevenueData] = useState<ProfitRevenueData[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);

  // Filter state
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch all data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [
        summary,
        monthly,
        products,
        regional,
        profitRevenue,
        insightsData,
        filters,
      ] = await Promise.all([
        api.getSalesSummary(),
        api.getMonthlySales(selectedYear, selectedRegion === 'all' ? undefined : selectedRegion, selectedCategory === 'all' ? undefined : selectedCategory),
        api.getTopProducts(10),
        api.getRegionalSales(),
        api.getProfitRevenue(),
        api.getInsights(),
        api.getFilterOptions(),
      ]);

      setSalesSummary(summary);
      setMonthlySales(monthly);
      setTopProducts(products);
      setRegionalSales(regional);
      setProfitRevenueData(profitRevenue);
      setInsights(insightsData);
      setFilterOptions(filters);
    } catch (err) {
      setError('Failed to load dashboard data. Please check if the backend server is running.');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedYear, selectedRegion, selectedCategory]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle section change
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  // Handle filter changes
  const handleYearChange = (year: number | undefined) => {
    setSelectedYear(year);
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="animate-pulse bg-gray-100 h-32 rounded-2xl"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-pulse bg-gray-100 h-80 rounded-xl" />
        <div className="animate-pulse bg-gray-100 h-80 rounded-xl" />
      </div>
    </div>
  );

  // Error state
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Data</h2>
      <p className="text-gray-500 mb-4 max-w-md">{error}</p>
      <button
        onClick={fetchData}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Retry
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={handleSidebarToggle}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Main Content */}
      <motion.div
        initial={false}
        animate={{ marginLeft: sidebarOpen ? 240 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen transition-all duration-300 lg:ml-60 ml-0"
      >
        {/* Header */}
        <Header
          title={sectionConfig[activeSection as keyof typeof sectionConfig]?.title || 'Dashboard'}
          subtitle={sectionConfig[activeSection as keyof typeof sectionConfig]?.subtitle}
          filterOptions={filterOptions || undefined}
          selectedYear={selectedYear}
          selectedRegion={selectedRegion}
          selectedCategory={selectedCategory}
          onYearChange={handleYearChange}
          onRegionChange={handleRegionChange}
          onCategoryChange={handleCategoryChange}
          showFilters={activeSection === 'trends'}
        />

        {/* Content */}
        <main className="p-6">
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Dashboard Section */}
                {activeSection === 'dashboard' && (
                  <div className="space-y-6">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <KPICard
                        title="Total Revenue"
                        value={salesSummary?.total_revenue || 0}
                        prefix="$"
                        change={salesSummary?.revenue_growth}
                        icon="dollar"
                        delay={0}
                      />
                      <KPICard
                        title="Total Profit"
                        value={salesSummary?.total_profit || 0}
                        prefix="$"
                        change={salesSummary?.profit_growth}
                        icon="trending"
                        delay={1}
                      />
                      <KPICard
                        title="Total Orders"
                        value={salesSummary?.total_orders || 0}
                        icon="cart"
                        delay={2}
                      />
                      <KPICard
                        title="Avg Order Value"
                        value={salesSummary?.avg_order_value || 0}
                        prefix="$"
                        icon="chart"
                        delay={3}
                        decimals={2}
                      />
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Sales Trend Chart */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            {monthlySales?.highest_month && (
                              <span className="flex items-center gap-1 text-emerald-600">
                                <ArrowUpRight className="w-4 h-4" />
                                Peak: {monthlySales.highest_month.month}
                              </span>
                            )}
                          </div>
                        </div>
                        <SalesTrendChart data={monthlySales?.data || []} />
                      </motion.div>

                      {/* Regional Sales Chart */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Regional Performance</h3>
                          {regionalSales?.best_region && (
                            <span className="text-sm text-gray-500">
                              Top: <span className="font-medium text-gray-900">{regionalSales.best_region.region}</span>
                            </span>
                          )}
                        </div>
                        <RegionalSalesChart data={regionalSales?.data || []} />
                      </motion.div>
                    </div>

                    {/* Quick Insights */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-amber-500" />
                        <h3 className="text-lg font-semibold text-gray-900">Quick Insights</h3>
                      </div>
                      <InsightsGrid insights={insights.slice(0, 4)} />
                    </motion.div>
                  </div>
                )}

                {/* Sales Trends Section */}
                {activeSection === 'trends' && (
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Sales Performance</h3>
                      <SalesTrendChart data={monthlySales?.data || []} />
                    </motion.div>

                    {/* Trend insights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                          <span className="font-medium text-emerald-800">Peak Month</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-900">
                          {monthlySales?.highest_month?.month || 'N/A'}
                        </p>
                        <p className="text-sm text-emerald-600 mt-1">
                          ${monthlySales?.highest_month?.sales?.toLocaleString() || 0} in sales
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <ArrowDownRight className="w-5 h-5 text-red-600" />
                          <span className="font-medium text-red-800">Lowest Month</span>
                        </div>
                        <p className="text-2xl font-bold text-red-900">
                          {monthlySales?.lowest_month?.month || 'N/A'}
                        </p>
                        <p className="text-sm text-red-600 mt-1">
                          ${monthlySales?.lowest_month?.sales?.toLocaleString() || 0} in sales
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-blue-800">Growth Rate</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">
                          {salesSummary?.revenue_growth !== undefined && salesSummary.revenue_growth >= 0 ? '+' : ''}{salesSummary?.revenue_growth?.toFixed(1) || 0}%
                        </p>
                        <p className="text-sm text-blue-600 mt-1">
                          vs previous period
                        </p>
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* Products Section */}
                {activeSection === 'products' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Top Products Bar Chart */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Products by Revenue</h3>
                        <TopProductsChart data={topProducts?.top_products || []} />
                      </motion.div>

                      {/* Category Distribution Pie Chart */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
                        <CategoryPieChart data={topProducts?.category_distribution || []} />
                      </motion.div>
                    </div>

                    {/* Profit vs Revenue Analysis */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Profit vs Revenue Analysis</h3>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            Best Performer
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                            High Revenue, Low Margin
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            Low Revenue, High Margin
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            Needs Improvement
                          </span>
                        </div>
                      </div>
                      <ProfitRevenueChart data={profitRevenueData} />
                    </motion.div>
                  </div>
                )}

                {/* Regions Section */}
                {activeSection === 'regions' && (
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Sales Comparison</h3>
                      <RegionalSalesChart data={regionalSales?.data || []} />
                    </motion.div>

                    {/* Regional Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {regionalSales?.data?.map((region, index) => (
                        <motion.div
                          key={region.region}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">{region.region}</h4>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">
                              {region.percentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Revenue</span>
                              <span className="font-medium">${region.revenue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Profit</span>
                              <span className="font-medium text-emerald-600">${region.profit.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Margin</span>
                              <span className="font-medium">{region.profit_margin.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Orders</span>
                              <span className="font-medium">{region.orders}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Insights Section */}
                {activeSection === 'insights' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <Lightbulb className="w-5 h-5 text-amber-500" />
                        <h3 className="text-lg font-semibold text-gray-900">Business Insights & Recommendations</h3>
                      </div>
                      <InsightsGrid insights={insights} />
                    </div>

                    {/* Profit Margin Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                      >
                        <h4 className="font-semibold text-gray-900 mb-4">Performance Summary</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Overall Profit Margin</span>
                            <span className="font-bold text-lg text-emerald-600">{salesSummary?.profit_margin?.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Total Revenue</span>
                            <span className="font-bold text-lg">${salesSummary?.total_revenue?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Total Profit</span>
                            <span className="font-bold text-lg text-blue-600">${salesSummary?.total_profit?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600">Revenue Growth</span>
                            <span className={`font-bold text-lg ${(salesSummary?.revenue_growth ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {(salesSummary?.revenue_growth ?? 0) >= 0 ? '+' : ''}{salesSummary?.revenue_growth?.toFixed(1) ?? '0.0'}%
                            </span>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                      >
                        <h4 className="font-semibold text-gray-900 mb-4">Key Recommendations</h4>
                        <ul className="space-y-3">
                          {insights.slice(0, 3).map((insight, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                              </div>
                              <span className="text-gray-600">{insight.recommendation}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </motion.div>
    </div>
  );
}

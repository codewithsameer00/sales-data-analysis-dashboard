/**
 * Next.js API Route for Sales Dashboard
 * Provides sales data when Python backend is not available
 */

import { NextResponse } from 'next/server';

// Sample sales data for fallback
const salesData = [
  { Order_ID: 'ORD-001', Order_Date: '2023-01-05', Product: 'iPhone 14 Pro', Category: 'Electronics', Region: 'North', Quantity: 2, Sales: 1998, Profit: 399.60 },
  { Order_ID: 'ORD-002', Order_Date: '2023-01-07', Product: 'Samsung Galaxy S23', Category: 'Electronics', Region: 'West', Quantity: 1, Sales: 899, Profit: 179.80 },
  { Order_ID: 'ORD-003', Order_Date: '2023-01-10', Product: 'MacBook Pro 14', Category: 'Electronics', Region: 'South', Quantity: 1, Sales: 1999, Profit: 499.75 },
  { Order_ID: 'ORD-004', Order_Date: '2023-01-12', Product: 'Office Chair Pro', Category: 'Furniture', Region: 'East', Quantity: 3, Sales: 897, Profit: 269.10 },
  { Order_ID: 'ORD-005', Order_Date: '2023-01-15', Product: 'Standing Desk Elite', Category: 'Furniture', Region: 'North', Quantity: 1, Sales: 649, Profit: 194.70 },
  { Order_ID: 'ORD-006', Order_Date: '2023-01-18', Product: 'Sony WH-1000XM5', Category: 'Electronics', Region: 'West', Quantity: 2, Sales: 598, Profit: 179.40 },
  { Order_ID: 'ORD-007', Order_Date: '2023-01-20', Product: 'HP LaserJet Pro', Category: 'Office Supplies', Region: 'South', Quantity: 1, Sales: 449, Profit: 134.70 },
  { Order_ID: 'ORD-008', Order_Date: '2023-01-22', Product: 'Conference Table', Category: 'Furniture', Region: 'East', Quantity: 1, Sales: 1299, Profit: 389.70 },
  { Order_ID: 'ORD-009', Order_Date: '2023-01-25', Product: 'Dell Monitor 27', Category: 'Electronics', Region: 'North', Quantity: 4, Sales: 1596, Profit: 478.80 },
  { Order_ID: 'ORD-010', Order_Date: '2023-01-28', Product: 'Paper Box A4', Category: 'Office Supplies', Region: 'West', Quantity: 50, Sales: 249, Profit: 99.60 },
  { Order_ID: 'ORD-011', Order_Date: '2023-02-05', Product: 'iPad Air', Category: 'Electronics', Region: 'South', Quantity: 3, Sales: 1797, Profit: 449.25 },
  { Order_ID: 'ORD-012', Order_Date: '2023-02-08', Product: 'Ergonomic Keyboard', Category: 'Office Supplies', Region: 'East', Quantity: 5, Sales: 449, Profit: 179.60 },
  { Order_ID: 'ORD-013', Order_Date: '2023-02-11', Product: 'Apple Watch Ultra', Category: 'Electronics', Region: 'North', Quantity: 2, Sales: 1598, Profit: 479.40 },
  { Order_ID: 'ORD-014', Order_Date: '2023-02-14', Product: 'Desk Lamp LED', Category: 'Office Supplies', Region: 'West', Quantity: 8, Sales: 319, Profit: 127.60 },
  { Order_ID: 'ORD-015', Order_Date: '2023-02-17', Product: 'Filing Cabinet', Category: 'Furniture', Region: 'South', Quantity: 2, Sales: 458, Profit: 137.40 },
  { Order_ID: 'ORD-016', Order_Date: '2023-02-20', Product: 'Surface Pro 9', Category: 'Electronics', Region: 'East', Quantity: 1, Sales: 1299, Profit: 389.70 },
  { Order_ID: 'ORD-017', Order_Date: '2023-02-23', Product: 'Wireless Mouse', Category: 'Office Supplies', Region: 'North', Quantity: 10, Sales: 299, Profit: 149.50 },
  { Order_ID: 'ORD-018', Order_Date: '2023-02-26', Product: 'Bookshelf Oak', Category: 'Furniture', Region: 'West', Quantity: 2, Sales: 698, Profit: 209.40 },
  { Order_ID: 'ORD-019', Order_Date: '2023-03-01', Product: 'Canon EOS R6', Category: 'Electronics', Region: 'South', Quantity: 1, Sales: 2499, Profit: 624.75 },
  { Order_ID: 'ORD-020', Order_Date: '2023-03-04', Product: 'Printer Paper', Category: 'Office Supplies', Region: 'East', Quantity: 100, Sales: 399, Profit: 199.50 },
];

function calculateSummary(data: typeof salesData) {
  const totalRevenue = data.reduce((sum, item) => sum + item.Sales, 0);
  const totalProfit = data.reduce((sum, item) => sum + item.Profit, 0);
  const totalOrders = data.length;
  const avgOrderValue = totalRevenue / totalOrders;

  return {
    total_revenue: Math.round(totalRevenue * 100) / 100,
    total_profit: Math.round(totalProfit * 100) / 100,
    total_orders: totalOrders,
    avg_order_value: Math.round(avgOrderValue * 100) / 100,
    revenue_growth: 15.2,
    profit_growth: 12.8,
    profit_margin: Math.round((totalProfit / totalRevenue) * 100 * 100) / 100
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');

  try {
    // Try to fetch from Python backend first
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    try {
      const response = await fetch(`${backendUrl}${endpoint}`, {
        signal: AbortSignal.timeout(2000)
      });
      
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch {
      console.log('Backend not available, using local data');
    }

    // Fallback calculations
    switch (endpoint) {
      case '/api/sales-summary':
        return NextResponse.json(calculateSummary(salesData));
      
      case '/api/monthly-sales': {
        const monthlyData: Record<string, { month: string; sales: number; profit: number; quantity: number; orders: number }> = {};
        salesData.forEach(item => {
          const date = new Date(item.Order_Date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const monthName = date.toLocaleString('default', { month: 'long' });
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { month: monthName, sales: 0, profit: 0, quantity: 0, orders: 0 };
          }
          monthlyData[monthKey].sales += item.Sales;
          monthlyData[monthKey].profit += item.Profit;
          monthlyData[monthKey].quantity += item.Quantity;
          monthlyData[monthKey].orders += 1;
        });
        const result = Object.entries(monthlyData).map(([year_month, data]) => ({ year_month, ...data }));
        return NextResponse.json({ data: result, highest_month: { month: 'March', sales: 2898 }, lowest_month: { month: 'January', sales: 10187 } });
      }
      
      case '/api/top-products': {
        const productData: Record<string, { revenue: number; profit: number; quantity: number; orders: number }> = {};
        salesData.forEach(item => {
          if (!productData[item.Product]) productData[item.Product] = { revenue: 0, profit: 0, quantity: 0, orders: 0 };
          productData[item.Product].revenue += item.Sales;
          productData[item.Product].profit += item.Profit;
          productData[item.Product].quantity += item.Quantity;
          productData[item.Product].orders += 1;
        });
        const topProducts = Object.entries(productData).map(([product, data]) => ({
          product, ...data, profit_margin: Math.round((data.profit / data.revenue) * 100 * 100) / 100
        })).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
        return NextResponse.json({ top_products: topProducts, category_distribution: [
          { category: 'Electronics', sales: 12787, profit: 3214.15, quantity: 17, percentage: 56.5 },
          { category: 'Furniture', sales: 3101, profit: 915.60, quantity: 9, percentage: 13.7 },
          { category: 'Office Supplies', sales: 6709, profit: 879.30, quantity: 178, percentage: 29.7 }
        ]});
      }
      
      case '/api/regional-sales':
        return NextResponse.json({
          data: [
            { region: 'North', revenue: 4541, profit: 1222.90, quantity: 18, orders: 4, profit_margin: 26.9, percentage: 20.1 },
            { region: 'South', revenue: 6653, profit: 1707.45, quantity: 8, orders: 5, profit_margin: 25.7, percentage: 29.4 },
            { region: 'East', revenue: 4093, profit: 1159.10, quantity: 110, orders: 5, profit_margin: 28.3, percentage: 18.1 },
            { region: 'West', revenue: 2763, profit: 766.60, quantity: 63, orders: 6, profit_margin: 27.7, percentage: 12.2 }
          ],
          best_region: { region: 'South', revenue: 6653, profit: 1707.45 },
          worst_region: { region: 'West', revenue: 2763, profit: 766.60 }
        });

      case '/api/profit-revenue': {
        const productData: Record<string, { revenue: number; profit: number; quantity: number; category: string }> = {};
        salesData.forEach(item => {
          if (!productData[item.Product]) productData[item.Product] = { revenue: 0, profit: 0, quantity: 0, category: item.Category };
          productData[item.Product].revenue += item.Sales;
          productData[item.Product].profit += item.Profit;
          productData[item.Product].quantity += item.Quantity;
        });
        const profitRevenueData = Object.entries(productData).map(([product, data]) => ({
          product,
          ...data,
          profit_margin: Math.round((data.profit / data.revenue) * 100 * 100) / 100,
          classification: data.profit_margin > 25 ? 'Best Performer' : 'Needs Improvement'
        }));
        return NextResponse.json(profitRevenueData);
      }
      
      case '/api/insights':
        return NextResponse.json([
          { type: 'trend', icon: 'trending-up', title: 'Peak Sales Period', description: 'March shows strong sales performance with electronics leading the way.', metric: '$2,898', recommendation: 'Consider increasing inventory for Q1 electronics.' },
          { type: 'category', icon: 'package', title: 'Top Category', description: 'Electronics category generates the most revenue at 56.5% of total sales.', metric: '56.5%', recommendation: 'Focus marketing efforts on electronics products for maximum ROI.' },
          { type: 'region', icon: 'map', title: 'Leading Region', description: 'South region contributes the highest revenue share.', metric: '29.4%', recommendation: 'Explore expansion opportunities in other regions.' },
          { type: 'product', icon: 'star', title: 'Best Performer', description: 'MacBook Pro 14 generates the highest profit margin among all products.', metric: '25%', recommendation: 'Consider creating bundle deals with this product.' }
        ]);

      case '/api/filter-options':
        return NextResponse.json({
          years: [2023, 2024],
          regions: ['all', 'North', 'South', 'East', 'West'],
          categories: ['all', 'Electronics', 'Furniture', 'Office Supplies', 'Sports', 'Jewelry', 'Gifts']
        });

      default:
        return NextResponse.json({ error: 'Unknown endpoint' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

"""
Data Processing Module for Sales Analytics Dashboard
Handles all data loading, cleaning, and analysis operations using Pandas
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional
from pathlib import Path


class SalesDataProcessor:
    """Main class for processing sales data"""
    
    def __init__(self, data_path: str = None):
        """Initialize the data processor with the dataset path"""
        if data_path is None:
            data_path = Path(__file__).parent / "dataset.csv"
        self.data_path = data_path
        self.df = None
        self._load_data()
    
    def _load_data(self) -> None:
        """Load and preprocess the sales dataset"""
        self.df = pd.read_csv(self.data_path)
        self.df['Order_Date'] = pd.to_datetime(self.df['Order_Date'])
        self.df['Year'] = self.df['Order_Date'].dt.year
        self.df['Month'] = self.df['Order_Date'].dt.month
        self.df['Month_Name'] = self.df['Order_Date'].dt.strftime('%B')
        self.df['Year_Month'] = self.df['Order_Date'].dt.to_period('M').astype(str)
        self.df['Profit_Margin'] = (self.df['Profit'] / self.df['Sales']) * 100
    
    def get_sales_summary(self) -> Dict[str, Any]:
        """
        Calculate key performance indicators (KPIs) for the dashboard
        Returns total revenue, profit, orders, and average order value
        """
        total_revenue = float(self.df['Sales'].sum())
        total_profit = float(self.df['Profit'].sum())
        total_orders = int(self.df['Order_ID'].nunique())
        avg_order_value = total_revenue / total_orders if total_orders > 0 else 0
        
        # Calculate growth metrics (comparing last 6 months to previous 6 months)
        recent_data = self.df.tail(len(self.df) // 2)
        previous_data = self.df.head(len(self.df) // 2)
        
        recent_revenue = recent_data['Sales'].sum()
        previous_revenue = previous_data['Sales'].sum()
        revenue_growth = ((recent_revenue - previous_revenue) / previous_revenue * 100) if previous_revenue > 0 else 0
        
        recent_profit = recent_data['Profit'].sum()
        previous_profit = previous_data['Profit'].sum()
        profit_growth = ((recent_profit - previous_profit) / previous_profit * 100) if previous_profit > 0 else 0
        
        return {
            "total_revenue": round(total_revenue, 2),
            "total_profit": round(total_profit, 2),
            "total_orders": total_orders,
            "avg_order_value": round(avg_order_value, 2),
            "revenue_growth": round(revenue_growth, 2),
            "profit_growth": round(profit_growth, 2),
            "profit_margin": round((total_profit / total_revenue) * 100, 2) if total_revenue > 0 else 0
        }
    
    def get_monthly_sales(self, year: Optional[int] = None, region: Optional[str] = None, 
                          category: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Get monthly sales trends with optional filtering
        Returns aggregated sales data by month
        """
        filtered_df = self.df.copy()
        
        if year:
            filtered_df = filtered_df[filtered_df['Year'] == year]
        if region and region != 'all':
            filtered_df = filtered_df[filtered_df['Region'] == region]
        if category and category != 'all':
            filtered_df = filtered_df[filtered_df['Category'] == category]
        
        monthly_data = filtered_df.groupby(['Year_Month', 'Month_Name']).agg({
            'Sales': 'sum',
            'Profit': 'sum',
            'Quantity': 'sum',
            'Order_ID': 'nunique'
        }).reset_index()
        
        monthly_data.columns = ['year_month', 'month', 'sales', 'profit', 'quantity', 'orders']
        
        # Sort by year_month
        monthly_data = monthly_data.sort_values('year_month')
        
        # Find highest and lowest months
        if len(monthly_data) > 0:
            highest_month = monthly_data.loc[monthly_data['sales'].idxmax()]
            lowest_month = monthly_data.loc[monthly_data['sales'].idxmin()]
        else:
            highest_month = None
            lowest_month = None
        
        return {
            "data": monthly_data.to_dict('records'),
            "highest_month": {
                "month": highest_month['month'] if highest_month is not None else None,
                "sales": float(highest_month['sales']) if highest_month is not None else None
            } if highest_month is not None else None,
            "lowest_month": {
                "month": lowest_month['month'] if lowest_month is not None else None,
                "sales": float(lowest_month['sales']) if lowest_month is not None else None
            } if lowest_month is not None else None
        }
    
    def get_top_products(self, limit: int = 10) -> Dict[str, Any]:
        """
        Get top products by revenue and category distribution
        Returns bar chart data and pie chart data
        """
        # Top products by revenue
        product_sales = self.df.groupby('Product').agg({
            'Sales': 'sum',
            'Profit': 'sum',
            'Quantity': 'sum',
            'Order_ID': 'nunique'
        }).reset_index()
        
        product_sales.columns = ['product', 'revenue', 'profit', 'quantity', 'orders']
        product_sales['profit_margin'] = (product_sales['profit'] / product_sales['revenue'] * 100).round(2)
        
        top_products = product_sales.nlargest(limit, 'revenue')
        
        # Category distribution
        category_sales = self.df.groupby('Category').agg({
            'Sales': 'sum',
            'Profit': 'sum',
            'Quantity': 'sum'
        }).reset_index()
        
        category_sales.columns = ['category', 'sales', 'profit', 'quantity']
        category_sales['percentage'] = (category_sales['sales'] / category_sales['sales'].sum() * 100).round(2)
        
        return {
            "top_products": top_products.to_dict('records'),
            "category_distribution": category_sales.to_dict('records')
        }
    
    def get_regional_sales(self) -> Dict[str, Any]:
        """
        Get sales performance by region
        Returns revenue and profit data per region for comparison charts
        """
        regional_data = self.df.groupby('Region').agg({
            'Sales': 'sum',
            'Profit': 'sum',
            'Quantity': 'sum',
            'Order_ID': 'nunique'
        }).reset_index()
        
        regional_data.columns = ['region', 'revenue', 'profit', 'quantity', 'orders']
        regional_data['profit_margin'] = (regional_data['profit'] / regional_data['revenue'] * 100).round(2)
        regional_data['percentage'] = (regional_data['revenue'] / regional_data['revenue'].sum() * 100).round(2)
        
        # Sort by revenue
        regional_data = regional_data.sort_values('revenue', ascending=False)
        
        # Best and worst performing regions
        best_region = regional_data.iloc[0].to_dict() if len(regional_data) > 0 else None
        worst_region = regional_data.iloc[-1].to_dict() if len(regional_data) > 0 else None
        
        return {
            "data": regional_data.to_dict('records'),
            "best_region": best_region,
            "worst_region": worst_region
        }
    
    def get_profit_revenue_analysis(self) -> List[Dict[str, Any]]:
        """
        Get profit vs revenue scatter plot data for each product
        Helps identify high revenue/low profit products vs best performers
        """
        product_analysis = self.df.groupby('Product').agg({
            'Sales': 'sum',
            'Profit': 'sum',
            'Quantity': 'sum',
            'Category': 'first'
        }).reset_index()
        
        product_analysis.columns = ['product', 'revenue', 'profit', 'quantity', 'category']
        product_analysis['profit_margin'] = (product_analysis['profit'] / product_analysis['revenue'] * 100).round(2)
        
        # Classify products
        median_revenue = product_analysis['revenue'].median()
        median_profit_margin = product_analysis['profit_margin'].median()
        
        def classify_product(row):
            if row['revenue'] >= median_revenue and row['profit_margin'] >= median_profit_margin:
                return 'Best Performer'
            elif row['revenue'] >= median_revenue and row['profit_margin'] < median_profit_margin:
                return 'High Revenue, Low Margin'
            elif row['revenue'] < median_revenue and row['profit_margin'] >= median_profit_margin:
                return 'Low Revenue, High Margin'
            else:
                return 'Needs Improvement'
        
        product_analysis['classification'] = product_analysis.apply(classify_product, axis=1)
        
        return product_analysis.to_dict('records')
    
    def get_insights(self) -> List[Dict[str, Any]]:
        """
        Automatically generate business insights from the data analysis
        Returns actionable insights as structured data
        """
        insights = []
        
        # Monthly sales insights
        monthly_sales = self.df.groupby('Month_Name')['Sales'].sum()
        best_month = monthly_sales.idxmax()
        best_month_sales = monthly_sales.max()
        insights.append({
            "type": "trend",
            "icon": "trending-up",
            "title": "Peak Sales Period",
            "description": f"The highest revenue month is {best_month} with ${best_month_sales:,.2f} in sales.",
            "metric": f"${best_month_sales:,.2f}",
            "recommendation": f"Consider increasing inventory and marketing budget for {best_month}."
        })
        
        # Category insights
        category_sales = self.df.groupby('Category')['Sales'].sum()
        top_category = category_sales.idxmax()
        top_category_sales = category_sales.max()
        top_category_pct = (top_category_sales / category_sales.sum() * 100)
        insights.append({
            "type": "category",
            "icon": "package",
            "title": "Top Category",
            "description": f"{top_category} category generates the most revenue at ${top_category_sales:,.2f}.",
            "metric": f"{top_category_pct:.1f}%",
            "recommendation": f"Focus marketing efforts on {top_category} products for maximum ROI."
        })
        
        # Regional insights
        regional_sales = self.df.groupby('Region')['Sales'].sum()
        top_region = regional_sales.idxmax()
        top_region_sales = regional_sales.max()
        top_region_pct = (top_region_sales / regional_sales.sum() * 100)
        insights.append({
            "type": "region",
            "icon": "map",
            "title": "Leading Region",
            "description": f"The {top_region} region contributes {top_region_pct:.1f}% of total sales.",
            "metric": f"{top_region_pct:.1f}%",
            "recommendation": f"Explore expansion opportunities in underperforming regions."
        })
        
        # Product insights
        product_profit = self.df.groupby('Product')['Profit'].sum()
        top_product = product_profit.idxmax()
        top_product_profit = product_profit.max()
        insights.append({
            "type": "product",
            "icon": "star",
            "title": "Most Profitable Product",
            "description": f"{top_product} generates the highest profit at ${top_product_profit:,.2f}.",
            "metric": f"${top_product_profit:,.2f}",
            "recommendation": "Consider creating bundle deals with this product."
        })
        
        # Profit margin insight
        avg_margin = (self.df['Profit'].sum() / self.df['Sales'].sum() * 100)
        category_margins = self.df.groupby('Category').apply(lambda x: (x['Profit'].sum() / x['Sales'].sum() * 100))
        best_margin_cat = category_margins.idxmax()
        best_margin = category_margins.max()
        insights.append({
            "type": "margin",
            "icon": "percent",
            "title": "Profit Margin Analysis",
            "description": f"Average profit margin is {avg_margin:.1f}%. {best_margin_cat} has the best margin at {best_margin:.1f}%.",
            "metric": f"{avg_margin:.1f}%",
            "recommendation": "Review pricing strategy for low-margin categories."
        })
        
        # Order value insight
        order_values = self.df.groupby('Order_ID')['Sales'].sum()
        avg_order = order_values.mean()
        insights.append({
            "type": "order",
            "icon": "shopping-cart",
            "title": "Order Performance",
            "description": f"Average order value is ${avg_order:,.2f}. Consider upselling strategies.",
            "metric": f"${avg_order:,.2f}",
            "recommendation": "Implement cross-selling recommendations at checkout."
        })
        
        # Year-over-year growth
        yearly_sales = self.df.groupby('Year')['Sales'].sum()
        if len(yearly_sales) >= 2:
            years = sorted(yearly_sales.index)
            growth = ((yearly_sales[years[-1]] - yearly_sales[years[-2]]) / yearly_sales[years[-2]] * 100)
            insights.append({
                "type": "growth",
                "icon": "chart",
                "title": "Year-over-Year Growth",
                "description": f"Revenue {'grew' if growth > 0 else 'declined'} by {abs(growth):.1f}% compared to previous year.",
                "metric": f"{growth:+.1f}%",
                "recommendation": "Continue strategies that drove growth" if growth > 0 else "Review and adjust sales strategies."
            })
        
        return insights
    
    def get_filter_options(self) -> Dict[str, Any]:
        """Get available filter options for the dashboard"""
        return {
            "years": sorted(self.df['Year'].unique().tolist()),
            "regions": ['all'] + self.df['Region'].unique().tolist(),
            "categories": ['all'] + self.df['Category'].unique().tolist()
        }
    
    def get_category_breakdown(self) -> Dict[str, Any]:
        """Get detailed breakdown by category"""
        category_data = self.df.groupby('Category').agg({
            'Sales': ['sum', 'mean', 'count'],
            'Profit': ['sum', 'mean'],
            'Quantity': 'sum'
        }).reset_index()
        
        category_data.columns = ['category', 'total_sales', 'avg_sales', 'order_count', 
                                  'total_profit', 'avg_profit', 'total_quantity']
        
        return category_data.to_dict('records')


# Create a global instance for the API
processor = None

def get_processor() -> SalesDataProcessor:
    """Get or create the data processor instance"""
    global processor
    if processor is None:
        processor = SalesDataProcessor()
    return processor

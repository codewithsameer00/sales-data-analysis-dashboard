"""
Sales Analytics Dashboard - FastAPI Backend
Provides REST API endpoints for sales data analysis
"""

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uvicorn

from data_processing import get_processor

# Create FastAPI app
app = FastAPI(
    title="Sales Analytics Dashboard API",
    description="Backend API for the Sales Data Analysis & Business Insights Dashboard",
    version="1.0.0"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint - API health check"""
    return {
        "message": "Sales Analytics Dashboard API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/api/sales-summary")
async def get_sales_summary():
    """
    Get KPI summary for the dashboard
    Returns total revenue, profit, orders, and average order value
    """
    try:
        processor = get_processor()
        return processor.get_sales_summary()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/monthly-sales")
async def get_monthly_sales(
    year: Optional[int] = Query(None, description="Filter by year"),
    region: Optional[str] = Query(None, description="Filter by region"),
    category: Optional[str] = Query(None, description="Filter by category")
):
    """
    Get monthly sales trends with optional filtering
    Supports filtering by year, region, and category
    """
    try:
        processor = get_processor()
        return processor.get_monthly_sales(year=year, region=region, category=category)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/top-products")
async def get_top_products(
    limit: int = Query(10, ge=1, le=50, description="Number of top products to return")
):
    """
    Get top products by revenue and category distribution
    Returns data for bar chart and pie chart visualizations
    """
    try:
        processor = get_processor()
        return processor.get_top_products(limit=limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/regional-sales")
async def get_regional_sales():
    """
    Get sales performance by region
    Returns revenue and profit data per region
    """
    try:
        processor = get_processor()
        return processor.get_regional_sales()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/profit-revenue")
async def get_profit_revenue():
    """
    Get profit vs revenue analysis for scatter plot
    Helps identify product performance patterns
    """
    try:
        processor = get_processor()
        return processor.get_profit_revenue_analysis()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/insights")
async def get_insights():
    """
    Get auto-generated business insights
    Returns actionable recommendations based on data analysis
    """
    try:
        processor = get_processor()
        return processor.get_insights()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/filter-options")
async def get_filter_options():
    """
    Get available filter options for the dashboard
    Returns list of years, regions, and categories
    """
    try:
        processor = get_processor()
        return processor.get_filter_options()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/category-breakdown")
async def get_category_breakdown():
    """
    Get detailed breakdown by category
    Returns sales and profit metrics per category
    """
    try:
        processor = get_processor()
        return processor.get_category_breakdown()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

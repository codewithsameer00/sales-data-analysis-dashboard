# Sales Data Analysis & Business Insights Dashboard

A modern, professional sales analytics dashboard built with Next.js 15, React, and Python FastAPI. This project analyzes sales data and presents clear business insights through interactive charts and smooth animations.

![Sales Dashboard](https://via.placeholder.com/800x400?text=Sales+Analytics+Dashboard)

## 🚀 Features

### 1. Animated Dashboard Interface
- Modern SaaS-style design with smooth UI animations
- Responsive sidebar navigation with open/close animation
- Animated page transitions using Framer Motion
- Professional light mode color theme with subtle gradients

### 2. KPI Summary Cards
- **Total Revenue** - with growth indicator
- **Total Profit** - with growth indicator  
- **Total Orders** - order count metric
- **Average Order Value** - per-order metrics
- Animated number counters on load
- Hover effects on all cards

### 3. Sales Trend Analysis
- Interactive line/area chart showing monthly sales performance
- Year, Region, and Category filters
- Peak and lowest sales month indicators
- Smooth chart animations on filter change

### 4. Top Products Analysis
- **Bar Chart**: Top 10 products by revenue
- **Pie/Donut Chart**: Sales distribution by category
- Hover tooltips showing sales, profit, quantity, and margin

### 5. Regional Sales Performance
- Revenue and profit comparison by region (North, South, East, West)
- Regional breakdown cards with detailed metrics
- Best/worst performing region indicators

### 6. Profit vs Revenue Analysis
- Scatter plot showing revenue vs profit for each product
- Product classification (Best Performer, High Revenue/Low Margin, etc.)
- Visual identification of optimization opportunities

### 7. Auto-Generated Insights
- AI-powered business insights from data analysis
- Actionable recommendations
- Performance summaries

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **Recharts** - Chart library
- **shadcn/ui** - UI component library
- **Lucide React** - Icon library

### Backend
- **Python 3.11+**
- **FastAPI** - Modern web framework
- **Pandas** - Data manipulation
- **NumPy** - Numerical computing

### Data
- **CSV Dataset** - 1000+ rows of realistic sales data

## 📁 Project Structure

```
├── backend/
│   ├── main.py              # FastAPI application
│   ├── data_processing.py   # Pandas data analysis
│   ├── dataset.csv          # Sales dataset
│   └── requirements.txt     # Python dependencies
│
├── src/
│   ├── app/
│   │   ├── page.tsx         # Main dashboard page
│   │   ├── layout.tsx       # Root layout
│   │   ├── globals.css      # Global styles
│   │   └── api/
│   │       └── sales/
│   │           └── route.ts # API proxy route
│   │
│   ├── components/
│   │   ├── dashboard/       # Dashboard components
│   │   │   ├── KPICard.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── InsightsCard.tsx
│   │   │
│   │   └── charts/          # Chart components
│   │       ├── SalesTrendChart.tsx
│   │       ├── TopProductsChart.tsx
│   │       ├── CategoryPieChart.tsx
│   │       ├── RegionalSalesChart.tsx
│   │       └── ProfitRevenueChart.tsx
│   │
│   ├── hooks/
│   │   └── useAnimatedCounter.ts
│   │
│   └── lib/
│       ├── api.ts           # API service
│       └── utils.ts         # Utility functions
│
└── package.json
```

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- Python 3.11+
- bun (recommended) or npm

### Frontend Setup

```bash
# Install dependencies
bun install

# Run development server
bun run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup (Optional - for full functionality)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sales-summary` | GET | KPI metrics summary |
| `/api/monthly-sales` | GET | Monthly sales trends |
| `/api/top-products` | GET | Top products by revenue |
| `/api/regional-sales` | GET | Regional performance data |
| `/api/profit-revenue` | GET | Profit vs revenue analysis |
| `/api/insights` | GET | Auto-generated insights |
| `/api/filter-options` | GET | Available filter options |

### Query Parameters

**Monthly Sales:**
- `year` - Filter by year (e.g., 2023)
- `region` - Filter by region (North, South, East, West)
- `category` - Filter by category

**Top Products:**
- `limit` - Number of products to return (default: 10)

## 📊 Dataset Structure

The sample dataset contains 1000+ rows with the following columns:

| Column | Type | Description |
|--------|------|-------------|
| Order_ID | String | Unique order identifier |
| Order_Date | Date | Date of order |
| Product | String | Product name |
| Category | String | Product category |
| Region | String | Sales region |
| Quantity | Integer | Units sold |
| Sales | Float | Total sales amount |
| Profit | Float | Profit amount |

### Categories
- Electronics
- Furniture
- Office Supplies
- Sports
- Jewelry
- Gifts

### Regions
- North
- South
- East
- West

## 🎨 Customization

### Changing Theme Colors
Edit `tailwind.config.ts` to customize the color scheme.

### Adding New Charts
1. Create a new chart component in `src/components/charts/`
2. Import and use Recharts components
3. Add data fetching in `src/lib/api.ts`
4. Integrate into the dashboard in `src/app/page.tsx`

### Modifying Insights
The insights are generated in the backend `data_processing.py`. Customize the `get_insights()` method to add new business rules.

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Build the project
bun run build

# Deploy to Vercel
vercel
```

### Backend (Render, Railway, etc.)
1. Create a `Dockerfile` for the Python backend
2. Deploy to your preferred platform
3. Update `NEXT_PUBLIC_API_URL` environment variable

## 🔮 Future Improvements

- [ ] Dark mode support
- [ ] Export reports to PDF/Excel
- [ ] Real-time data updates with WebSocket
- [ ] User authentication and role-based access
- [ ] Custom date range picker
- [ ] More advanced filtering options
- [ ] Dashboard customization and drag-and-drop
- [ ] Mobile app version
- [ ] Machine learning predictions
- [ ] Multi-language support

## 📄 License

MIT License - feel free to use this project for your portfolio or learning purposes.

## 🙏 Credits

Built with love using modern web technologies. Perfect for freelance portfolio projects demonstrating full-stack development skills.

---

**Note:** This dashboard works with fallback data even without the Python backend running. For full functionality with the complete 1000+ row dataset, run both the frontend and backend servers.

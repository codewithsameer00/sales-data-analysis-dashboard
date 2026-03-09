/**
 * Top Products Bar Chart Component
 * Horizontal bar chart showing top products by revenue
 */

'use client';

import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TopProduct } from '@/lib/api';

interface TopProductsChartProps {
  data: TopProduct[];
  isLoading?: boolean;
}

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-100 min-w-48"
      >
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Revenue:</span>
            <span className="font-medium">${data.revenue?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Profit:</span>
            <span className="font-medium text-emerald-600">${data.profit?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Quantity:</span>
            <span className="font-medium">{data.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Margin:</span>
            <span className="font-medium text-blue-600">{data.profit_margin?.toFixed(1)}%</span>
          </div>
        </div>
      </motion.div>
    );
  }
  return null;
};

export function TopProductsChart({ data, isLoading = false }: TopProductsChartProps) {
  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-pulse w-full h-64 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  const formatXAxis = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  // Truncate long product names
  const formatLabel = (name: string) => {
    return name.length > 20 ? `${name.substring(0, 20)}...` : name;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-80"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
            tickFormatter={formatXAxis}
          />
          <YAxis
            type="category"
            dataKey="product"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            width={95}
            tickFormatter={formatLabel}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
          <Bar
            dataKey="revenue"
            name="Revenue"
            radius={[0, 4, 4, 0]}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

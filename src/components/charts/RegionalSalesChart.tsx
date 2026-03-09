/**
 * Regional Sales Chart Component
 * Bar chart comparing revenue and profit by region
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
  Legend,
} from 'recharts';
import { RegionalData } from '@/lib/api';

interface RegionalSalesChartProps {
  data: RegionalData[];
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-100"
      >
        <p className="font-semibold text-gray-900 mb-2">{label} Region</p>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Revenue:</span>
            <span className="font-medium">${data.revenue?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Profit:</span>
            <span className="font-medium text-emerald-600">${data.profit?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Orders:</span>
            <span className="font-medium">{data.orders}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Margin:</span>
            <span className="font-medium text-blue-600">{data.profit_margin?.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Share:</span>
            <span className="font-medium text-purple-600">{data.percentage?.toFixed(1)}%</span>
          </div>
        </div>
      </motion.div>
    );
  }
  return null;
};

export function RegionalSalesChart({ data, isLoading = false }: RegionalSalesChartProps) {
  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-pulse w-full h-64 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
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
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="region"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
            tickFormatter={formatYAxis}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <Bar
            dataKey="revenue"
            name="Revenue"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            animationEasing="ease-out"
          />
          <Bar
            dataKey="profit"
            name="Profit"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            animationEasing="ease-out"
            animationBegin={200}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

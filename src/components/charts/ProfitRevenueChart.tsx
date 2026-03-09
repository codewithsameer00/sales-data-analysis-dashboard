/**
 * Profit vs Revenue Scatter Chart Component
 * Scatter plot showing profit vs revenue for each product
 */

'use client';

import { motion } from 'framer-motion';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ZAxis,
} from 'recharts';
import { ProfitRevenueData } from '@/lib/api';

interface ProfitRevenueChartProps {
  data: ProfitRevenueData[];
  isLoading?: boolean;
}

const classificationColors = {
  'Best Performer': '#10b981',
  'High Revenue, Low Margin': '#f59e0b',
  'Low Revenue, High Margin': '#3b82f6',
  'Needs Improvement': '#ef4444',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-100 min-w-48"
      >
        <p className="font-semibold text-gray-900 mb-2">{data.product}</p>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Category:</span>
            <span className="font-medium">{data.category}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Revenue:</span>
            <span className="font-medium">${data.revenue?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Profit:</span>
            <span className="font-medium text-emerald-600">${data.profit?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Margin:</span>
            <span className="font-medium text-blue-600">{data.profit_margin?.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between gap-4 pt-1 border-t">
            <span className="text-gray-500">Status:</span>
            <span
              className="font-medium px-2 py-0.5 rounded text-xs"
              style={{
                backgroundColor: classificationColors[data.classification as keyof typeof classificationColors] + '20',
                color: classificationColors[data.classification as keyof typeof classificationColors]
              }}
            >
              {data.classification}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }
  return null;
};

export function ProfitRevenueChart({ data, isLoading = false }: ProfitRevenueChartProps) {
  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-pulse w-full h-64 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  const formatAxis = (value: number) => {
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
        <ScatterChart
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            type="number"
            dataKey="revenue"
            name="Revenue"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
            tickFormatter={formatAxis}
            label={{ value: 'Revenue', position: 'bottom', offset: 0, fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis
            type="number"
            dataKey="profit"
            name="Profit"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
            tickFormatter={formatAxis}
            label={{ value: 'Profit', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 12 }}
          />
          <ZAxis range={[60, 200]} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter
            name="Products"
            data={data}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={classificationColors[entry.classification as keyof typeof classificationColors] || '#6b7280'}
                fillOpacity={0.7}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

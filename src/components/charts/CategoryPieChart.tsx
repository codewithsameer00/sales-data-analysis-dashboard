/**
 * Category Distribution Pie Chart Component
 * Donut chart showing sales distribution by category
 */

'use client';

import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { CategoryDistribution } from '@/lib/api';

interface CategoryPieChartProps {
  data: CategoryDistribution[];
  isLoading?: boolean;
}

const COLORS = {
  'Electronics': '#3b82f6',
  'Furniture': '#10b981',
  'Office Supplies': '#f59e0b',
  'Sports': '#ef4444',
  'Jewelry': '#8b5cf6',
  'Gifts': '#ec4899',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-100"
      >
        <p className="font-semibold text-gray-900 mb-2">{data.category}</p>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Sales:</span>
            <span className="font-medium">${data.sales?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Profit:</span>
            <span className="font-medium text-emerald-600">${data.profit?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Share:</span>
            <span className="font-medium text-blue-600">{data.percentage?.toFixed(1)}%</span>
          </div>
        </div>
      </motion.div>
    );
  }
  return null;
};

interface LegendContentProps {
  payload: any[];
}

const CustomLegend = ({ payload }: LegendContentProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {payload.map((entry, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-2"
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600">{entry.value}</span>
        </motion.div>
      ))}
    </div>
  );
};

export function CategoryPieChart({ data, isLoading = false }: CategoryPieChartProps) {
  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-pulse w-48 h-48 bg-gray-200 rounded-full" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-80"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="sales"
            nameKey="category"
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.category as keyof typeof COLORS] || '#6b7280'}
                stroke="white"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend payload={[]} />} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

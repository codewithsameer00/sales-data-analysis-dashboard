/**
 * Insights Card Component
 * Displays auto-generated business insights with icons
 */

'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  Package,
  Map,
  Star,
  Percent,
  ShoppingCart,
  BarChart3,
  Lightbulb,
} from 'lucide-react';
import { Insight } from '@/lib/api';
import { cn } from '@/lib/utils';

interface InsightsCardProps {
  insight: Insight;
  index: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'trending-up': TrendingUp,
  'package': Package,
  'map': Map,
  'star': Star,
  'percent': Percent,
  'shopping-cart': ShoppingCart,
  'chart': BarChart3,
};

const colorMap: Record<string, { bg: string; icon: string; accent: string }> = {
  trend: { bg: 'bg-blue-50', icon: 'text-blue-500', accent: 'border-blue-200' },
  category: { bg: 'bg-purple-50', icon: 'text-purple-500', accent: 'border-purple-200' },
  region: { bg: 'bg-emerald-50', icon: 'text-emerald-500', accent: 'border-emerald-200' },
  product: { bg: 'bg-amber-50', icon: 'text-amber-500', accent: 'border-amber-200' },
  margin: { bg: 'bg-rose-50', icon: 'text-rose-500', accent: 'border-rose-200' },
  order: { bg: 'bg-cyan-50', icon: 'text-cyan-500', accent: 'border-cyan-200' },
  growth: { bg: 'bg-green-50', icon: 'text-green-500', accent: 'border-green-200' },
};

export function InsightsCard({ insight, index }: InsightsCardProps) {
  const Icon = iconMap[insight.icon] || Lightbulb;
  const colors = colorMap[insight.type] || { bg: 'bg-gray-50', icon: 'text-gray-500', accent: 'border-gray-200' };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={cn(
        'relative overflow-hidden rounded-xl p-4 border',
        colors.bg,
        colors.accent,
        'hover:shadow-md transition-shadow duration-300'
      )}
    >
      <div className="flex gap-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
          className={cn('flex-shrink-0', colors.icon)}
        >
          <Icon className="w-6 h-6" />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-gray-900 text-sm">{insight.title}</h4>
            <span className="flex-shrink-0 text-lg font-bold text-gray-700">
              {insight.metric}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
            <Lightbulb className="w-3 h-3" />
            <span>{insight.recommendation}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface InsightsGridProps {
  insights: Insight[];
  isLoading?: boolean;
}

export function InsightsGrid({ insights, isLoading = false }: InsightsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-gray-100 h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {insights.map((insight, index) => (
        <InsightsCard key={insight.type} insight={insight} index={index} />
      ))}
    </div>
  );
}

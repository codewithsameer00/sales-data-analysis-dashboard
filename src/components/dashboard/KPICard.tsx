/**
 * KPI Card Component
 * Displays key metrics with animated counters and icons
 */

'use client';

import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  BarChart3,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change?: number;
  changeLabel?: string;
  icon: 'dollar' | 'trending' | 'cart' | 'chart';
  delay?: number;
  decimals?: number;
}

const iconMap = {
  dollar: DollarSign,
  trending: TrendingUp,
  cart: ShoppingCart,
  chart: BarChart3,
};

const colorMap = {
  dollar: {
    bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
    icon: 'bg-emerald-500',
    accent: 'text-emerald-600',
  },
  trending: {
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
    icon: 'bg-blue-500',
    accent: 'text-blue-600',
  },
  cart: {
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
    icon: 'bg-purple-500',
    accent: 'text-purple-600',
  },
  chart: {
    bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
    icon: 'bg-orange-500',
    accent: 'text-orange-600',
  },
};

export function KPICard({
  title,
  value,
  prefix = '',
  suffix = '',
  change,
  changeLabel = 'vs last period',
  icon,
  delay = 0,
  decimals = 0,
}: KPICardProps) {
  const { formattedValue } = useAnimatedCounter({
    end: value,
    duration: 2000,
    decimals,
    prefix,
    suffix,
  });

  const Icon = iconMap[icon];
  const colors = colorMap[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={cn(
        'relative overflow-hidden rounded-2xl p-6 shadow-lg',
        'bg-white border border-gray-100',
        'hover:shadow-xl transition-shadow duration-300'
      )}
    >
      {/* Background gradient accent */}
      <div className={cn(
        'absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-50',
        colors.bg
      )} />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <motion.h3 
            className="text-3xl font-bold text-gray-900 tabular-nums"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: delay * 0.1 }}
          >
            {formattedValue}
          </motion.h3>
          
          {change !== undefined && (
            <motion.div 
              className="flex items-center mt-2 gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + delay * 0.1 }}
            >
              {change >= 0 ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span className={cn(
                'text-sm font-medium',
                change >= 0 ? 'text-emerald-600' : 'text-red-600'
              )}>
                {change >= 0 ? '+' : ''}{change.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-400 ml-1">{changeLabel}</span>
            </motion.div>
          )}
        </div>
        
        <motion.div 
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-xl',
            colors.icon
          )}
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
}

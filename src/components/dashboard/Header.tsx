/**
 * Header Component
 * Top header bar with search, notifications, and user profile
 */

'use client';

import { motion } from 'framer-motion';
import { Bell, Search, Settings, User, Calendar } from 'lucide-react';
import { FilterOptions } from '@/lib/api';

interface HeaderProps {
  title: string;
  subtitle?: string;
  filterOptions?: FilterOptions;
  selectedYear?: number;
  selectedRegion?: string;
  selectedCategory?: string;
  onYearChange?: (year: number | undefined) => void;
  onRegionChange?: (region: string) => void;
  onCategoryChange?: (category: string) => void;
  showFilters?: boolean;
}

export function Header({
  title,
  subtitle,
  filterOptions,
  selectedYear,
  selectedRegion,
  selectedCategory,
  onYearChange,
  onRegionChange,
  onCategoryChange,
  showFilters = false,
}: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-gray-200 px-6 py-4"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Title section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Filters */}
          {showFilters && filterOptions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2"
            >
              {/* Year Filter */}
              <select
                value={selectedYear || ''}
                onChange={(e) => onYearChange?.(e.target.value ? parseInt(e.target.value) : undefined)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Years</option>
                {filterOptions.years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              {/* Region Filter */}
              <select
                value={selectedRegion || 'all'}
                onChange={(e) => onRegionChange?.(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {filterOptions.regions.map((region) => (
                  <option key={region} value={region}>
                    {region === 'all' ? 'All Regions' : region}
                  </option>
                ))}
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory || 'all'}
                onChange={(e) => onCategoryChange?.(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {filterOptions.categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </motion.div>
          )}

          {/* Date display */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

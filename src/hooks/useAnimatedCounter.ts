/**
 * Custom hook for animated counter effect
 * Smoothly animates numbers from 0 to target value
 */

import { useState, useEffect, useRef } from 'react';

interface UseAnimatedCounterOptions {
  start?: number;
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export function useAnimatedCounter({
  start = 0,
  end,
  duration = 2000,
  decimals = 0,
  prefix = '',
  suffix = '',
}: UseAnimatedCounterOptions) {
  const [displayValue, setDisplayValue] = useState(start);
  const animationRef = useRef<number | null>(null);
  const prevEndRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Skip initial mount animation if start equals end
    if (prevEndRef.current === undefined && start === end) {
      prevEndRef.current = end;
      return;
    }
    
    // Skip if same value
    if (prevEndRef.current === end) return;
    prevEndRef.current = end;

    const startValue = displayValue;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (ease-out-cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValue + (end - startValue) * easeOut;
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [end, duration, displayValue, start]);

  const formatNumber = (num: number): string => {
    if (Math.abs(num) >= 1000000) {
      return (num / 1000000).toFixed(decimals) + 'M';
    } else if (Math.abs(num) >= 1000) {
      return (num / 1000).toFixed(decimals) + 'K';
    }
    return num.toFixed(decimals);
  };

  return {
    value: displayValue,
    formattedValue: `${prefix}${formatNumber(displayValue)}${suffix}`,
  };
}

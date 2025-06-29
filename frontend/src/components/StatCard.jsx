import React, { useState, useEffect } from 'react';
import { useCountUp } from '@/hooks/useCountUp';

export const StatCard = ({
  value,
  suffix = '',
  label,
  description,
  decimals = 0,
  delay = 0,
  icon
}) => {
  const { count, ref } = useCountUp({ 
    end: value, 
    duration: 2000 + delay, 
    decimals,
    startOnView: true 
  });

  return (
    <div 
      ref={ref}
      className="text-center group transform transition-all duration-500 hover:scale-105"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Icon Container */}
      <div className="w-20 h-20 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all duration-300">
        <div className="text-white text-2xl">
          {icon}
        </div>
      </div>

      {/* Stat Value */}
      <div className="mb-3">
        <span className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
          {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}
        </span>
        <span className="text-4xl lg:text-5xl font-bold text-white/90">
          {suffix}
        </span>
      </div>

      {/* Label */}
      <h3 className="text-xl font-semibold text-white mb-2">
        {label}
      </h3>

      {/* Description */}
      <p className="text-blue-100 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

import React from 'react';
import { Users, FileText, Clock, Shield } from 'lucide-react';
import { StatCard } from '@/components/StatCard';


export const AnimatedStats = () => {
  const stats = [
    {
      value: 10,
      suffix: 'M+',
      label: 'Happy Users',
      description: 'Trusted by millions worldwide',
      icon: <Users size={32} />,
      delay: 0
    },
    {
      value: 500,
      suffix: 'M+',
      label: 'Files Converted',
      description: 'Processed with precision',
      icon: <FileText size={32} />,
      delay: 200
    },
    {
      value: 99.9,
      suffix: '%',
      label: 'Uptime',
      description: 'Always available when you need',
      decimals: 1,
      icon: <Clock size={32} />,
      delay: 400
    },
    {
      value: 256,
      suffix: '-bit',
      label: 'SSL Encryption',
      description: 'Enterprise-grade security',
      icon: <Shield size={32} />,
      delay: 600
    }
  ];

  return (
<section className="relative py-10 lg:py-14 overflow-hidden">
  {/* Gradient Background */}
  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700"></div>
  
  {/* Decorative Pattern */}
  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
  
  {/* Floating Orbs */}
  <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
  <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/3 rounded-full blur-2xl"></div>
  
  {/* Stats Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
    {stats.map((stat, index) => (
      <StatCard
        key={index}
        value={stat.value}
        suffix={stat.suffix}
        label={stat.label}
        description={stat.description}
        decimals={stat.decimals}
        delay={stat.delay}
        icon={stat.icon}
      />
    ))}
  </div>
</section>
  );
};

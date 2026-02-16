'use client';

import React, { ReactNode } from 'react';
import { Shield, CheckCircle, Star, TrendingUp, Zap } from 'lucide-react';

/**
 * Badge Component
 * For displaying product status, certifications, delivery info
 */

interface BadgeProps {
  type?:
    | 'genuine'
    | 'secure'
    | 'delivery'
    | 'stock'
    | 'featured'
    | 'certified'
    | 'trending'
    | 'custom';
  label: string;
  variant?: 'filled' | 'outlined';
  size?: 'sm' | 'md';
  icon?: ReactNode;
  customColor?: string;
  customBgColor?: string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  type = 'custom',
  label,
  variant = 'filled',
  size = 'md',
  icon,
  customColor,
  customBgColor,
  className,
}) => {
  const badgeConfig = {
    genuine: {
      icon: <Shield className="w-3.5 h-3.5" />,
      color: '#FBC02D',
      bgColor: 'rgba(251, 192, 45, 0.15)',
      textColor: '#F57F17',
    },
    secure: {
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      color: '#388E3C',
      bgColor: 'rgba(56, 142, 60, 0.15)',
      textColor: '#1B5E20',
    },
    delivery: {
      icon: <Zap className="w-3.5 h-3.5" />,
      color: '#1976D2',
      bgColor: 'rgba(25, 118, 210, 0.15)',
      textColor: '#0D47A1',
    },
    stock: {
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      color: '#388E3C',
      bgColor: 'rgba(56, 142, 60, 0.15)',
      textColor: '#1B5E20',
    },
    featured: {
      icon: <Star className="w-3.5 h-3.5" />,
      color: '#FBC02D',
      bgColor: 'rgba(251, 192, 45, 0.15)',
      textColor: '#F57F17',
    },
    certified: {
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      color: '#388E3C',
      bgColor: 'rgba(56, 142, 60, 0.15)',
      textColor: '#1B5E20',
    },
    trending: {
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      color: '#D32F2F',
      bgColor: 'rgba(211, 47, 47, 0.15)',
      textColor: '#B71C1C',
    },
    custom: {
      icon: null,
      color: customColor || '#757575',
      bgColor: customBgColor || 'rgba(117, 117, 117, 0.1)',
      textColor: customColor || '#424242',
    },
  };

  const config = badgeConfig[type];
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-badge' : 'px-2.5 py-1 text-badge';

  if (variant === 'outlined') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-full border border-current font-montserrat font-semibold ${sizeClass} ${className}`}
        style={{ color: config.color }}
      >
        {icon || config.icon}
        <span>{label}</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-montserrat font-semibold ${sizeClass} ${className}`}
      style={{ backgroundColor: config.bgColor, color: config.textColor }}
    >
      {icon || config.icon}
      <span>{label}</span>
    </div>
  );
};

export default Badge;

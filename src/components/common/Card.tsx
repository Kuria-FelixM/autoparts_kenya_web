'use client';

import React, { ReactNode } from 'react';

/**
 * Card Component
 * Base wrapper for products, orders, etc.
 */

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  hoverable?: boolean;
  onClick?: () => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverable = false,
  onClick,
  className = '',
}) => {
  const baseClass =
    'bg-white rounded-lg overflow-hidden transition-all duration-200';

  const variantClass = {
    default: 'shadow-md',
    elevated: 'shadow-lg',
    outlined: 'border border-road-grey-300',
  }[variant];

  const hoverClass = hoverable ? 'hover:shadow-lg cursor-pointer hover:scale-105' : '';

  return (
    <div
      className={`${baseClass} ${variantClass} ${hoverClass} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
};

export default Card;

'use client';

import React, { ReactNode } from 'react';
import { } from 'lucide-react';
import Button from './Button';

/**
 * Empty State Component
 * Friendly messaging for no results, empty cart, etc.
 * With Swahili/English bilingual support
 */

interface EmptyStateProps {
  type?: 'no-results' | 'empty-cart' | 'no-favorites' | 'no-orders' | 'error' | 'custom';
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  langSw?: {
    title: string;
    description?: string;
  };
  imageSrc?: string;
  className?: string;
}

const EmptyStateComponent: React.FC<EmptyStateProps> = ({
  type = 'custom',
  title,
  description,
  icon,
  action,
  langSw,
  imageSrc,
  className = '',
}) => {
  const defaultIcon = {
    'no-results': '🔍',
    'empty-cart': '🛒',
    'no-favorites': '❤️',
    'no-orders': '📦',
    error: '⚠️',
    custom: '📭',
  }[type];

  return (
    <div
      className={`flex flex-col items-center justify-center gap-6 py-16 px-4 text-center ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* Icon or Image */}
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          className="w-32 h-32 md:w-48 md:h-48 opacity-70 object-contain"
        />
      ) : (
        <div className="text-6xl md:text-8xl">{icon || defaultIcon}</div>
      )}

      {/* Title & Description */}
      <div className="space-y-2 max-w-sm">
        <h2 className="text-h3 md:text-h2 font-montserrat font-bold text-road-grey-900">
          {title}
        </h2>
        {description && (
          <p className="text-body-md text-road-grey-700">{description}</p>
        )}

        {/* Swahili variant (optional) */}
        {langSw && (
          <div className="pt-2 border-t border-road-grey-300 mt-4">
            <p className="text-body-md text-road-grey-700 italic">{langSw.title}</p>
            {langSw.description && (
              <p className="text-body-sm text-road-grey-500">{langSw.description}</p>
            )}
          </div>
        )}
      </div>

      {/* Action Button */}
      {action && (
        <Button
          variant="primary"
          size="lg"
          onClick={action.onClick}
          className="mt-4"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyStateComponent;

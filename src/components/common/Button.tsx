'use client';

import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Button Component with multiple variants
 * Primary (CTA), Secondary, Ghost, Disabled states
 */

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-montserrat font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mechanic-blue disabled:opacity-60 disabled:cursor-not-allowed tap-highlight-transparent',
  {
    variants: {
      variant: {
        primary:
          'bg-reliable-red text-white hover:bg-red-700 active:scale-95 shadow-md hover:shadow-lg',
        secondary:
          'bg-white border-2 border-mechanic-blue text-mechanic-blue hover:bg-mechanic-blue/10 active:scale-95',
        ghost:
          'bg-transparent text-mechanic-blue hover:bg-mechanic-blue/10 active:scale-95',
        danger:
          'bg-reliable-red/20 text-reliable-red hover:bg-reliable-red/30 active:scale-95',
        success:
          'bg-success-green text-white hover:bg-green-700 active:scale-95 shadow-md',
      },
      size: {
        sm: 'px-3 py-2 text-body-sm h-10',
        md: 'px-4 py-2.5 text-body-md h-12',
        lg: 'px-6 py-3 text-body-md h-14',
        xl: 'px-8 py-4 text-body-lg h-16',
        icon: 'p-2 h-10 w-10',
        'icon-lg': 'p-3 h-12 w-12',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
      loading: {
        true: 'opacity-70 pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
      loading: false,
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  isLoading?: boolean;
  asLink?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading,
      loading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading || loading;

    return (
      <button
        className={buttonVariants({
          variant,
          size,
          fullWidth,
          loading: isLoading || loading,
          className,
        })}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {isLoading || loading ? (
          <>
            <div className="w-4 h-4 animate-spin-wheel border-2 border-currentColor border-t-transparent rounded-full" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

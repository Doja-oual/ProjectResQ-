import * as React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      default: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
      danger: 'bg-danger-600 text-white hover:bg-danger-700 focus-visible:ring-danger-500',
      warning: 'bg-warning-600 text-white hover:bg-warning-700 focus-visible:ring-warning-500',
      success: 'bg-success-600 text-white hover:bg-success-700 focus-visible:ring-success-500',
      outline:
        'border-2 border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 focus-visible:ring-gray-400',
      ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines classNames using clsx and tailwind-merge
 * Handles proper tailwind class merging to avoid conflicts
 * @example
 * cn('px-2', 'px-4') // Returns 'px-4' (merged)
 * cn('text-red-500', isActive && 'text-blue-500') // Conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

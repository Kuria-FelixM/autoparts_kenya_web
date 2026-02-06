'use client';

import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterOption {
  id: string | number;
  label: string;
  count?: number;
}

interface FilterAccordionProps {
  title: string;
  items: FilterOption[];
  selected: (string | number)[];
  onSelect: (ids: (string | number)[]) => void;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  type?: 'checkbox' | 'radio' | 'range';
  minValue?: number;
  maxValue?: number;
  step?: number;
  isMultiSelect?: boolean;
}

export default function FilterAccordion({
  title,
  items,
  selected,
  onSelect,
  isOpen = false,
  onToggle,
  type = 'checkbox',
  minValue,
  maxValue,
  step = 1000,
  isMultiSelect = true,
}: FilterAccordionProps) {
  const [localOpen, setLocalOpen] = useState(isOpen);
  const [rangeValue, setRangeValue] = useState<[number, number]>([
    minValue || 0,
    maxValue || 100000,
  ]);

  const isControlled = onToggle !== undefined;
  const open = isControlled ? isOpen : localOpen;

  const toggleOpen = () => {
    if (isControlled) {
      onToggle?.(!open);
    } else {
      setLocalOpen(!localOpen);
    }
  };

  const handleCheckboxChange = (id: string | number) => {
    if (isMultiSelect) {
      const newSelected = selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id];
      onSelect(newSelected);
    } else {
      onSelect(selected.includes(id) ? [] : [id]);
    }
  };

  const handleRangeChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...rangeValue];
    newRange[index] = value;
    if (newRange[0] <= newRange[1]) {
      setRangeValue(newRange);
      onSelect(newRange);
    }
  };

  const handleClear = () => {
    onSelect([]);
    setRangeValue([minValue || 0, maxValue || 100000]);
  };

  const hasSelection = type === 'range' ? false : selected.length > 0;

  return (
    <div className="border-b border-road-grey-300">
      <button
        onClick={toggleOpen}
        className="w-full flex items-center justify-between py-4 px-4 hover:bg-road-grey-100 transition-colors"
        aria-expanded={open}
        aria-controls={`filter-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <div className="flex items-center gap-3 flex-1">
          <span className={cn('font-semibold text-sm', hasSelection && 'text-mechanic-blue')}>
            {title}
          </span>
          {hasSelection && (
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-mechanic-blue text-white text-xs font-bold">
              {selected.length}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn('h-5 w-5 text-road-grey-600 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div
          id={`filter-${title.replace(/\s+/g, '-').toLowerCase()}`}
          className="px-4 pb-4 space-y-3 bg-road-grey-50"
        >
          {type === 'range' ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-road-grey-700 mb-2 block">
                  Min: KSh {rangeValue[0].toLocaleString()}
                </label>
                <input
                  type="range"
                  min={minValue || 0}
                  max={maxValue || 100000}
                  step={step}
                  value={rangeValue[0]}
                  onChange={(e) => handleRangeChange(0, parseInt(e.target.value))}
                  className="w-full accent-mechanic-blue"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-road-grey-700 mb-2 block">
                  Max: KSh {rangeValue[1].toLocaleString()}
                </label>
                <input
                  type="range"
                  min={minValue || 0}
                  max={maxValue || 100000}
                  step={step}
                  value={rangeValue[1]}
                  onChange={(e) => handleRangeChange(1, parseInt(e.target.value))}
                  className="w-full accent-mechanic-blue"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {items.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-white cursor-pointer transition-colors"
                  >
                    <input
                      type={type === 'radio' ? 'radio' : 'checkbox'}
                      name={title}
                      checked={selected.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                      className="w-4 h-4 text-mechanic-blue rounded accent-mechanic-blue cursor-pointer"
                    />
                    <span className="flex-1 text-sm text-road-grey-900">{item.label}</span>
                    {item.count !== undefined && (
                      <span className="text-xs text-road-grey-500">({item.count})</span>
                    )}
                  </label>
                ))}
              </div>
              {hasSelection && (
                <button
                  onClick={handleClear}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm text-mechanic-blue hover:text-mechanic-blue/80 font-medium transition-colors"
                >
                  <X className="h-4 w-4" />
                  Clear
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

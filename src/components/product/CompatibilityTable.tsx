'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompatibleVehicle {
  make: string;
  model: string;
  year_from: number;
  year_to: number;
}

interface CompatibilityTableProps {
  vehicles: CompatibleVehicle[];
  className?: string;
}

export default function CompatibilityTable({
  vehicles,
  className,
}: CompatibilityTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className={cn('p-4 bg-road-grey-50 rounded-lg border border-road-grey-300', className)}>
        <p className="text-sm text-road-grey-600">No vehicle data available</p>
      </div>
    );
  }

  const displayedVehicles = isExpanded ? vehicles : vehicles.slice(0, 5);

  return (
    <div className={className}>
      <h3 className="font-bold text-lg text-road-grey-900 mb-4">Compatible Vehicles</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-mechanic-blue/10 border-b border-road-grey-300">
              <th className="px-4 py-3 text-left font-bold text-road-grey-900">Make</th>
              <th className="px-4 py-3 text-left font-bold text-road-grey-900">Model</th>
              <th className="px-4 py-3 text-left font-bold text-road-grey-900">Years</th>
            </tr>
          </thead>
          <tbody>
            {displayedVehicles.map((vehicle, index) => (
              <tr
                key={index}
                className="border-b border-road-grey-200 hover:bg-road-grey-50 transition-colors"
              >
                <td className="px-4 py-3 font-semibold text-road-grey-900">{vehicle.make}</td>
                <td className="px-4 py-3 text-road-grey-700">{vehicle.model}</td>
                <td className="px-4 py-3 text-road-grey-600">
                  {vehicle.year_from === vehicle.year_to
                    ? vehicle.year_from
                    : `${vehicle.year_from}–${vehicle.year_to}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {vehicles.length > 5 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 mt-4 px-4 py-2 text-mechanic-blue hover:text-mechanic-blue/80 font-semibold text-sm transition-colors"
        >
          {isExpanded ? 'Show Less' : `Show All (${vehicles.length})`}
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')}
          />
        </button>
      )}
    </div>
  );
}

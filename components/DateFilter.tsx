
import React from 'react';

type DateFilterValue = 'all' | 'day' | 'week' | 'month';

interface DateFilterProps {
  currentFilter: DateFilterValue;
  onFilterChange: (filter: DateFilterValue) => void;
}

const filters: { value: DateFilterValue; label: string }[] = [
  { value: 'all', label: 'Tutto' },
  { value: 'day', label: 'Ultime 24h' },
  { value: 'week', label: 'Ultima Settimana' },
  { value: 'month', label: 'Ultimo Mese' },
];

export const DateFilter: React.FC<DateFilterProps> = ({ currentFilter, onFilterChange }) => {
  const baseClasses = "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
  const activeClasses = "bg-indigo-600 text-white shadow";
  const inactiveClasses = "bg-white text-gray-700 hover:bg-gray-100";

  return (
    <div className="flex justify-center mb-6">
      <div className="flex flex-wrap justify-center gap-2 bg-gray-200 p-1 rounded-lg">
        {filters.map(filter => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`${baseClasses} ${currentFilter === filter.value ? activeClasses : inactiveClasses}`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

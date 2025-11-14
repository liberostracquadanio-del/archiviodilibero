
import React from 'react';
import { ViewMode } from '../types';

interface ViewSwitcherProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  isSearchActive: boolean;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange, isSearchActive }) => {
  const baseClasses = "px-6 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
  const activeClasses = "bg-indigo-600 text-white shadow";
  const inactiveClasses = "bg-white text-gray-700 hover:bg-gray-100";

  return (
    <div className="flex justify-center my-8">
      <div className="flex space-x-2 bg-gray-200 p-1 rounded-lg">
        <button
          onClick={() => onViewChange(ViewMode.Temporal)}
          className={`${baseClasses} ${currentView === ViewMode.Temporal ? activeClasses : inactiveClasses}`}
        >
          Vista Temporale
        </button>
        <button
          onClick={() => onViewChange(ViewMode.Category)}
          className={`${baseClasses} ${currentView === ViewMode.Category ? activeClasses : inactiveClasses}`}
        >
          Vista per Categoria
        </button>
        {isSearchActive && (
          <button
            onClick={() => onViewChange(ViewMode.Relevance)}
            className={`${baseClasses} ${currentView === ViewMode.Relevance ? activeClasses : inactiveClasses}`}
          >
            Vista per Rilevanza
          </button>
        )}
      </div>
    </div>
  );
};
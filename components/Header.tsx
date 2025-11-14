import React from 'react';
import { PlusIcon, SearchIcon, NewspaperIcon, DocumentArrowDownIcon } from './icons';

interface HeaderProps {
  onSearch: (term: string) => void;
  onAddNews: () => void;
  onImportNews: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, onAddNews, onImportNews }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex items-center space-x-3">
            <NewspaperIcon className="h-8 w-8 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
              Archivio Giornalista
            </h1>
          </div>
          
          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-md w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">Cerca</label>
              <div className="relative text-gray-400 focus-within:text-gray-600">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <SearchIcon />
                </div>
                <input
                  id="search"
                  className="block w-full bg-white py-2 pl-10 pr-3 border border-gray-300 rounded-md leading-5 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Cerca per titolo o parola chiave..."
                  type="search"
                  name="search"
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center ml-4 space-x-2">
            <button
              onClick={onImportNews}
              type="button"
              className="hidden sm:flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span>Importa</span>
            </button>
            <button
              onClick={onAddNews}
              type="button"
              className="hidden sm:flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Aggiungi</span>
            </button>
             <button
              onClick={onImportNews}
              type="button"
              className="sm:hidden flex items-center justify-center h-10 w-10 bg-green-600 text-white rounded-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              aria-label="Importa Notizia"
            >
              <DocumentArrowDownIcon className="h-6 w-6" />
            </button>
             <button
              onClick={onAddNews}
              type="button"
              className="sm:hidden flex items-center justify-center h-10 w-10 bg-indigo-600 text-white rounded-full shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Aggiungi Notizia"
            >
              <PlusIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
import React from 'react';
import { Search, Download, User } from 'lucide-react';
import { useInventory } from '../contexts/InventoryContext';

const Header = () => {
  const { state, dispatch, importExcel } = useInventory();
  
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-slate-200">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-cobalt-600 to-cobalt-700 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a3 3 0 013 3v8a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm3-1a1 1 0 00-1 1v8a1 1 0 001 1h10a1 1 0 001-1V6a1 1 0 00-1-1H6z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cobalt-700 to-slate-800 bg-clip-text text-transparent">
              InventoryTrace Pro
            </h1>
            <p className="text-xs text-slate-500 font-medium">Gestión y Trazabilidad</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar materiales..."
              className="pl-10 pr-4 py-2 w-72 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-cobalt-500 focus:border-transparent transition-all"
              onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            />
          </div>
          
          <label className="btn-secondary flex items-center gap-2 cursor-pointer">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Importar</span>
            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => importExcel(e.target.files[0])}
            />
          </label>
          
          <div className="w-8 h-8 bg-cobalt-100 rounded-xl flex items-center justify-center text-cobalt-600 font-semibold">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

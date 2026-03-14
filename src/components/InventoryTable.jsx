import React from 'react';
import { Package, AlertCircle } from 'lucide-react';

const InventoryTable = ({ inventory = [], onItemClick }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {/* Cambié cobalt por blue para asegurar compatibilidad, puedes revertirlo si configuraste el color cobalt */}
            <tr className="bg-gradient-to-r from-blue-50 to-slate-50">
              <th className="px-8 py-6 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                Material
              </th>
              <th className="px-6 py-6 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-6 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-8 py-6 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                Stock Actual
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inventory.map((item) => (
              <tr 
                key={item.code}
                className="hover:bg-slate-50 cursor-pointer transition-all group"
                onClick={() => onItemClick(item)}
              >
                <td className="px-8 py-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <Package className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-lg">{item.name}</div>
                      <div className="text-sm text-slate-500">
                        Último movimiento: {item.lastMovement ? item.lastMovement.slice(0, 10) : 'Sin movimientos'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className="inline-flex px-4 py-2 bg-blue-100 text-blue-800 text-sm font-bold rounded-full">
                    {item.code}
                  </span>
                </td>
                <td className="px-6 py-6">
                  <span className="inline-flex px-3 py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-full">
                    {item.category}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-lg ${
                    (item.stock || 0) === 0 
                      ? 'bg-red-100 text-red-800' 
                      : (item.stock || 0) < 10 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {(item.stock || 0).toLocaleString()}
                    {(item.stock || 0) === 0 && <AlertCircle className="w-4 h-4" />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {inventory.length === 0 && (
        <div className="text-center py-20">
          <Package className="mx-auto h-16 w-16 text-slate-400 mb-4" />
          <h3 className="text-xl font-bold text-slate-900">No hay existencias</h3>
          <p className="text-slate-500">Registra un ingreso para comenzar.</p>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
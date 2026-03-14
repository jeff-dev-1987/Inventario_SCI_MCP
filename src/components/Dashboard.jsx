import React, { useState } from 'react';
import { useInventory } from '../contexts/InventoryContext';
import InventoryTable from './InventoryTable';
import ItemHistoryModal from './ItemHistoryModal';
import AddMovementModal from './AddMovementModal';
import StatsCards from './StatsCards';

const Dashboard = () => {
  const { state } = useInventory();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [movementType, setMovementType] = useState('entrada'); // 'entrada' | 'salida'

  const filteredInventory = state.inventory.filter(item =>
    item.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowHistoryModal(true);
  };

  return (
    <div className="space-y-8">
      {/* Stats */}
      <StatsCards inventory={filteredInventory} />
      
      {/* Actions */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="text-2xl font-bold text-slate-900">
          Inventario Actual ({filteredInventory.length})
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              setMovementType('entrada');
              setShowMovementModal(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            ➕ Nueva Entrada
          </button>
          <button 
            onClick={() => {
              setMovementType('salida');
              setShowMovementModal(true);
            }}
            className="btn-danger flex items-center gap-2"
          >
            ➖ Nueva Salida
          </button>
        </div>
      </div>

      {/* Table */}
      <InventoryTable 
        inventory={filteredInventory}
        onItemClick={handleItemClick}
      />

      {/* Modals */}
      <ItemHistoryModal
        item={selectedItem}
        show={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      />
      
      <AddMovementModal
        show={showMovementModal}
        onClose={() => setShowMovementModal(false)}
        type={movementType}
        item={selectedItem}
      />
    </div>
  );
};

export default Dashboard;

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';

const InventoryContext = createContext();

const initialState = {
  inventory: [],
  movements: [],
  currentItem: null,
  searchTerm: '',
  isLoading: false
};

const inventoryReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, inventory: action.payload.inventory, movements: action.payload.movements };
    case 'ADD_MOVEMENT':
      const newMovement = {
        ...action.payload,
        id: Date.now(),
        date: new Date().toISOString(),
        timestamp: Date.now()
      };
      
      const updatedMovements = [...state.movements, newMovement];
      const itemMovements = updatedMovements.filter(m => m.itemCode === action.payload.itemCode);
      
      const latestStock = itemMovements
        .sort((a, b) => b.timestamp - a.timestamp)
        .find(m => m.itemCode === action.payload.itemCode);
      
      const updatedInventory = state.inventory.map(item => 
        item.code === action.payload.itemCode 
          ? { 
              ...item, 
              stock: latestStock ? latestStock.balance : 0,
              lastMovement: newMovement.date
            }
          : item
      );
      
      return { 
        ...state, 
        movements: updatedMovements,
        inventory: updatedInventory
      };
    
    case 'SET_CURRENT_ITEM':
      return { ...state, currentItem: action.payload };
    
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload };
    
    case 'IMPORT_EXCEL':
      return { ...state, inventory: action.payload.inventory, movements: action.payload.movements };
    
    default:
      return state;
  }
};

export const InventoryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(inventoryReducer, initialState);

  // Persistencia localStorage
  useEffect(() => {
    const savedInventory = localStorage.getItem('inventoryTracePro_inventory');
    const savedMovements = localStorage.getItem('inventoryTracePro_movements');
    
    if (savedInventory && savedMovements) {
      const inventory = JSON.parse(savedInventory);
      const movements = JSON.parse(savedMovements);
      
      // Recalcular stocks desde movimientos
      const inventoryWithStock = inventory.map(item => {
        const itemMovements = movements
          .filter(m => m.itemCode === item.code)
          .sort((a, b) => b.timestamp - a.timestamp);
        
        const latestBalance = itemMovements[0]?.balance || 0;
        return { ...item, stock: latestBalance };
      });
      
      dispatch({ 
        type: 'SET_DATA', 
        payload: { inventory: inventoryWithStock, movements } 
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('inventoryTracePro_inventory', JSON.stringify(state.inventory));
    localStorage.setItem('inventoryTracePro_movements', JSON.stringify(state.movements));
  }, [state.inventory, state.movements]);

  // Importar Excel
  const importExcel = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      const newInventory = [];
      const newMovements = [];
      
      jsonData.forEach((row, index) => {
        const itemCode = row['Código'] || row['Codigo'] || row['ID'];
        const itemName = row['Material'] || row['Nombre'] || row['Producto'];
        const quantity = parseInt(row['Cantidad']) || 0;
        const type = row['Tipo']?.toLowerCase() || 'entrada';
        const responsible = row['Responsable'] || `Import ${index + 1}`;
        
        if (itemCode && itemName && quantity > 0) {
          // Crear/actualizar item en inventario
          const existingItem = newInventory.find(i => i.code === itemCode);
          if (!existingItem) {
            newInventory.push({
              code: itemCode,
              name: itemName,
              category: row['Categoría'] || row['Categoria'] || 'General',
              stock: 0
            });
          }
          
          // Crear movimiento
          newMovements.push({
            itemCode,
            type,
            quantity,
            responsible,
            balance: type === 'entrada' ? quantity : -quantity
          });
        }
      });
      
      dispatch({ type: 'IMPORT_EXCEL', payload: { inventory: newInventory, movements: newMovements } });
    };
    reader.readAsArrayBuffer(file);
  }, [dispatch]);

  const value = {
    state,
    dispatch,
    importExcel
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory debe estar dentro de InventoryProvider');
  return context;
};

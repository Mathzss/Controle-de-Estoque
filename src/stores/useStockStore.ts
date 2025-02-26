
import { create } from 'zustand';

export interface Product {
  id: number;
  name: string;
  code: string;
  quantity: number;
  minStock: number;
  category: string;
  batch?: string;
  expirationDate?: string;
}

export interface StockEntry {
  id: number;
  product: string;
  quantity: number;
  date: string;
  supplier: string;
  batch?: string;
  expirationDate?: string;
}

export interface StockExit {
  id: number;
  product: string;
  quantity: number;
  date: string;
  reason: string;
}

interface StockState {
  products: Product[];
  entries: StockEntry[];
  exits: StockExit[];
  addProduct: (product: Omit<Product, "id">) => void;
  addEntry: (entry: Omit<StockEntry, "id">) => void;
  addExit: (exit: Omit<StockExit, "id">) => void;
  updateProductQuantity: (productName: string, quantity: number) => void;
}

export const useStockStore = create<StockState>((set) => ({
  products: [
    { 
      id: 1, 
      name: "Produto 1", 
      code: "P001",
      quantity: 50, 
      minStock: 10, 
      category: "Categoria A",
      batch: "LOT001",
      expirationDate: "2024-12-31"
    },
  ],
  entries: [],
  exits: [],
  
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, { ...product, id: state.products.length + 1 }],
    })),
    
  addEntry: (entry) =>
    set((state) => {
      const newEntry = { ...entry, id: state.entries.length + 1 };
      
      // Verifica se o produto já existe
      const existingProduct = state.products.find(p => p.name === entry.product);
      
      if (existingProduct) {
        // Atualiza o produto existente
        return {
          entries: [newEntry, ...state.entries],
          products: state.products.map((product) =>
            product.name === entry.product
              ? { 
                  ...product, 
                  quantity: product.quantity + entry.quantity,
                  batch: entry.batch || product.batch,
                  expirationDate: entry.expirationDate || product.expirationDate
                }
              : product
          ),
        };
      } else {
        // Cria um novo produto
        const newProduct = {
          id: state.products.length + 1,
          name: entry.product,
          code: `P${String(state.products.length + 1).padStart(3, '0')}`,
          quantity: entry.quantity,
          minStock: 10,
          category: "Sem Categoria",
          batch: entry.batch,
          expirationDate: entry.expirationDate
        };
        
        return {
          entries: [newEntry, ...state.entries],
          products: [...state.products, newProduct],
        };
      }
    }),
    
  addExit: (exit) =>
    set((state) => {
      const newExit = { ...exit, id: state.exits.length + 1 };
      return {
        exits: [newExit, ...state.exits],
        products: state.products.map((product) =>
          product.name === exit.product
            ? { ...product, quantity: product.quantity - exit.quantity }
            : product
        ),
      };
    }),
    
  updateProductQuantity: (productName, quantity) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.name === productName
          ? { ...product, quantity }
          : product
      ),
    })),
}));

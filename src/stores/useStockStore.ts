
import { create } from 'zustand';

export interface Product {
  id: number;
  name: string;
  quantity: number;
  minStock: number;
  category: string;
}

export interface StockEntry {
  id: number;
  product: string;
  quantity: number;
  date: string;
  supplier: string;
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
    { id: 1, name: "Produto 1", quantity: 50, minStock: 10, category: "Categoria A" },
    { id: 2, name: "Produto 2", quantity: 30, minStock: 15, category: "Categoria B" },
    { id: 3, name: "Produto 3", quantity: 75, minStock: 20, category: "Categoria A" },
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
      return {
        entries: [newEntry, ...state.entries],
        products: state.products.map((product) =>
          product.name === entry.product
            ? { ...product, quantity: product.quantity + entry.quantity }
            : product
        ),
      };
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

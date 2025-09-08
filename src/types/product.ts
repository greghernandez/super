// Modelo de departamento para supermercado en l�nea
export interface Department {
  id: number;
  name: string;
  description: string;
  icon: string;
  image: string;
  slug: string;
  isActive: boolean;
}

// Modelo de categoría
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

// Modelo de dimensiones del producto
export interface ProductDimensions {
  length: number; // cm
  width: number; // cm
  height: number; // cm
}

// Modelo de producto
export interface Product {
  id: number;
  sku: string; // Stock Keeping Unit - identificación única
  slug: string; // URL amigable (ej: "arroz-integral-1kg")
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[]; // Múltiples imágenes - la primera es la principal
  category: Category;
  departmentId: number;
  brand: string;
  unit: string;
  stock: number;
  weight: number; // gramos
  dimensions: ProductDimensions;
  isOnSale: boolean;
  discount?: number;
  rating: number;
  reviews: number;
  isActive: boolean; // Estado del producto
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Cart item model
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedWeight?: number;
  notes?: string;
}

// Payment methods
export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'cash' | 'transfer';
  icon: string;
  isActive: boolean;
}

// Shipping methods
export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: string;
  isActive: boolean;
}

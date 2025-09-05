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

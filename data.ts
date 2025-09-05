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

// Departamentos más comunes de supermercado
export const departments: Department[] = [
  {
    id: 1,
    name: 'Frutas y Verduras',
    description: 'Productos frescos, frutas y vegetales orgánicos',
    icon: '🥕',
    image: 'https://placehold.co/600x600/22c55e/f97316/png',
    slug: 'frutas-verduras',
    isActive: true,
  },
  {
    id: 2,
    name: 'Carnes, Pescados y Mariscos',
    description: 'Carnes frescas, embutidos y mariscos',
    icon: '🥩',
    image: 'https://placehold.co/600x600/22c55e/f97316/png',
    slug: 'carnes-pescados',
    isActive: true,
  },
  {
    id: 3,
    name: 'Lácteos y Huevos',
    description: 'Leche, quesos, yogures y productos Lácteos',
    icon: '🥛',
    image: 'https://placehold.co/600x600/22c55e/f97316/png',
    slug: 'lacteos-huevos',
    isActive: true,
  },
  {
    id: 4,
    name: 'Panadeía y Tortillería',
    description: 'Pan fresco, pasteles, productos horneados y tortillas',
    icon: '🍞',
    image: 'https://placehold.co/600x600/22c55e/f97316/png',
    slug: 'panaderia-y-tortilleria',
    isActive: true,
  },
  {
    id: 5,
    name: 'Congelados',
    description: 'Productos congelados y helados',
    icon: '🧊',
    image: 'https://placehold.co/600x600/22c55e/f97316/png',
    slug: 'congelados',
    isActive: true,
  },
  {
    id: 6,
    name: 'Despensa',
    description: 'Productos no perecederos, enlatados y granos',
    icon: '🥫',
    slug: 'despensa',
    image: 'https://placehold.co/600x600/22c55e/f97316/png',
    isActive: true,
  },
  {
    id: 7,
    name: 'Bebidas y Licores',
    description: 'Refrescos, jugos, agua y bebidas alcohólicas',
    icon: '🥤',
    slug: 'bebidas',
    image: 'https://placehold.co/600x600/22c55e/f97316/png',
    isActive: true,
  },
  {
    id: 8,
    name: 'Limpieza',
    description: 'Productos de limpieza para el hogar',
    icon: '🧽',
    image: 'https://placehold.co/600x600/22c55e/f97316/png',
    slug: 'limpieza',
    isActive: true,
  },
  {
    id: 9,
    name: 'Cuidado Personal',
    description: 'Higiene personal, cosm�ticos y farmacia',
    icon: '🧴',
    image: 'https://placehold.co/600x600/22c55e/f97316/png',
    slug: 'cuidado-personal',
    isActive: true,
  },
  {
    id: 10,
    name: 'Bebés',
    description: 'Productos para bebés y niños pequeños',
    icon: '👶',
    image: 'https://placehold.co/600x600/22c55e/f97316/png',
    slug: 'bebe',
    isActive: true,
  },
  {
    id: 11,
    name: 'Mascotas',
    description: 'Alimento y accesorios para mascotas',
    icon: '🐕',
    image: 'https://placehold.co/600x600/22c55e/f97316/png',
    slug: 'mascotas',
    isActive: true,
  },
  {
    id: 12,
    name: 'Hogar',
    description: 'Artículos para el hogar y decoración',
    icon: '🏠',
    image: 'https://placehold.co/600x600/22c55e/f97316/png',
    slug: 'hogar',
    isActive: true,
  },
];

// Modelo de producto
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  departmentId: number;
  brand: string;
  unit: string;
  stock: number;
  isOnSale: boolean;
  discount?: number;
  rating: number;
  reviews: number;
}

// Productos de ejemplo
export const products: Product[] = [
  // Frutas y Verduras
  {
    id: 1,
    name: 'Manzanas Rojas',
    description: 'Manzanas rojas frescas y crujientes',
    price: 25.5,
    originalPrice: 30.0,
    image: 'https://placehold.co/300x300/22c55e/ffffff/png?text=🍎',
    category: 'Frutas',
    departmentId: 1,
    brand: 'Frutas Premium',
    unit: 'kg',
    stock: 50,
    isOnSale: true,
    discount: 15,
    rating: 4.5,
    reviews: 124,
  },
  {
    id: 2,
    name: 'Zanahorias',
    description: 'Zanahorias frescas orgánicas',
    price: 18.0,
    image: 'https://placehold.co/300x300/22c55e/ffffff/png?text=🥕',
    category: 'Verduras',
    departmentId: 1,
    brand: 'Orgánicos del Campo',
    unit: 'kg',
    stock: 75,
    isOnSale: false,
    rating: 4.8,
    reviews: 89,
  },
  {
    id: 3,
    name: 'Aguacates Hass',
    description: 'Aguacates Hass maduros y cremosos',
    price: 45.0,
    image: 'https://placehold.co/300x300/22c55e/ffffff/png?text=🥑',
    category: 'Frutas',
    departmentId: 1,
    brand: 'Frutas Premium',
    unit: 'kg',
    stock: 30,
    isOnSale: false,
    rating: 4.7,
    reviews: 156,
  },
  // Carnes, Pescados y Mariscos
  {
    id: 4,
    name: 'Pechuga de Pollo',
    description: 'Pechuga de pollo sin hueso y sin piel',
    price: 120.0,
    originalPrice: 135.0,
    image: 'https://placehold.co/300x300/22c55e/ffffff/png?text=🍗',
    category: 'Carnes',
    departmentId: 2,
    brand: 'Carnes Selectas',
    unit: 'kg',
    stock: 25,
    isOnSale: true,
    discount: 11,
    rating: 4.6,
    reviews: 67,
  },
  {
    id: 5,
    name: 'Salmón Fresco',
    description: 'Filete de salmón fresco del Atlántico',
    price: 280.0,
    image: 'https://placehold.co/300x300/22c55e/ffffff/png?text=🐟',
    category: 'Pescados',
    departmentId: 2,
    brand: 'Mariscos del Mar',
    unit: 'kg',
    stock: 15,
    isOnSale: false,
    rating: 4.9,
    reviews: 43,
  },
  // Lácteos y Huevos
  {
    id: 6,
    name: 'Leche Entera',
    description: 'Leche entera pasteurizada 1L',
    price: 22.5,
    image: 'https://placehold.co/300x300/22c55e/ffffff/png?text=🥛',
    category: 'Lácteos',
    departmentId: 3,
    brand: 'Lácteos La Vaca',
    unit: 'L',
    stock: 100,
    isOnSale: false,
    rating: 4.4,
    reviews: 203,
  },
  {
    id: 7,
    name: 'Huevos Blancos',
    description: 'Cartón de 12 huevos blancos frescos',
    price: 35.0,
    image: 'https://placehold.co/300x300/22c55e/ffffff/png?text=🥚',
    category: 'Huevos',
    departmentId: 3,
    brand: 'Granja San José',
    unit: 'cartón',
    stock: 80,
    isOnSale: false,
    rating: 4.7,
    reviews: 145,
  },
  // Panadería
  {
    id: 8,
    name: 'Pan Integral',
    description: 'Pan integral de granos enteros',
    price: 28.0,
    image: 'https://placehold.co/300x300/22c55e/ffffff/png?text=🍞',
    category: 'Pan',
    departmentId: 4,
    brand: 'Panadería Artesanal',
    unit: 'pieza',
    stock: 40,
    isOnSale: false,
    rating: 4.3,
    reviews: 78,
  },
  // Congelados
  {
    id: 9,
    name: 'Pizza Margarita Congelada',
    description: 'Pizza margarita congelada familiar',
    price: 85.0,
    originalPrice: 95.0,
    image: 'https://placehold.co/300x300/22c55e/ffffff/png?text=🍕',
    category: 'Comida Congelada',
    departmentId: 5,
    brand: 'Congelados Premium',
    unit: 'pieza',
    stock: 60,
    isOnSale: true,
    discount: 10,
    rating: 4.2,
    reviews: 92,
  },
  // Despensa
  {
    id: 10,
    name: 'Arroz Blanco',
    description: 'Arroz blanco de grano largo 1kg',
    price: 18.5,
    image: 'https://placehold.co/300x300/22c55e/ffffff/png?text=🍚',
    category: 'Granos',
    departmentId: 6,
    brand: 'Granos del Campo',
    unit: 'kg',
    stock: 120,
    isOnSale: false,
    rating: 4.5,
    reviews: 167,
  },
  // Bebidas
  {
    id: 11,
    name: 'Agua Natural',
    description: 'Agua purificada natural 1.5L',
    price: 12.0,
    image: 'https://placehold.co/300x300/22c55e/ffffff/png?text=💧',
    category: 'Agua',
    departmentId: 7,
    brand: 'Agua Pura',
    unit: 'botella',
    stock: 200,
    isOnSale: false,
    rating: 4.6,
    reviews: 234,
  },
  // Limpieza
  {
    id: 12,
    name: 'Detergente Líquido',
    description: 'Detergente líquido para ropa 1L',
    price: 45.0,
    image: 'https://placehold.co/300x300/22c55e/ffffff/png?text=🧽',
    category: 'Detergentes',
    departmentId: 8,
    brand: 'Limpia Todo',
    unit: 'L',
    stock: 85,
    isOnSale: false,
    rating: 4.4,
    reviews: 112,
  },
];

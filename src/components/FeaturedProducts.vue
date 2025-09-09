<template>
  <div class="featured-products">
    <div class="products-header q-mb-md">
      <h6 class="products-title text-h6">Productos Destacados</h6>
      <!-- <q-btn flat no-caps color="primary" class="see-all-btn"> Ver todos </q-btn> -->
    </div>

    <div class="products-grid">
      <product-card
        v-for="product in featuredProducts"
        :key="product.id"
        :product="product"
        @add-to-cart="handleAddToCart"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ProductCard from './products/ProductCard.vue';
import type { Product } from '../types/product';

const featuredProducts = ref<Product[]>([
  {
    id: 1,
    sku: 'RICE001',
    slug: 'arroz-integral-premium-1kg',
    name: 'Arroz Integral Premium',
    description: 'Arroz integral de grano largo, rico en fibra y nutrientes esenciales',
    price: 8.99,
    originalPrice: 12.99,
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'],
    category: {
      id: 1,
      name: 'Cereales',
      slug: 'cereales',
      isActive: true,
    },
    departmentId: 1,
    brand: 'Natura',
    unit: '1kg',
    stock: 150,
    weight: 1000,
    dimensions: { length: 20, width: 12, height: 5 },
    isOnSale: true,
    discount: 31,
    rating: 4.5,
    reviews: 128,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    sku: 'MILK001',
    slug: 'leche-deslactosada-1l',
    name: 'Leche Deslactosada',
    description: 'Leche deslactosada entera, ideal para personas con intolerancia a la lactosa',
    price: 3.5,
    images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop'],
    category: {
      id: 2,
      name: 'Lácteos',
      slug: 'lacteos',
      isActive: true,
    },
    departmentId: 2,
    brand: 'Valle Verde',
    unit: '1L',
    stock: 85,
    weight: 1030,
    dimensions: { length: 8, width: 8, height: 23 },
    isOnSale: false,
    rating: 4.2,
    reviews: 67,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    sku: 'BREAD001',
    slug: 'pan-integral-artesanal',
    name: 'Pan Integral Artesanal',
    description: 'Pan integral horneado artesanalmente con semillas y cereales',
    price: 4.25,
    originalPrice: 5.5,
    images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop'],
    category: {
      id: 3,
      name: 'Panadería',
      slug: 'panaderia',
      isActive: true,
    },
    departmentId: 3,
    brand: 'Horno Dorado',
    unit: '500g',
    stock: 45,
    weight: 500,
    dimensions: { length: 25, width: 12, height: 8 },
    isOnSale: true,
    discount: 23,
    rating: 4.8,
    reviews: 203,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    sku: 'APPLE001',
    slug: 'manzanas-rojas-premium',
    name: 'Manzanas Rojas Premium',
    description: 'Manzanas rojas frescas y crujientes, seleccionadas especialmente',
    price: 5.8,
    images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop'],
    category: {
      id: 4,
      name: 'Frutas',
      slug: 'frutas',
      isActive: true,
    },
    departmentId: 4,
    brand: 'Frescura Natural',
    unit: '1kg',
    stock: 120,
    weight: 1000,
    dimensions: { length: 30, width: 20, height: 15 },
    isOnSale: false,
    rating: 4.6,
    reviews: 89,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]);

const handleAddToCart = (product: Product) => {
  console.log('Agregando al carrito:', product.name);
  // Aquí iría la lógica para agregar al carrito
};
</script>

<style lang="scss" scoped>
.featured-products {
  .products-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .products-title {
      margin: 0;
      color: #1f2937;
    }
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

// xs y sm: 2 columnas (por defecto)
@media (max-width: 991px) {
  .featured-products {
    .products-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
  }
}

// lg y xl: 5 columnas
@media (min-width: 992px) {
  .featured-products {
    .products-grid {
      grid-template-columns: repeat(5, 1fr);
      gap: 16px;
    }
  }
}
</style>

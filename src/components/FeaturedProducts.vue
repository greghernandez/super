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
import { products } from '../../data';

// Función para obtener productos aleatorios
const getRandomProducts = (count: number = 8): Product[] => {
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const featuredProducts = ref<Product[]>(getRandomProducts(6));

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

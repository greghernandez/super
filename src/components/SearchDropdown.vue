<template>
  <div class="search-dropdown" v-if="showResults && filteredProducts.length > 0">
    <q-list separator class="search-results-list">
      <q-item
        v-for="product in limitedResults"
        :key="product.id"
        clickable
        @click="goToProduct(product)"
        class="search-result-item"
      >
        <q-item-section avatar>
          <q-img
            :src="product.images[0]"
            :alt="product.name"
            style="width: 60px; height: 60px; border-radius: 8px"
            fit="cover"
          />
        </q-item-section>

        <q-item-section class="product-info">
          <q-item-label class="product-name">{{ product.name }}</q-item-label>
          <q-item-label caption class="product-brand">{{ product.brand }}</q-item-label>
          <q-item-label caption class="product-unit">{{ product.unit }}</q-item-label>
          <div class="price-section">
            <span class="current-price">${{ product.price.toFixed(2) }}</span>
            <span v-if="product.originalPrice" class="original-price">
              ${{ product.originalPrice.toFixed(2) }}
            </span>
          </div>
        </q-item-section>

        <q-item-section side>
          <q-icon name="chevron_right" color="grey-5" />
        </q-item-section>
      </q-item>

      <!-- Ver más resultados -->
      <q-item
        v-if="filteredProducts.length > (maxResults ?? 5)"
        clickable
        @click="viewAllResults"
        class="view-more-item"
      >
        <q-item-section>
          <q-item-label class="text-primary text-center">
            Ver todos los resultados ({{ filteredProducts.length }})
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>

  <!-- No results -->
  <!-- <div v-else-if="showResults && searchQuery && filteredProducts.length === 0" class="no-results">
      <q-item>
        <q-item-section class="text-center">
          <q-item-label>No se encontraron productos</q-item-label>
          <q-item-label caption>Intenta con otros términos de búsqueda</q-item-label>
        </q-item-section>
      </q-item>
    </div> -->
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Product } from '../types/product';

interface Props {
  searchQuery: string;
  products: Product[];
  showResults: boolean;
  maxResults: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxResults: 5,
});

const emit = defineEmits<{
  'product-selected': [product: Product];
  'view-all': [query: string];
}>();

const router = useRouter();

const filteredProducts = computed(() => {
  if (!props.searchQuery.trim()) return [];

  const query = props.searchQuery.toLowerCase().trim();

  return props.products.filter(
    (product) =>
      product.isActive &&
      (product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category?.name.toLowerCase().includes(query)),
  );
});

const limitedResults = computed(() => {
  return filteredProducts.value.slice(0, props.maxResults ?? 5);
});

const goToProduct = (product: Product) => {
  emit('product-selected', product);
  void router.push(`/producto/${product.slug}`);
};

const viewAllResults = () => {
  emit('view-all', props.searchQuery);
  void router.push(`/buscar?q=${encodeURIComponent(props.searchQuery)}`);
};
</script>

<style scoped>
.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
}

.search-results-list {
  border-radius: 8px;
}

.search-result-item {
  padding: 12px 16px;
  min-height: 80px;
}

.search-result-item:hover {
  background-color: #f5f5f5;
}

.product-info {
  margin-left: 12px;
}

.product-name {
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 4px;
  line-height: 1.2;
}

.product-brand {
  color: #666;
  font-size: 12px;
  margin-bottom: 2px;
}

.product-unit {
  color: #888;
  font-size: 11px;
  margin-bottom: 4px;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.current-price {
  font-weight: bold;
  color: #2e7d32;
  font-size: 14px;
}

.original-price {
  text-decoration: line-through;
  color: #999;
  font-size: 12px;
}

.view-more-item {
  background-color: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  padding: 12px 16px;
}

.view-more-item:hover {
  background-color: #e3f2fd;
}

.no-results {
  padding: 20px;
  text-align: center;
  color: #666;
}
</style>

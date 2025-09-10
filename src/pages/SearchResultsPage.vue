<template>
  <q-page class="search-results-page">
    <div class="container q-pa-md">
      <!-- Header -->
      <div class="search-header q-mb-lg">
        <h4 class="search-title q-ma-none">Resultados de búsqueda para "{{ searchQuery }}"</h4>
        <p class="text-grey-6 q-mt-sm q-mb-none">
          {{ filteredProducts.length }}
          {{ filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados' }}
        </p>
      </div>

      <!-- Filters -->
      <div class="filters-section q-mb-lg">
        <div class="row q-gutter-md">
          <q-select
            v-model="selectedDepartment"
            :options="departmentOptions"
            label="Departamento"
            clearable
            outlined
            dense
            style="min-width: 200px"
            @update:model-value="applyFilters"
          />

          <q-select
            v-model="selectedBrand"
            :options="brandOptions"
            label="Marca"
            clearable
            outlined
            dense
            style="min-width: 150px"
            @update:model-value="applyFilters"
          />

          <q-select
            v-model="sortBy"
            :options="sortOptions"
            label="Ordenar por"
            outlined
            dense
            style="min-width: 180px"
            @update:model-value="applySort"
          />
        </div>
      </div>

      <!-- Results Grid -->
      <div v-if="paginatedProducts.length > 0" class="results-grid">
        <div class="row q-gutter-md">
          <div
            v-for="product in paginatedProducts"
            :key="product.id"
            class="col-12 col-sm-6 col-md-4 col-lg-3"
          >
            <q-card class="product-card cursor-pointer" @click="goToProduct(product)">
              <div class="product-image-container">
                <q-img
                  :src="product.images[0]"
                  :alt="product.name"
                  class="product-image"
                  fit="cover"
                />
                <q-badge v-if="product.isOnSale" color="red" class="discount-badge">
                  -{{ product.discount }}%
                </q-badge>
              </div>

              <q-card-section class="product-info">
                <div class="product-brand text-grey-6">{{ product.brand }}</div>
                <div class="product-name">{{ product.name }}</div>
                <div class="product-unit text-grey-6">{{ product.unit }}</div>

                <div class="price-section q-mt-sm">
                  <span class="current-price">${{ product.price.toFixed(2) }}</span>
                  <span v-if="product.originalPrice" class="original-price">
                    ${{ product.originalPrice.toFixed(2) }}
                  </span>
                </div>

                <div class="rating-section q-mt-xs">
                  <q-rating v-model="product.rating" readonly size="14px" color="amber-5" />
                  <span class="text-grey-6 text-caption q-ml-xs"> ({{ product.reviews }}) </span>
                </div>
              </q-card-section>

              <q-card-actions class="product-actions">
                <q-btn
                  color="primary"
                  unelevated
                  class="full-width"
                  @click.stop="addProductToCart(product)"
                >
                  Agregar al carrito
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-else class="no-results-container text-center q-py-xl">
        <q-icon name="search_off" size="80px" color="grey-4" />
        <h5 class="q-mt-lg q-mb-md">No se encontraron productos</h5>
        <p class="text-grey-6">
          Intenta modificar los filtros o usar diferentes términos de búsqueda.
        </p>
        <q-btn color="primary" outline @click="clearFilters" class="q-mt-md">
          Limpiar filtros
        </q-btn>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination-container q-mt-xl">
        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          :max-pages="6"
          boundary-numbers
          direction-links
          @update:model-value="scrollToTop"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { products, departments } from '../../data';
import { useCart } from '../composables/useCart';
import type { Product } from '../types/product';

const route = useRoute();
const router = useRouter();
const { addToCart } = useCart();

// Reactive data
const searchQuery = ref('');
const selectedDepartment = ref(null);
const selectedBrand = ref(null);
const sortBy = ref('relevance');
const currentPage = ref(1);
const itemsPerPage = 12;

// Filter options
const departmentOptions = computed(() => [
  ...departments.filter((d) => d.isActive).map((d) => ({ label: d.name, value: d.id })),
]);

const brandOptions = computed(() => {
  const brands = [...new Set(products.map((p) => p.brand))].sort();
  return brands.map((brand) => ({ label: brand, value: brand }));
});

const sortOptions = [
  { label: 'Relevancia', value: 'relevance' },
  { label: 'Precio: menor a mayor', value: 'price_asc' },
  { label: 'Precio: mayor a menor', value: 'price_desc' },
  { label: 'Nombre A-Z', value: 'name_asc' },
  { label: 'Nombre Z-A', value: 'name_desc' },
  { label: 'Mejor calificados', value: 'rating_desc' },
];

// Computed properties
const filteredProducts = computed(() => {
  let filtered = products.filter((product) => product.isActive);

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category?.name?.toLowerCase().includes(query),
    );
  }

  // Department filter
  if (selectedDepartment.value) {
    filtered = filtered.filter((product) => product.departmentId === selectedDepartment.value);
  }

  // Brand filter
  if (selectedBrand.value) {
    filtered = filtered.filter((product) => product.brand === selectedBrand.value);
  }

  return filtered;
});

const sortedProducts = computed(() => {
  const sorted = [...filteredProducts.value];

  switch (sortBy.value) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name_asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name_desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'rating_desc':
      return sorted.sort((a, b) => b.rating - a.rating);
    default: // relevance
      return sorted;
  }
});

const totalPages = computed(() => {
  return Math.ceil(sortedProducts.value.length / itemsPerPage);
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return sortedProducts.value.slice(start, end);
});

// Methods
const goToProduct = (product: Product) => {
  void router.push(`/producto/${product.slug}`);
};

const addProductToCart = (product: Product) => {
  addToCart(product, 1);
};

const applyFilters = () => {
  currentPage.value = 1;
};

const applySort = () => {
  currentPage.value = 1;
};

const clearFilters = () => {
  selectedDepartment.value = null;
  selectedBrand.value = null;
  sortBy.value = 'relevance';
  currentPage.value = 1;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Watch for route changes
watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery && typeof newQuery === 'string') {
      searchQuery.value = newQuery;
      currentPage.value = 1;
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (route.query.q && typeof route.query.q === 'string') {
    searchQuery.value = route.query.q;
  }
});
</script>

<style scoped>
.search-results-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.search-title {
  color: #1a1a1a;
  font-weight: 600;
}

.filters-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.results-grid {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-card {
  border-radius: 12px;
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.product-image-container {
  position: relative;
  height: 200px;
}

.product-image {
  height: 100%;
}

.discount-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  font-weight: bold;
}

.product-info {
  padding: 16px;
}

.product-brand {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.product-name {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-unit {
  font-size: 12px;
  margin-bottom: 8px;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.current-price {
  font-weight: bold;
  color: #2e7d32;
  font-size: 18px;
}

.original-price {
  text-decoration: line-through;
  color: #999;
  font-size: 14px;
}

.rating-section {
  display: flex;
  align-items: center;
}

.product-actions {
  padding: 16px;
  padding-top: 0;
}

.no-results-container {
  background: white;
  border-radius: 8px;
  padding: 60px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-container {
  display: flex;
  justify-content: center;
}

@media (max-width: 600px) {
  .filters-section .row {
    flex-direction: column;
  }

  .filters-section .q-select {
    min-width: 100% !important;
  }
}
</style>

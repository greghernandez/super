<template>
  <q-page class="department-page q-pa-lg">
    <div v-if="department" class="department-content">
      <!-- Header del Departamento -->
      <div class="department-header q-mb-lg">
        <h4 class="department-title text-h4 q-mb-sm">{{ department.name }}</h4>
        <p class="department-description text-grey-6">{{ department.description }}</p>
      </div>

      <!-- Grid de Productos -->
      <div class="products-section">
        <!-- <div class="products-header q-mb-lg">
          <h6 class="text-h6 text-weight-bold q-mb-none">Productos disponibles</h6>
          <p class="text-grey-7">{{ departmentProducts.length }} productos encontrados</p>
        </div> -->

        <div class="products-grid">
          <ProductCard
            v-for="product in departmentProducts"
            :key="product.id"
            :product="product"
            @add-to-cart="addToCart"
          />
        </div>

        <!-- Mensaje si no hay productos -->
        <EmptyState
          v-if="departmentProducts.length === 0"
          title="No hay productos disponibles"
          description="Este departamento aún no tiene productos agregados."
        />
      </div>
    </div>

    <!-- Loading state -->
    <div v-else class="loading text-center q-pa-xl">
      <q-spinner-dots size="40px" color="green" />
      <p class="text-grey-6 q-mt-md">Cargando departamento...</p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { departments, products } from '../../data';
import type { Department, Product } from '../types/product';
import ProductCard from '../components/products/ProductCard.vue';
import EmptyState from '../components/EmptyState.vue';

const route = useRoute();
const department = ref<Department | null>(null);

// Computed para obtener productos del departamento
const departmentProducts = computed(() => {
  if (!department.value) return [];
  return products.filter((product) => product.departmentId === department.value!.id);
});

// Función para agregar al carrito
const addToCart = (product: Product) => {
  console.log('Adding to cart:', product.name);
  // TODO: Implementar funcionalidad del carrito
};

// Buscar departamento por slug
const findDepartmentBySlug = (slug: string) => {
  return departments.find((dept) => dept.slug === slug) || null;
};

// Función para actualizar departamento
const updateDepartment = () => {
  const slug = route.params.slug as string;
  department.value = findDepartmentBySlug(slug);
};

// Inicializar departamento
onMounted(() => {
  updateDepartment();
});

// Escuchar cambios en la ruta
watch(
  () => route.params.slug,
  () => {
    updateDepartment();
  },
);
</script>

<style lang="scss" scoped>
.department-page {
  max-width: 1400px;
  margin: 0 auto;
}

.department-header {
  .department-title {
    color: #1f2937;
    margin: 0;
    font-weight: 700;
  }

  .department-description {
    font-size: 16px;
    margin: 0;
    line-height: 1.5;
  }
}

// .products-section {
//   .products-header {
//     border-bottom: 2px solid #f3f4f6;
//     padding-bottom: 1rem;
//   }
// }

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.loading {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

// Responsive
@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .department-header {
    .department-title {
      font-size: 1.5rem;
    }

    .department-description {
      font-size: 14px;
    }
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .department-page {
    padding: 1rem;
  }
}
</style>

<template>
  <q-page class="product-page q-pa-lg">
    <div v-if="product" class="product-content">
      <!-- Breadcrumb -->
      <div class="breadcrumb q-mb-lg">
        <q-breadcrumbs class="text-grey-6">
          <q-breadcrumbs-el label="Inicio" class="cursor-pointer" @click="$router.push('/')" />
          <q-breadcrumbs-el
            :label="department?.name"
            class="cursor-pointer"
            @click="$router.push(`/departamento/${department?.slug}`)"
          />
          <q-breadcrumbs-el :label="product.name" />
        </q-breadcrumbs>
      </div>

      <!-- Product Details -->
      <div class="product-details row q-col-gutter-xl">
        <!-- Product Image -->
        <div class="col-12 col-md-6">
          <div class="product-image-container">
            <q-img :src="product.images[0]" :alt="product.name" class="product-image" />
            <div v-if="product.isOnSale" class="sale-badge">-{{ product.discount }}%</div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="col-12 col-md-6">
          <div class="product-info">
            <!-- Brand -->
            <div class="product-brand text-caption text-grey-6 q-mb-sm">
              {{ product.brand }}
            </div>

            <!-- Name -->
            <h3 class="product-name text-h3 text-weight-bold q-mb-md">
              {{ product.name }}
            </h3>

            <!-- Rating -->
            <div class="product-rating q-mb-md">
              <q-rating
                :model-value="product.rating"
                readonly
                size="20px"
                color="orange"
                icon="star"
              />
              <span class="text-body2 text-grey-6 q-ml-sm">
                {{ product.rating }} ({{ product.reviews }} reseñas)
              </span>
            </div>

            <!-- Price -->
            <div class="product-price q-mb-lg">
              <div class="current-price text-h4 text-weight-bold text-green-8">
                ${{ product.price.toFixed(2) }}
                <span class="price-unit text-body2 text-grey-6"> por {{ product.unit }} </span>
              </div>
              <div
                v-if="product.originalPrice"
                class="original-price text-h6 text-grey-5 text-strike"
              >
                ${{ product.originalPrice.toFixed(2) }}
              </div>
            </div>

            <!-- Stock -->
            <!-- <div class="product-stock q-mb-lg">
              <q-chip
                :color="product.stock > 10 ? 'green' : product.stock > 0 ? 'orange' : 'red'"
                text-color="white"
                size="md"
              >
                {{ product.stock > 0 ? `${product.stock} disponibles` : 'Agotado' }}
              </q-chip>
            </div> -->

            <!-- Description -->
            <div class="product-description q-mb-lg">
              <h6 class="text-h6 text-weight-bold q-mb-sm">Descripción</h6>
              <p class="text-body1 text-grey-7">{{ product.description }}</p>
            </div>

            <!-- Add to Cart Section -->
            <div class="add-to-cart-section">
              <!-- Quantity Selector -->
              <div class="quantity-section q-mb-md">
                <label class="text-body2 text-weight-bold q-mb-sm">Cantidad:</label>
                <div class="quantity-controls">
                  <q-btn
                    flat
                    round
                    size="sm"
                    icon="remove"
                    @click="decreaseQuantity"
                    :disable="selectedQuantity <= 1"
                  />
                  <span class="quantity-display text-h6 q-mx-md">{{ selectedQuantity }}</span>
                  <q-btn
                    flat
                    round
                    size="sm"
                    icon="add"
                    @click="increaseQuantity"
                    :disable="selectedQuantity >= product.stock"
                  />
                </div>
              </div>

              <!-- Add to Cart Button -->
              <q-btn
                :disable="product.stock === 0"
                color="green"
                size="lg"
                unelevated
                no-caps
                class="full-width"
                @click="addToCart"
              >
                <q-icon name="add_shopping_cart" class="q-mr-sm" />
                {{ product.stock > 0 ? `Agregar ${selectedQuantity} al carrito` : 'Agotado' }}
              </q-btn>

              <!-- Already in cart indicator -->
              <div v-if="productQuantityInCart > 0" class="in-cart-indicator q-mt-sm text-center">
                <q-icon name="check_circle" color="green" size="16px" class="q-mr-xs" />
                <span class="text-body2 text-green-8"
                  >{{ productQuantityInCart }} en tu carrito</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-else class="loading text-center q-pa-xl">
      <q-spinner-dots size="40px" color="green" />
      <p class="text-grey-6 q-mt-md">Cargando producto...</p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { departments, products } from '../../data';
import { useCart } from '../composables/useCart';
import type { Product } from '../types/product';

const route = useRoute();
const product = ref<Product | null>(null);
const selectedQuantity = ref(1);

const { addToCart: addProductToCart, getProductQuantity } = useCart();

// Computed para obtener el departamento del producto
const department = computed(() => {
  if (!product.value) return null;
  return departments.find((dept) => dept.id === product.value!.departmentId) || null;
});

// Computed para obtener la cantidad del producto en el carrito
const productQuantityInCart = computed(() => {
  if (!product.value) return 0;
  return getProductQuantity(product.value.id);
});

// Funciones para manejar cantidad
const increaseQuantity = () => {
  if (product.value && selectedQuantity.value < product.value.stock) {
    selectedQuantity.value++;
  }
};

const decreaseQuantity = () => {
  if (selectedQuantity.value > 1) {
    selectedQuantity.value--;
  }
};

// Función para agregar al carrito
const addToCart = () => {
  if (product.value) {
    addProductToCart(product.value, selectedQuantity.value);
    selectedQuantity.value = 1; // Reset quantity after adding
  }
};

// Buscar producto por slug
const findProductBySlug = (slug: string) => {
  return products.find((prod) => prod.slug === slug) || null;
};

// Función para actualizar producto
const updateProduct = () => {
  const slug = route.params.slug as string;
  product.value = findProductBySlug(slug);
};

// Inicializar producto
onMounted(() => {
  updateProduct();
});

// Escuchar cambios en la ruta
watch(
  () => route.params.slug,
  () => {
    updateProduct();
  },
);
</script>

<style lang="scss" scoped>
.product-page {
  max-width: 1400px;
  margin: 0 auto;
}

.breadcrumb {
  .q-breadcrumbs-el {
    cursor: pointer;

    &:hover {
      color: #22c55e;
    }
  }
}

.product-details {
  .product-image-container {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    background: #f9fafb;
    aspect-ratio: 1;

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .sale-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      background: #dc2626;
      color: white;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
    }
  }

  .product-info {
    .product-brand {
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .product-name {
      color: #1f2937;
      line-height: 1.2;
    }

    .product-rating {
      display: flex;
      align-items: center;
    }

    .product-price {
      .current-price {
        display: flex;
        align-items: baseline;
        gap: 0.5rem;
      }
    }

    .product-description {
      p {
        line-height: 1.6;
      }
    }

    .add-to-cart-section {
      .quantity-section {
        label {
          display: block;
          margin-bottom: 8px;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          background: #f8f8f8;
          border-radius: 8px;
          padding: 4px;
          width: fit-content;
        }

        .quantity-display {
          min-width: 40px;
          text-align: center;
        }
      }

      .in-cart-indicator {
        opacity: 0.8;
      }
    }
  }
}

.loading {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

// Responsive
@media (max-width: 768px) {
  .product-details {
    .product-info {
      .product-name {
        font-size: 1.8rem;
      }

      .product-price .current-price {
        font-size: 1.5rem;
      }
    }
  }
}

@media (max-width: 480px) {
  .product-page {
    padding: 1rem;
  }

  .product-details {
    .product-info {
      .product-name {
        font-size: 1.5rem;
      }
    }
  }
}
</style>

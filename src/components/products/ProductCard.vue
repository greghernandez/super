<template>
  <q-card class="product-card" flat bordered @click="navigateToProduct">
    <div class="product-image-container">
      <img :src="product.image" :alt="product.name" class="product-image" />
      <div v-if="product.isOnSale" class="sale-badge">-{{ product.discount }}%</div>
    </div>

    <q-card-section class="product-info">
      <div class="product-brand text-caption text-grey-6 q-mb-xs">
        {{ product.brand }}
      </div>
      <h6 class="product-name text-subtitle2 text-weight-bold q-mb-xs">
        {{ product.name }}
      </h6>
      <p class="product-description text-caption text-grey-7 q-mb-sm">
        {{ product.description }}
      </p>

      <div class="product-rating q-mb-sm">
        <q-rating :model-value="product.rating" readonly size="14px" color="orange" icon="star" />
        <span class="text-caption text-grey-6 q-ml-xs"> ({{ product.reviews }}) </span>
      </div>

      <div class="product-price q-mb-md">
        <span class="current-price text-h6 text-weight-bold text-green-8">
          ${{ product.price.toFixed(2) }}
        </span>
        <span
          v-if="product.originalPrice"
          class="original-price text-caption text-grey-5 text-strike q-ml-sm"
        >
          ${{ product.originalPrice.toFixed(2) }}
        </span>
        <div class="price-unit text-caption text-grey-6">por {{ product.unit }}</div>
      </div>
    </q-card-section>

    <q-card-actions class="product-actions">
      <q-btn
        :disable="product.stock === 0"
        color="green"
        unelevated
        class="full-width"
        @click.stop="addToCart"
      >
        <q-icon name="add_shopping_cart" class="q-mr-sm" />
        {{ product.stock > 0 ? 'Agregar al carrito' : 'Agotado' }}
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Product } from '../../../data';

interface Props {
  product: Product;
}

const props = defineProps<Props>();
const router = useRouter();

const emit = defineEmits<{
  addToCart: [product: Product];
}>();

const addToCart = () => {
  emit('addToCart', props.product);
};

const navigateToProduct = () => {
  void router.push(`/producto/${props.product.id}`);
};
</script>

<style lang="scss" scoped>
.product-card {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e5e7eb;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 10px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  .product-image-container {
    position: relative;
    height: 200px;
    overflow: hidden;
    background: #f9fafb;

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .sale-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: #dc2626;
      color: white;
      padding: 4px 8px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
    }
  }

  &:hover .product-image {
    transform: scale(1.05);
  }

  .product-info {
    padding: 1rem;

    .product-brand {
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .product-name {
      margin: 0;
      line-height: 1.3;
      font-weight: 700;
    }

    .product-description {
      line-height: 1.4;
      margin: 0;
    }

    .product-rating {
      display: flex;
      align-items: center;
    }

    .product-price {
      .current-price {
        font-size: 1.25rem;
      }

      .original-price {
        text-decoration: line-through;
      }

      .price-unit {
        margin-top: 2px;
      }
    }
  }

  .product-actions {
    padding: 0 1rem 1rem 1rem;
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .product-card {
    .product-image-container {
      height: 180px;
    }

    .product-info {
      padding: 0.75rem;
    }
  }
}
</style>

<template>
  <q-card class="order-card q-mb-md" flat bordered>
    <q-card-section>
      <div class="row items-start q-gutter-md">
        <!-- Order Info -->
        <div class="col">
          <div class="row items-center q-mb-sm">
            <div class="text-h6 text-weight-medium">Pedido #{{ order.id }}</div>
          </div>

          <div class="text-body2 text-grey-6 q-mb-sm">
            Realizado el {{ formatDate(order.date) }}
          </div>

          <div v-if="order.status === 'delivered'" class="text-body2 text-green-7 q-mb-sm">
            Entregado el {{ formatDate(order.deliveredDate || order.date) }}
          </div>

          <div class="text-body2 q-mb-sm">
            <strong>Total:</strong> ${{ order.total.toFixed(2) }}
          </div>

          <div class="text-body2 text-grey-7">
            {{ order.items.length }} artículo{{ order.items.length > 1 ? 's' : '' }}
          </div>
        </div>

        <!-- Action Button -->
        <div class="col-auto flex column items-end">
          <q-chip
            :color="getStatusColor(order.status)"
            :text-color="getStatusTextColor(order.status)"
            size="md"
            class="q-mb-sm"
          >
            {{ getStatusLabel(order.status) }}
          </q-chip>
          <q-btn
            flat
            color="grey-8"
            label="Ver detalles"
            no-caps
            @click="$emit('view-details', order.id)"
          />
        </div>
      </div>

      <!-- Product Preview -->
      <div class="products-preview q-mt-md">
        <div class="row q-gutter-sm">
          <div v-for="item in order.items.slice(0, 3)" :key="item.id" class="product-thumb">
            <q-img
              :src="item.image"
              :alt="item.name"
              class="rounded-borders"
              style="width: 60px; height: 60px"
            />
          </div>
          <div v-if="order.items.length > 3" class="more-items flex items-center justify-center">
            <div class="text-caption text-grey-6">+{{ order.items.length - 3 }} más</div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { Order, OrderStatus } from 'src/models/order';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from 'src/models/order';

interface Props {
  order: Order;
}

defineProps<Props>();

defineEmits<{
  'view-details': [orderId: string];
  reorder: [orderId: string];
  'cancel-order': [orderId: string];
}>();

const getStatusColor = (status: OrderStatus) => {
  return ORDER_STATUS_COLORS[status] || 'grey';
};

const getStatusTextColor = (status: OrderStatus) => {
  return status === 'processing' ? 'dark' : 'white';
};

const getStatusLabel = (status: OrderStatus) => {
  return ORDER_STATUS_LABELS[status];
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};
</script>

<style scoped>
.order-card {
  transition: all 0.2s ease;
}

.order-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.products-preview {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 16px;
}

.product-thumb {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.more-items {
  width: 60px;
  height: 60px;
  border: 2px dashed rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.02);
}

@media (max-width: 768px) {
  .products-preview .row {
    justify-content: center;
  }
}
</style>

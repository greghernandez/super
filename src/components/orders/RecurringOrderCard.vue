<template>
  <q-card class="recurring-order-card q-mb-md" flat bordered>
    <q-card-section>
      <div class="row items-start q-gutter-md">
        <!-- Order Info -->
        <div class="col-12 col-md-6">
          <div class="text-h6 text-weight-medium q-mb-sm">
            {{ recurringOrder.name }}
          </div>
          <div class="text-body2 text-grey-6 q-mb-sm">
            {{ recurringOrder.items.length }} productos • ${{ recurringOrder.total.toFixed(2) }}
          </div>
          <div class="text-body2">
            <strong>Programación:</strong>
            {{ getScheduleText(recurringOrder.schedule) }}
          </div>
        </div>

        <!-- Next Delivery -->
        <div class="col-12 col-md-3">
          <div class="text-body2 text-weight-medium q-mb-sm">Próxima entrega</div>
          <div class="text-body1 text-primary">
            {{ formatDate(recurringOrder.nextDelivery) }}
          </div>
        </div>

        <!-- Status -->
        <div class="col-12 col-md-3">
          <q-toggle
            v-model="isActive"
            :label="isActive ? 'Activo' : 'Pausado'"
            color="primary"
            @update:model-value="handleToggle"
          />
        </div>
      </div>

      <!-- Action Button - Positioned absolutely -->
      <q-btn
        flat
        color="grey-8"
        label="Ver detalles"
        no-caps
        class="details-btn"
        @click="$emit('view-details', recurringOrder.id)"
      />

      <!-- Product Preview -->
      <div class="products-preview q-mt-md">
        <div class="row q-gutter-sm">
          <div
            v-for="item in recurringOrder.items.slice(0, 3)"
            :key="item.id"
            class="product-thumb"
          >
            <q-img
              :src="item.image"
              :alt="item.name"
              class="rounded-borders"
              style="width: 60px; height: 60px"
            />
          </div>
          <div
            v-if="recurringOrder.items.length > 3"
            class="more-items flex items-center justify-center"
          >
            <div class="text-caption text-grey-6">+{{ recurringOrder.items.length - 3 }} más</div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  type RecurringOrder,
  type RecurringOrderSchedule,
  DAY_OF_WEEK_LABELS,
} from 'src/models/order';

interface Props {
  recurringOrder: RecurringOrder;
}

interface Emits {
  (e: 'toggle', orderId: string): void;
  (e: 'view-details', orderId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isActive = ref(props.recurringOrder.isActive);

watch(
  () => props.recurringOrder.isActive,
  (newValue) => {
    isActive.value = newValue;
  },
);

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const getScheduleText = (schedule: RecurringOrderSchedule) => {
  switch (schedule.frequency) {
    case 'weekly':
      return `Cada ${DAY_OF_WEEK_LABELS[schedule.dayOfWeek!]}`;
    case 'biweekly':
      return `Cada 2 semanas los ${DAY_OF_WEEK_LABELS[schedule.dayOfWeek!]}`;
    case 'monthly':
      return `Cada mes el día ${schedule.dayOfMonth}`;
    case 'bimonthly':
      return `Cada 2 meses`;
    default:
      return 'Programación personalizada';
  }
};

const handleToggle = () => {
  emit('toggle', props.recurringOrder.id);
};
</script>

<style scoped>
.recurring-order-card {
  transition: all 0.2s ease;
  position: relative;
}

.recurring-order-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.details-btn {
  position: absolute;
  top: 16px;
  right: 16px;
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

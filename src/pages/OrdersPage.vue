<template>
  <q-page class="orders-page q-pa-md">
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header q-mb-lg">
        <h1 class="text-h4 text-weight-bold q-mb-sm">Mis Pedidos</h1>
        <p class="text-grey-6">Consulta y administra tus pedidos regulares y recurrentes</p>
      </div>

      <!-- Tabs for switching between order types -->
      <q-tabs
        v-model="activeTab"
        dense
        class="text-grey-8 q-mb-lg"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="regular" label="Pedidos" />
        <q-tab name="recurring" label="Pedidos Recurrentes" />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated>
        <!-- Regular Orders Tab -->
        <q-tab-panel name="regular" class="q-pa-none">
          <div class="regular-orders-section">
            <!-- Filters and Search -->
            <div class="filters-section q-mb-lg">
              <div class="row q-gutter-md items-center">
                <div class="col-12 col-md-4">
                  <q-input v-model="searchQuery" placeholder="Buscar pedidos..." outlined dense>
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-3">
                  <q-select
                    v-model="statusFilter"
                    :options="statusOptions"
                    label="Estado"
                    outlined
                    dense
                    clearable
                    emit-value
                    map-options
                  />
                </div>
                <div class="col-12 col-md-3">
                  <q-select
                    v-model="dateFilter"
                    :options="dateOptions"
                    label="Período"
                    outlined
                    dense
                    clearable
                    emit-value
                    map-options
                  />
                </div>
              </div>
            </div>

            <!-- Orders List -->
            <div class="orders-list">
              <OrderCard
                v-for="order in filteredOrders"
                :key="order.id"
                :order="order"
                @view-details="viewOrderDetails"
                @reorder="reorder"
                @cancel-order="cancelOrder"
              />

              <!-- Empty State -->
              <div v-if="filteredOrders.length === 0" class="empty-state text-center q-pa-xl">
                <q-icon name="shopping_bag" size="80px" color="grey-4" class="q-mb-md" />
                <div class="text-h6 text-grey-6 q-mb-sm">No se encontraron pedidos</div>
                <div class="text-body2 text-grey-5">
                  {{
                    searchQuery || statusFilter || dateFilter
                      ? 'Intenta ajustar los filtros de búsqueda'
                      : 'Aún no has realizado ningún pedido'
                  }}
                </div>
              </div>
            </div>
          </div>
        </q-tab-panel>

        <!-- Recurring Orders Tab -->
        <q-tab-panel name="recurring" class="q-pa-none">
          <div class="recurring-orders-section">
            <!-- Add Recurring Order Button -->
            <div class="section-header q-mb-lg">
              <div class="row items-center">
                <div class="col">
                  <h5 class="text-h5 text-weight-medium q-ma-none">Pedidos Programados</h5>
                  <p class="text-grey-6 q-ma-none">
                    Programa tus despensas y productos favoritos para recibir automáticamente
                  </p>
                </div>
                <div class="col-auto">
                  <q-btn
                    color="primary"
                    label="Programar Pedido"
                    no-caps
                    icon="add"
                    @click="showCreateRecurringDialog = true"
                  />
                </div>
              </div>
            </div>

            <!-- Recurring Orders List -->
            <div class="recurring-orders-list">
              <RecurringOrderCard
                v-for="recurringOrder in recurringOrders"
                :key="recurringOrder.id"
                :recurring-order="recurringOrder"
                @toggle="toggleRecurringOrder"
                @view-details="viewRecurringOrderDetails"
              />

              <!-- Empty State -->
              <div v-if="recurringOrders.length === 0" class="empty-state text-center q-pa-xl">
                <q-icon name="schedule" size="80px" color="grey-4" class="q-mb-md" />
                <div class="text-h6 text-grey-6 q-mb-sm">No tienes pedidos programados</div>
                <div class="text-body2 text-grey-5 q-mb-lg">
                  Programa tus despensas favoritas para recibir automáticamente
                </div>
                <q-btn
                  color="primary"
                  label="Programar Primer Pedido"
                  @click="showCreateRecurringDialog = true"
                />
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <!-- Create Recurring Order Dialog -->
    <q-dialog v-model="showCreateRecurringDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Programar Pedido Recurrente</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="newRecurringOrder.name"
            label="Nombre del pedido"
            outlined
            class="q-mb-md"
          />

          <q-select
            v-model="newRecurringOrder.frequency"
            :options="frequencyOptions"
            label="Frecuencia"
            outlined
            emit-value
            map-options
            class="q-mb-md"
          />

          <div v-if="newRecurringOrder.frequency === 'weekly'" class="q-mb-md">
            <q-select
              v-model="newRecurringOrder.dayOfWeek"
              :options="dayOfWeekOptions"
              label="Día de la semana"
              outlined
              emit-value
              map-options
            />
          </div>

          <div v-if="newRecurringOrder.frequency === 'monthly'" class="q-mb-md">
            <q-input
              v-model.number="newRecurringOrder.dayOfMonth"
              label="Día del mes (1-28)"
              type="number"
              min="1"
              max="28"
              outlined
            />
          </div>

          <q-input
            v-model="newRecurringOrder.startDate"
            label="Fecha de inicio"
            type="date"
            outlined
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="cancelCreateRecurring" />
          <q-btn
            color="primary"
            label="Crear"
            @click="createRecurringOrder"
            :disable="!isValidRecurringOrder"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import OrderCard from 'src/components/orders/OrderCard.vue';
import RecurringOrderCard from 'src/components/orders/RecurringOrderCard.vue';
import type { Order, RecurringOrder, OrderStatus, RecurringFrequency } from 'src/models/order';
import { ORDER_STATUS_LABELS, FREQUENCY_LABELS, DAY_OF_WEEK_LABELS } from 'src/models/order';

// Reactive data
const activeTab = ref('regular');
const searchQuery = ref('');
const statusFilter = ref<OrderStatus | ''>('');
const dateFilter = ref('Últimos 3 meses');
const showCreateRecurringDialog = ref(false);

// Mock data for regular orders
const orders = ref<Order[]>([
  {
    id: '12345',
    date: new Date('2024-03-15'),
    status: 'delivered',
    total: 89.5,
    items: [
      { 
        id: '550e8400-e29b-41d4-a716-446655440107', 
        name: 'Leche Entera Lala', 
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
        productId: '550e8400-e29b-41d4-a716-446655440107',
        quantity: 2,
        price: 23.5
      },
      { 
        id: '550e8400-e29b-41d4-a716-446655440111', 
        name: 'Pan Dulce Variado', 
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
        productId: '550e8400-e29b-41d4-a716-446655440111',
        quantity: 1,
        price: 35.9
      },
      { 
        id: '550e8400-e29b-41d4-a716-446655440108', 
        name: 'Huevos San Juan', 
        image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop',
        productId: '550e8400-e29b-41d4-a716-446655440108',
        quantity: 1,
        price: 54.9
      },
      { 
        id: '550e8400-e29b-41d4-a716-446655440109', 
        name: 'Queso Oaxaca', 
        image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400&h=400&fit=crop',
        productId: '550e8400-e29b-41d4-a716-446655440109',
        quantity: 1,
        price: 89.9
      },
    ],
  },
  {
    id: '12346',
    date: new Date('2024-03-18'),
    status: 'in_transit',
    total: 156.75,
    items: [
      { 
        id: '550e8400-e29b-41d4-a716-446655440112', 
        name: 'Arroz Verde Valle', 
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
        productId: '550e8400-e29b-41d4-a716-446655440112',
        quantity: 2,
        price: 28.9
      },
      { 
        id: '550e8400-e29b-41d4-a716-446655440113', 
        name: 'Frijoles Negros La Costeña', 
        image: 'https://images.unsplash.com/photo-1599590142875-f0aca6fb3d1f?w=400&h=400&fit=crop',
        productId: '550e8400-e29b-41d4-a716-446655440113',
        quantity: 3,
        price: 22.9
      },
      { 
        id: '550e8400-e29b-41d4-a716-446655440115', 
        name: 'Coca-Cola', 
        image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=400&fit=crop',
        productId: '550e8400-e29b-41d4-a716-446655440115',
        quantity: 2,
        price: 35.5
      },
    ],
  },
  {
    id: '12347',
    date: new Date('2024-03-20'),
    status: 'processing',
    total: 234.2,
    items: [
      { 
        id: '550e8400-e29b-41d4-a716-446655440105', 
        name: 'Carne Molida de Res', 
        image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&h=400&fit=crop',
        productId: '550e8400-e29b-41d4-a716-446655440105',
        quantity: 1,
        price: 139.9
      },
      { 
        id: '550e8400-e29b-41d4-a716-446655440106', 
        name: 'Pollo Entero', 
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop',
        productId: '550e8400-e29b-41d4-a716-446655440106',
        quantity: 1,
        price: 89.9
      },
    ],
  },
]);

// Mock data for recurring orders
const recurringOrders = ref<RecurringOrder[]>([
  {
    id: 'rec-001',
    name: 'Despensa Básica',
    total: 450.0,
    schedule: {
      frequency: 'weekly',
      dayOfWeek: 1, // Monday
    },
    nextDelivery: new Date('2024-03-25'),
    isActive: true,
    createdAt: new Date('2024-01-15'),
    items: [
      { 
        id: '550e8400-e29b-41d4-a716-446655440107', 
        name: 'Leche Entera Lala', 
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
        productId: '550e8400-e29b-41d4-a716-446655440107',
        quantity: 3,
        price: 23.5
      },
      { 
        id: '550e8400-e29b-41d4-a716-446655440110', 
        name: 'Tortillas de Maíz', 
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
        productId: '550e8400-e29b-41d4-a716-446655440110',
        quantity: 2,
        price: 18.9
      },
      { 
        id: '550e8400-e29b-41d4-a716-446655440108', 
        name: 'Huevos San Juan', 
        image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop',
        productId: '550e8400-e29b-41d4-a716-446655440108',
        quantity: 2,
        price: 54.9
      },
      { 
        id: '550e8400-e29b-41d4-a716-446655440112', 
        name: 'Arroz Verde Valle', 
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
        productId: '550e8400-e29b-41d4-a716-446655440112',
        quantity: 4,
        price: 28.9
      },
      { 
        id: '550e8400-e29b-41d4-a716-446655440113', 
        name: 'Frijoles Negros La Costeña', 
        image: 'https://images.unsplash.com/photo-1599590142875-f0aca6fb3d1f?w=400&h=400&fit=crop',
        productId: '550e8400-e29b-41d4-a716-446655440113',
        quantity: 5,
        price: 22.9
      },
    ],
  },
  {
    id: 'rec-002',
    name: 'Productos de Limpieza',
    total: 125.5,
    schedule: {
      frequency: 'biweekly',
      dayOfWeek: 5, // Friday
    },
    nextDelivery: new Date('2024-03-29'),
    isActive: false,
    createdAt: new Date('2024-02-01'),
    items: [
      { 
        id: '550e8400-e29b-41d4-a716-446655440118', 
        name: 'Detergente Ariel', 
        image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop',
        productId: '550e8400-e29b-41d4-a716-446655440118',
        quantity: 1,
        price: 89.9
      },
      { 
        id: '550e8400-e29b-41d4-a716-446655440121', 
        name: 'Jabón Zote Rosa', 
        image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop',
        productId: '550e8400-e29b-41d4-a716-446655440121',
        quantity: 3,
        price: 12.9
      },
      { 
        id: '550e8400-e29b-41d4-a716-446655440119', 
        name: 'Fabuloso Multiusos', 
        image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop',
        productId: '550e8400-e29b-41d4-a716-446655440119',
        quantity: 2,
        price: 24.9
      },
    ],
  },
]);

// New recurring order form
const newRecurringOrder = ref({
  name: '',
  frequency: '' as RecurringFrequency | '',
  dayOfWeek: null as number | null,
  dayOfMonth: null as number | null,
  startDate: '',
});

// Filter options
const statusOptions = Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({
  label,
  value: value as OrderStatus,
}));

const dateOptions = [
  { label: 'Última semana', value: '7days' },
  { label: 'Último mes', value: '30days' },
  { label: 'Últimos 3 meses', value: '90days' },
  { label: 'Este año', value: 'year' },
];

const frequencyOptions = Object.entries(FREQUENCY_LABELS).map(([value, label]) => ({
  label,
  value: value as RecurringFrequency,
}));

const dayOfWeekOptions = Object.entries(DAY_OF_WEEK_LABELS).map(([value, label]) => ({
  label,
  value: parseInt(value),
}));

// Computed properties
const filteredOrders = computed(() => {
  let filtered = orders.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (order) =>
        order.id.toLowerCase().includes(query) ||
        order.items.some((item) => item.name.toLowerCase().includes(query)),
    );
  }

  if (statusFilter.value) {
    filtered = filtered.filter((order) => order.status === statusFilter.value);
  }

  return filtered;
});

const isValidRecurringOrder = computed(() => {
  const order = newRecurringOrder.value;
  return (
    order.name &&
    order.frequency &&
    order.startDate &&
    (order.frequency !== 'weekly' || order.dayOfWeek !== null) &&
    (order.frequency !== 'monthly' || order.dayOfMonth)
  );
});

// Actions
const viewOrderDetails = (orderId: string) => {
  console.log('Viewing order details:', orderId);
  // TODO: Navigate to order details page
};

const reorder = (orderId: string) => {
  console.log('Reordering:', orderId);
  // TODO: Add items to cart and navigate to checkout
};

const cancelOrder = (orderId: string) => {
  console.log('Cancelling order:', orderId);
  // TODO: Show confirmation dialog and cancel order
};

const toggleRecurringOrder = (orderId: string) => {
  const order = recurringOrders.value.find((o) => o.id === orderId);
  if (order) {
    console.log(`${order.isActive ? 'Activated' : 'Paused'} recurring order:`, orderId);
    // TODO: Update recurring order status on server
  }
};

const viewRecurringOrderDetails = (orderId: string) => {
  console.log('Viewing recurring order details:', orderId);
  // TODO: Navigate to recurring order details page
};

const cancelCreateRecurring = () => {
  showCreateRecurringDialog.value = false;
  newRecurringOrder.value = {
    name: '',
    frequency: '',
    dayOfWeek: null,
    dayOfMonth: null,
    startDate: '',
  };
};

const createRecurringOrder = () => {
  console.log('Creating recurring order:', newRecurringOrder.value);
  // TODO: Create recurring order on server
  cancelCreateRecurring();
};

onMounted(() => {
  // Component mounted
});
</script>

<style scoped>
.orders-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-container {
  width: 100%;
}

.delivery-status {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 16px;
}

.empty-state {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .filters-section .row {
    flex-direction: column;
  }

  .filters-section .row > div {
    margin-bottom: 12px;
  }
}
</style>

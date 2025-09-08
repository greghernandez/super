<template>
  <q-page class="cart-page">
    <div class="container q-px-lg q-py-md">
      <!-- Header -->
      <div class="cart-header q-mb-lg">
        <h1 class="text-h4 text-weight-bold q-mb-none">Carrito de Compras</h1>
        <p class="text-body2 text-grey-7" v-if="cartItems.length > 0">
          {{ cartItems.length }} artículo(s) en tu carrito
        </p>
      </div>

      <div class="row q-col-gutter-lg">
        <!-- Cart Items -->
        <div class="col-12 col-md-8">
          <!-- Empty State -->
          <div v-if="cartItems.length === 0" class="empty-cart text-center q-py-xl">
            <q-icon name="shopping_cart" size="64px" class="text-grey-4 q-mb-md" />
            <h3 class="text-h6 text-grey-6 q-mb-md">Tu carrito está vacío</h3>
            <p class="text-body2 text-grey-5 q-mb-lg">Agrega productos para empezar tu compra</p>
            <q-btn color="primary" size="lg" no-caps @click="$router.push('/')">
              Continuar Comprando
            </q-btn>
          </div>

          <!-- Cart Items List -->
          <div v-else class="cart-items">
            <q-card
              v-for="item in cartItems"
              :key="item.id"
              class="cart-item q-mb-md"
              flat
              bordered
            >
              <q-card-section class="q-pa-md">
                <div class="row q-col-gutter-md items-start">
                  <!-- Product Image -->
                  <div class="col-auto">
                    <q-img
                      :src="item.product.images[0]"
                      :alt="item.product.name"
                      class="cart-item-image clickable"
                      style="width: 80px; height: 80px"
                      fit="cover"
                      @click="goToProduct(item.product)"
                    />
                  </div>

                  <!-- Product Details -->
                  <div class="col">
                    <p
                      class="text-subtitle1 text-weight-bold q-mb-none clickable product-name"
                      @click="goToProduct(item.product)"
                    >
                      {{ item.product.name }}
                    </p>
                    <p class="text-body2 text-grey-7 q-mb-sm">
                      {{ item.product.brand }} - {{ item.product.unit }}
                    </p>

                    <!-- Notes -->
                    <div v-if="item.notes" class="q-mb-sm">
                      <q-icon name="note" size="16px" class="q-mr-xs text-grey-6" />
                      <span class="text-body2 text-grey-6">{{ item.notes }}</span>
                    </div>

                    <!-- Price -->
                    <div class="price-section">
                      <span class="text-h6 text-weight-bold text-primary">
                        ${{ formatPrice(item.product.price * item.quantity) }}
                      </span>
                      <span
                        v-if="item.product.originalPrice"
                        class="original-price text-body2 text-grey-5 q-ml-sm text-strike"
                      >
                        ${{ formatPrice(item.product.originalPrice * item.quantity) }}
                      </span>
                      <span class="unit-price text-body2 text-grey-6 q-ml-sm">
                        (${{ formatPrice(item.product.price) }} c/u)
                      </span>
                    </div>
                  </div>

                  <!-- Quantity Controls -->
                  <div class="col-auto">
                    <div class="quantity-controls q-mb-md">
                      <q-btn
                        flat
                        round
                        size="sm"
                        icon="remove"
                        @click="decreaseQuantity(item.id)"
                        :disable="item.quantity <= 1"
                        class="q-mr-xs"
                      />
                      <span class="quantity-display text-h6 q-mx-sm">{{ item.quantity }}</span>
                      <q-btn
                        flat
                        round
                        size="sm"
                        icon="add"
                        @click="increaseQuantity(item.id)"
                        class="q-ml-xs"
                      />
                    </div>

                    <!-- Remove Button -->
                    <div class="text-right">
                      <q-btn
                        flat
                        round
                        size="md"
                        icon="delete"
                        color="negative"
                        @click="removeItem(item.id)"
                        class="remove-btn"
                      >
                        <q-tooltip>Eliminar del carrito</q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- Continue Shopping -->
            <q-btn flat color="primary" no-caps @click="$router.push('/')" class="q-mt-md">
              <q-icon name="arrow_back" class="q-mr-xs" />
              Continuar Comprando
            </q-btn>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="col-12 col-md-4" v-if="cartItems.length > 0">
          <q-card class="order-summary" flat bordered>
            <q-card-section class="q-pa-lg">
              <h3 class="text-h6 text-weight-bold q-mb-md">Resumen del Pedido</h3>

              <!-- Totals -->
              <div class="totals-section q-mb-lg">
                <div class="row justify-between q-mb-sm">
                  <span class="text-body2">Subtotal ({{ totalItems }} artículos)</span>
                  <span class="text-body2">${{ formatPrice(subtotal) }}</span>
                </div>
                <div class="row justify-between q-mb-sm">
                  <span class="text-body2">Descuentos</span>
                  <span class="text-body2 text-positive">-${{ formatPrice(totalDiscount) }}</span>
                </div>
                <div class="row justify-between q-mb-sm">
                  <span class="text-body2">Envío</span>
                  <span class="text-body2">
                    {{
                      selectedShipping
                        ? `$${formatPrice(selectedShipping.price)}`
                        : 'Seleccionar método'
                    }}
                  </span>
                </div>
                <q-separator class="q-my-md" />
                <div class="row justify-between items-center">
                  <span class="text-h6 text-weight-bold">Total</span>
                  <span class="text-h6 text-weight-bold text-primary"
                    >${{ formatPrice(total) }}</span
                  >
                </div>
              </div>

              <!-- Shipping Methods -->
              <div class="shipping-section q-mb-lg">
                <h4 class="text-subtitle1 text-weight-bold q-mb-md">Método de Envío</h4>
                <div class="shipping-options">
                  <div
                    v-for="method in shippingMethods"
                    :key="method.id"
                    :class="['shipping-option', { selected: selectedShippingId === method.id }]"
                    @click="selectedShippingId = method.id"
                  >
                    <q-radio
                      v-model="selectedShippingId"
                      :val="method.id"
                      color="primary"
                      class="option-radio"
                    />
                    <div class="option-content">
                      <div class="option-header">
                        <q-icon :name="method.icon" size="20px" class="q-mr-sm text-primary" />
                        <span class="text-subtitle2 text-weight-medium">{{ method.name }}</span>
                        <q-space />
                        <span class="text-subtitle2 text-weight-bold">
                          {{ method.price > 0 ? `$${formatPrice(method.price)}` : 'Gratis' }}
                        </span>
                      </div>
                      <p class="text-body2 text-grey-7 q-ma-none q-mt-xs">
                        {{ method.description }}
                      </p>
                      <p class="text-caption text-grey-6 q-ma-none">{{ method.estimatedDays }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Payment Methods -->
              <div class="payment-section q-mb-lg">
                <h4 class="text-subtitle1 text-weight-bold q-mb-md">Método de Pago</h4>
                <div class="payment-options">
                  <div
                    v-for="method in paymentMethods"
                    :key="method.id"
                    :class="['payment-option', { selected: selectedPaymentId === method.id }]"
                    @click="selectedPaymentId = method.id"
                  >
                    <q-radio
                      v-model="selectedPaymentId"
                      :val="method.id"
                      color="primary"
                      class="option-radio"
                    />
                    <div class="option-content">
                      <div class="option-header">
                        <q-icon :name="method.icon" size="20px" class="q-mr-sm text-primary" />
                        <span class="text-subtitle2 text-weight-medium">{{ method.name }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Checkout Button -->
              <q-btn
                color="primary"
                size="lg"
                no-caps
                class="full-width"
                :disable="!selectedShipping || !selectedPaymentId"
                @click="proceedToCheckout"
              >
                Proceder al Pago
              </q-btn>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Order Confirmation Dialog -->
    <q-dialog v-model="showOrderDialog" persistent>
      <q-card class="order-dialog">
        <q-card-section class="text-center q-pa-lg">
          <q-icon name="check_circle" size="64px" color="positive" class="q-mb-md" />
          <h3 class="text-h5 text-weight-bold q-mb-sm">¡Pedido Realizado!</h3>
          <p class="text-body1 text-grey-7 q-mb-lg">
            Tu pedido ha sido procesado exitosamente. Recibirás una confirmación por email.
          </p>
          <div class="row q-gutter-md justify-center">
            <q-btn
              color="primary"
              size="md"
              no-caps
              @click="goToOrders"
              class="q-px-lg"
            >
              Ver Mis Pedidos
            </q-btn>
            <q-btn
              flat
              color="primary"
              size="md"
              no-caps
              @click="continueShopping"
              class="q-px-lg"
            >
              Seguir Comprando
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCart } from '../composables/useCart';
import type { PaymentMethod, Product, ShippingMethod } from '../types/product';
import { useRouter } from 'vue-router';

const router = useRouter();

const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

const showOrderDialog = ref(false);

const paymentMethods = ref<PaymentMethod[]>([
  {
    id: 'card',
    name: 'Tarjeta de Crédito/Débito',
    type: 'card',
    icon: 'credit_card',
    isActive: true,
  },
  {
    id: 'cash',
    name: 'Efectivo en Entrega',
    type: 'cash',
    icon: 'payments',
    isActive: true,
  },
]);

const shippingMethods = ref<ShippingMethod[]>([
  {
    id: 'standard',
    name: 'Envío a domicilio',
    description: 'Entrega en 3-5 días hábiles',
    price: 0,
    estimatedDays: '3-5 días',
    icon: 'local_shipping',
    isActive: true,
  },
  {
    id: 'pickup',
    name: 'Recoger en Tienda',
    description: 'Disponible en 2 horas',
    price: 0,
    estimatedDays: '2 horas',
    icon: 'store',
    isActive: true,
  },
]);

const selectedPaymentId = ref('');
const selectedShippingId = ref('');

// Computed properties
const totalItems = computed(() => cartItems.value.reduce((sum, item) => sum + item.quantity, 0));

const subtotal = computed(() =>
  cartItems.value.reduce((sum, item) => {
    return sum + (item.product.originalPrice || item.product.price) * item.quantity;
  }, 0),
);

const totalDiscount = computed(() =>
  cartItems.value.reduce((sum, item) => {
    const discount = item.product.originalPrice
      ? (item.product.originalPrice - item.product.price) * item.quantity
      : 0;
    return sum + discount;
  }, 0),
);

const selectedShipping = computed(() =>
  shippingMethods.value.find((method) => method.id === selectedShippingId.value),
);

const total = computed(() => {
  const itemsTotal = cartItems.value.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shippingCost = selectedShipping.value?.price || 0;
  return itemsTotal + shippingCost;
});

// Methods
const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

const increaseQuantity = (itemId: string) => {
  const item = cartItems.value.find((item) => item.id === itemId);
  if (item) {
    updateQuantity(itemId, item.quantity + 1);
  }
};

const decreaseQuantity = (itemId: string) => {
  const item = cartItems.value.find((item) => item.id === itemId);
  if (item && item.quantity > 1) {
    updateQuantity(itemId, item.quantity - 1);
  }
};

const removeItem = (itemId: string) => {
  removeFromCart(itemId);
};

const proceedToCheckout = () => {
  // In a real app, this would navigate to checkout or process the order
  console.log('Proceeding to checkout:', {
    items: cartItems.value,
    payment: selectedPaymentId.value,
    shipping: selectedShippingId.value,
    total: total.value,
  });

  // Clear the cart and show success dialog
  clearCart();
  showOrderDialog.value = true;
};

const goToProduct = (product: Product) => {
  // Navigate to product page
  void router.push(`/producto/${product.slug}`);
};

const goToOrders = () => {
  showOrderDialog.value = false;
  void router.push('/pedidos');
};

const continueShopping = () => {
  showOrderDialog.value = false;
  void router.push('/');
};
</script>

<style lang="scss" scoped>
.cart-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.cart-item {
  transition: all 0.2s ease;
}

.cart-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cart-item-image {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  background: #f8f8f8;
  border-radius: 8px;
  padding: 4px;
}

.quantity-display {
  min-width: 40px;
  text-align: center;
}

.order-summary {
  position: sticky;
  top: 20px;
}

.original-price {
  text-decoration: line-through;
}

.empty-cart {
  background: white;
  border-radius: 12px;
  padding: 60px 20px;
}

.shipping-options,
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.shipping-option,
.payment-option {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 12px;
}

.shipping-option:hover,
.payment-option:hover {
  border-color: $primary;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.12);
}

.shipping-option.selected,
.payment-option.selected {
  border-color: $primary;
  background: #f3f8ff;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.16);
}

.option-radio {
  margin-top: 2px;
}

.option-content {
  flex: 1;
}

.option-header {
  display: flex;
  align-items: center;
  width: 100%;
}

.remove-btn {
  align-self: flex-end;
}

.clickable {
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.clickable:hover {
  opacity: 0.8;
}

.product-name:hover {
  color: $primary;
}

.order-dialog {
  min-width: 400px;
  border-radius: 16px;
}

@media (max-width: 768px) {
  .container {
    padding: 16px 12px;
  }

  .cart-item-image {
    width: 60px !important;
    height: 60px !important;
  }

  .order-summary {
    position: static;
  }
}
</style>

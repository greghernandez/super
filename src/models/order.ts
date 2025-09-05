export type OrderStatus = 'processing' | 'in_transit' | 'delivered' | 'cancelled';

export type RecurringFrequency = 'weekly' | 'biweekly' | 'monthly' | 'bimonthly';

export interface OrderItem {
  id: number;
  name: string;
  image: string;
  quantity?: number;
  price?: number;
}

export interface Order {
  id: string;
  date: Date;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  deliveryAddress?: string;
  estimatedDelivery?: Date;
  trackingNumber?: string;
  deliveredDate?: Date;
}

export interface RecurringOrderSchedule {
  frequency: RecurringFrequency;
  dayOfWeek?: number; // 0-6, Sunday is 0
  dayOfMonth?: number; // 1-28
}

export interface RecurringOrder {
  id: string;
  name: string;
  total: number;
  schedule: RecurringOrderSchedule;
  nextDelivery: Date;
  isActive: boolean;
  items: OrderItem[];
  createdAt: Date;
  lastOrderDate?: Date;
}

export interface OrderFilter {
  status?: OrderStatus;
  dateRange?: '7days' | '30days' | '90days' | 'year';
  searchQuery?: string;
}

// Utility functions for order status
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  processing: 'Procesando',
  in_transit: 'En camino',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  processing: 'warning',
  in_transit: 'info',
  delivered: 'positive',
  cancelled: 'negative',
};

export const DELIVERY_PROGRESS: Record<OrderStatus, number> = {
  processing: 0.2,
  in_transit: 0.7,
  delivered: 1.0,
  cancelled: 0,
};

export const DELIVERY_MESSAGES: Record<OrderStatus, string> = {
  processing: 'Preparando tu pedido',
  in_transit: 'En camino a tu dirección',
  delivered: 'Pedido entregado',
  cancelled: 'Pedido cancelado',
};

export const FREQUENCY_LABELS: Record<RecurringFrequency, string> = {
  weekly: 'Semanal',
  biweekly: 'Quincenal',
  monthly: 'Mensual',
  bimonthly: 'Cada 2 meses',
};

export const DAY_OF_WEEK_LABELS: Record<number, string> = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
};
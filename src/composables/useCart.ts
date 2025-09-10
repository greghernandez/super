import { ref, computed, watchEffect } from 'vue';
import type { CartItem, Product } from '../types/product';

const CART_STORAGE_KEY = 'shopping-cart';
const CART_VERSION = '1.0';

// CartData interface for localStorage
interface CartData {
  version: string;
  timestamp: number;
  items: CartItem[];
}

// Type guard to validate CartItem structure
const isValidCartItem = (item: unknown): item is CartItem => {
  return (
    item !== null &&
    typeof item === 'object' &&
    typeof (item as CartItem).id === 'string' &&
    typeof (item as CartItem).quantity === 'number' &&
    (item as CartItem).quantity > 0 &&
    (item as CartItem).product !== null &&
    typeof (item as CartItem).product === 'object' &&
    typeof (item as CartItem).product.id === 'number' &&
    typeof (item as CartItem).product.name === 'string' &&
    typeof (item as CartItem).product.price === 'number' &&
    Array.isArray((item as CartItem).product.images)
  );
};

// Type guard to validate CartData structure
const isValidCartData = (data: unknown): data is CartData => {
  return (
    data !== null &&
    typeof data === 'object' &&
    typeof (data as CartData).version === 'string' &&
    typeof (data as CartData).timestamp === 'number' &&
    Array.isArray((data as CartData).items)
  );
};

// Utility functions for localStorage
const saveCartToStorage = (items: CartItem[]) => {
  try {
    const cartData: CartData = {
      version: CART_VERSION,
      timestamp: Date.now(),
      items,
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
  } catch (error) {
    console.warn('Failed to save cart to localStorage:', error);
  }
};

const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];

    const parsedData = JSON.parse(stored);

    // Validate data structure using type guard
    if (!isValidCartData(parsedData)) {
      console.warn('Invalid cart data structure, clearing cart');
      clearCartStorage();
      return [];
    }

    const cartData: CartData = parsedData;

    // Version check (for future compatibility)
    if (cartData.version !== CART_VERSION) {
      console.log('Cart version mismatch, clearing cart');
      clearCartStorage();
      return [];
    }

    // Optional: Clear old carts (older than 30 days)
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    if (cartData.timestamp && Date.now() - cartData.timestamp > thirtyDaysInMs) {
      console.log('Cart expired, clearing');
      clearCartStorage();
      return [];
    }

    // Validate each cart item structure using type guard
    const validItems = cartData.items.filter(isValidCartItem);

    return validItems;
  } catch (error) {
    console.warn('Failed to load cart from localStorage:', error);
    clearCartStorage();
    return [];
  }
};

const clearCartStorage = () => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear cart from localStorage:', error);
  }
};

// Initialize cart from localStorage
const cartItems = ref<CartItem[]>(loadCartFromStorage());

export const useCart = () => {
  // Setup automatic persistence - saves to localStorage whenever cartItems changes
  watchEffect(() => {
    saveCartToStorage(cartItems.value);
  });

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cartItems.value.find((item) => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newItem: CartItem = {
        id: `cart-${product.id}-${Date.now()}`,
        product,
        quantity,
      };
      cartItems.value.push(newItem);
    }
  };

  const removeFromCart = (itemId: string) => {
    const index = cartItems.value.findIndex((item) => item.id === itemId);
    if (index > -1) {
      cartItems.value.splice(index, 1);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    const item = cartItems.value.find((item) => item.id === itemId);
    if (item) {
      if (quantity <= 0) {
        removeFromCart(itemId);
      } else {
        item.quantity = quantity;
      }
    }
  };

  const clearCart = () => {
    cartItems.value = [];
    clearCartStorage();
  };

  const getProductQuantity = (productId: string): number => {
    const item = cartItems.value.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const cartCount = computed(() =>
    cartItems.value.reduce((total, item) => total + item.quantity, 0),
  );

  const cartTotal = computed(() =>
    cartItems.value.reduce((total, item) => total + item.product.price * item.quantity, 0),
  );

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getProductQuantity,
    cartCount,
    cartTotal,
  };
};

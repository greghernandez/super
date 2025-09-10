<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-primary">
      <!-- Mobile Top Bar (xs, sm) -->
      <q-toolbar
        class="mobile-top-bar q-px-lg"
        style="height: 48px"
        v-show="$q.screen.xs || $q.screen.sm"
      >
        <q-space />

        <!-- Mobile Login -->
        <q-btn flat no-caps class="text-white q-mr-sm" @click="$router.push('/login')">
          <q-icon name="person" size="20px" class="q-mr-xs" />
          <span>Iniciar sesión</span>
        </q-btn>

        <!-- Mobile Cart -->
        <q-btn flat no-caps class="text-white cart-btn" @click="$router.push('/carrito')">
          <q-badge color="accent" floating rounded>{{ cartCount }}</q-badge>
          <q-icon name="shopping_cart" size="24px" />
        </q-btn>
      </q-toolbar>

      <!-- Main Toolbar -->
      <q-toolbar class="main-toolbar q-px-lg" style="height: 64px">
        <!-- Logo -->
        <q-btn flat no-caps class="logo-btn q-mr-md" @click="$router.push('/')">
          <div class="logo-container">
            <img src="/super-logo.png" alt="Super Logo" class="logo-image" />
            <!-- <span class="text-white text-weight-bold q-ml-xs">Mi Tienda</span> -->
          </div>
        </q-btn>

        <!-- Opciones de entrega -->
        <q-btn
          flat
          no-caps
          class="delivery-btn q-mr-md text-white"
          v-show="$q.screen.md || $q.screen.lg || $q.screen.xl"
        >
          <q-icon name="location_on" size="16px" class="q-mr-xs" />
          <span class="delivery-text">Opciones de entrega</span>
          <q-icon name="expand_more" size="16px" class="q-ml-xs" />
        </q-btn>

        <!-- Departamentos Button -->
        <q-btn-dropdown
          flat
          no-caps
          class="departments-btn q-mr-md text-white"
          style="height: 40px; padding: 0 16px"
        >
          <template v-slot:label>
            <q-icon name="apps" size="20px" class="q-mr-xs" />
            <span>Departamentos</span>
          </template>
          <q-list style="min-width: 200px">
            <q-item
              v-for="department in departments.filter((d) => d.isActive)"
              :key="department.id"
              clickable
              v-close-popup
              @click="navigateToDepartment(department)"
            >
              <q-item-section avatar>
                <q-img
                  :src="department.image"
                  :alt="department.name"
                  style="width: 32px; height: 32px; border-radius: 50%"
                />
              </q-item-section>
              <q-item-section>{{ department.name }}</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <!-- Search Bar -->
        <div
          class="search-container q-mr-md"
          style="flex: 1; position: relative"
          v-show="$q.screen.md || $q.screen.lg || $q.screen.xl"
        >
          <q-input
            v-model="searchQuery"
            placeholder="Buscar en Mi Tienda en línea o en tienda"
            class="search-input"
            dense
            outlined
            bg-color="white"
            @input="onSearchInput"
            @focus="showSearchResults = true"
            @blur="hideSearchResults"
            @keyup.enter="performSearch"
          >
            <template v-slot:append>
              <q-btn
                icon="search"
                color="accent"
                size="sm"
                flat
                dense
                class="search-btn"
                @click="performSearch"
              />
            </template>
          </q-input>

          <!-- Search Results Dropdown -->
          <SearchDropdown
            :search-query="searchQuery"
            :products="products"
            :show-results="showSearchResults && searchQuery.length > 2"
            :max-results="5"
            @product-selected="onProductSelected"
            @view-all="onViewAllResults"
          />
        </div>

        <q-space />

        <!-- Right Side Actions -->
        <div class="right-actions" v-show="$q.screen.md || $q.screen.lg || $q.screen.xl">
          <!-- Reorder -->
          <q-btn
            flat
            no-caps
            class="action-btn text-white q-mr-sm"
            @click="$router.push('/pedidos')"
          >
            <q-icon name="refresh" size="20px" class="q-mr-xs" />
            <div class="btn-content">
              <div class="btn-label">Vuelve a pedir</div>
              <div class="btn-sublabel">Tus productos</div>
            </div>
          </q-btn>

          <!-- Account -->
          <q-btn flat no-caps class="action-btn text-white q-mr-sm" @click="$router.push('/login')">
            <q-icon name="person" size="20px" class="q-mr-xs" />
            <div class="btn-content">
              <div class="btn-label">Iniciar sesión</div>
              <div class="btn-sublabel">Cuenta</div>
            </div>
          </q-btn>

          <!-- Cart -->
          <q-btn
            flat
            no-caps
            class="action-btn text-white cart-btn"
            @click="$router.push('/carrito')"
          >
            <q-badge color="accent" floating rounded>{{ cartCount }}</q-badge>
            <q-icon name="shopping_cart" size="24px" class="q-mr-xs" />
          </q-btn>
        </div>
      </q-toolbar>

      <!-- Secondary Toolbar -->
      <q-toolbar
        class="secondary-toolbar q-px-xs"
        v-show="$q.screen.xs || $q.screen.sm"
        style="height: 48px; background: rgba(255, 255, 255, 0.1)"
      >
        <q-btn flat no-caps size="sm" class="text-white q-mr-md">
          <q-icon name="location_on" size="16px" class="q-mr-xs" />
          <span class="secondary-btn-text">Elige cómo quieres recibir el pedido</span>
          <q-icon name="expand_more" size="16px" class="q-ml-xs" />
        </q-btn>
      </q-toolbar>

      <!-- Mobile Search Bar (xs, sm) -->
      <q-toolbar
        class="mobile-search-bar q-px-lg"
        style="height: 56px; background: rgba(255, 255, 255, 0.1)"
        v-show="$q.screen.xs || $q.screen.sm"
      >
        <div class="mobile-search-container" style="flex: 1; position: relative">
          <q-input
            v-model="searchQuery"
            placeholder="Buscar productos..."
            class="mobile-search-input"
            dense
            outlined
            bg-color="white"
            @input="onSearchInput"
            @focus="showSearchResults = true"
            @blur="hideSearchResults"
            @keyup.enter="performSearch"
          >
            <template v-slot:append>
              <q-btn
                icon="search"
                color="accent"
                size="sm"
                flat
                dense
                class="search-btn"
                @click="performSearch"
              />
            </template>
          </q-input>

          <!-- Mobile Search Results Dropdown -->
          <SearchDropdown
            :search-query="searchQuery"
            :products="products"
            :show-results="showSearchResults && searchQuery.length > 2"
            :max-results="5"
            @product-selected="onProductSelected"
            @view-all="onViewAllResults"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { departments, products } from '../../data';
import { useCart } from '../composables/useCart';
import SearchDropdown from '../components/SearchDropdown.vue';

const router = useRouter();
const searchQuery = ref('');
const showSearchResults = ref(false);
const { cartCount } = useCart();

const onSearchInput = () => {
  if (searchQuery.value.length > 2) {
    showSearchResults.value = true;
  } else {
    showSearchResults.value = false;
  }
};

const hideSearchResults = () => {
  // Add delay to allow click events to process first
  setTimeout(() => {
    showSearchResults.value = false;
  }, 150);
};

const performSearch = () => {
  if (searchQuery.value.trim()) {
    showSearchResults.value = false;
    void router.push(`/buscar?q=${encodeURIComponent(searchQuery.value)}`);
  }
};

const onProductSelected = () => {
  showSearchResults.value = false;
  searchQuery.value = '';
};

const onViewAllResults = () => {
  showSearchResults.value = false;
};

const navigateToDepartment = (department: (typeof departments)[0]) => {
  void router.push(`/departamento/${department.slug}`);
};
</script>

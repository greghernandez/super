import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: 'departamento/:slug',
        component: () => import('pages/DepartmentPage.vue'),
      },
      {
        path: 'producto/:slug',
        component: () => import('pages/ProductPage.vue'),
      },
      {
        path: 'pedidos',
        component: () => import('pages/OrdersPage.vue'),
      },
      {
        path: 'carrito',
        component: () => import('pages/CartPage.vue'),
      },
    ],
  },

  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },

  {
    path: '/signup',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/SignupPage.vue') }],
  },

  {
    path: '/validation',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/ValidationPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

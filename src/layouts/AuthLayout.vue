<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white">
      <q-toolbar style="height: 64px">
        <q-btn flat no-caps class="auth-logo-btn" @click="$router.push('/')">
          <img src="/super-logo.png" alt="Super Logo" class="auth-logo-image" />
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts"></script>

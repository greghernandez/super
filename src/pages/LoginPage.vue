<template>
  <q-page class="login-page">
    <!-- Main login container -->
    <div class="login-container">
      <div class="login-card">
        <div class="text-center" style="color: #1a1a1a">
          <p class="text-h4">Iniciar Sesión</p>
          <p>
            Hola, ingresa tus datos para iniciar sesión<br />
            en tu cuenta
          </p>
        </div>

        <q-form @submit="onSubmit" class="login-form">
          <div class="input-group">
            <q-input
              v-model="email"
              placeholder="Ingresa tu Email"
              type="email"
              outlined
              dense
              class="modern-input"
              :rules="[(val) => (val && val.length > 0) || 'Ingresa tu email']"
            />
          </div>

          <div class="input-group">
            <q-input
              v-model="password"
              placeholder="Contraseña"
              :type="showPassword ? 'text' : 'password'"
              outlined
              dense
              class="modern-input"
              :rules="[(val) => (val && val.length > 0) || 'Ingresa tu contraseña']"
            >
              <template v-slot:append>
                <q-btn
                  flat
                  dense
                  round
                  :icon="showPassword ? 'visibility' : 'visibility_off'"
                  @click="showPassword = !showPassword"
                  size="sm"
                  class="password-toggle"
                />
              </template>
            </q-input>
          </div>

          <div class="forgot-password q-mb-lg">
            <a href="#" class="forgot-link">¿Problemas para iniciar sesión?</a>
          </div>

          <div class="text-center">
            <q-btn
              type="submit"
              label="Iniciar Sesión"
              color="primary"
              text-color="white"
              no-caps
              class="full-width-btn"
            />
          </div>
        </q-form>

        <div class="signup-link q-mt-md">
          ¿No tienes una cuenta?
          <router-link to="/signup" class="signup-text">Regístrate ahora</router-link>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const showPassword = ref(false);

const onSubmit = () => {
  console.log('Login attempt with:', email.value);
  // TODO: Implement login logic
};
</script>

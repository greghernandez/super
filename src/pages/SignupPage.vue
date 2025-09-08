<template>
  <q-page class="signup-page">
    <!-- Main signup container -->
    <div class="signup-container">
      <div class="signup-card">
        <div class="text-center" style="color: #1a1a1a">
          <p class="text-h4">Crear Cuenta</p>
          <p>
            Completa el formulario para crear<br />
            tu nueva cuenta
          </p>
        </div>

        <q-form @submit="onSubmit" class="signup-form">
          <div class="input-group">
            <q-input
              v-model="firstName"
              placeholder="Nombre"
              type="text"
              outlined
              dense
              class="modern-input"
              :rules="[(val) => (val && val.length > 0) || 'Ingresa tu nombre']"
            />
          </div>

          <div class="input-group">
            <q-input
              v-model="lastName"
              placeholder="Apellidos"
              type="text"
              outlined
              dense
              class="modern-input"
              :rules="[(val) => (val && val.length > 0) || 'Ingresa tus apellidos']"
            />
          </div>

          <div class="input-group">
            <q-input
              v-model="phone"
              placeholder="Número telefónico"
              type="number"
              outlined
              dense
              class="modern-input"
              :rules="[
                (val) => (val && val.length > 0) || 'Ingresa tu número telefónico',
                (val) => /^\d{10}$/.test(val) || 'El número debe tener exactamente 10 dígitos',
              ]"
            />
          </div>

          <div class="input-group">
            <q-input
              v-model="email"
              placeholder="Correo electrónico"
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
              :rules="[
                (val) =>
                  (val && val.length >= 6) || 'La contraseña debe tener al menos 6 caracteres',
              ]"
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

          <div class="input-group">
            <q-input
              v-model="confirmPassword"
              placeholder="Confirmar contraseña"
              :type="showConfirmPassword ? 'text' : 'password'"
              outlined
              dense
              class="modern-input"
              :rules="[(val) => val === password || 'Las contraseñas no coinciden']"
            >
              <template v-slot:append>
                <q-btn
                  flat
                  dense
                  round
                  :icon="showConfirmPassword ? 'visibility' : 'visibility_off'"
                  @click="showConfirmPassword = !showConfirmPassword"
                  size="sm"
                  class="password-toggle"
                />
              </template>
            </q-input>
          </div>

          <div class="forgot-password q-mb-lg">
            <q-checkbox
              v-model="acceptTerms"
              label="Acepto los términos y condiciones"
              color="primary"
            />
          </div>

          <div class="text-center">
            <q-btn
              type="submit"
              label="Crear Cuenta"
              color="primary"
              text-color="white"
              no-caps
              :disable="!acceptTerms"
            />
          </div>
        </q-form>

        <div class="signup-link q-mt-md">
          ¿Ya tienes una cuenta?
          <router-link to="/login" class="signup-text">Iniciar sesión</router-link>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const firstName = ref('');
const lastName = ref('');
const phone = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const acceptTerms = ref(false);

const onSubmit = () => {
  console.log('Signup attempt with:', {
    firstName: firstName.value,
    lastName: lastName.value,
    phone: phone.value,
    email: email.value,
  });
  // TODO: Implement signup logic
  // Redirect to validation page
  void router.push('/validation');
};
</script>

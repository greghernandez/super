<template>
  <q-page class="validation-page">
    <!-- Main validation container -->
    <div class="validation-container">
      <div class="validation-card">
        <!-- Verification Form -->
        <div v-if="!isVerified" class="text-center" style="color: #1a1a1a">
          <q-icon name="whatsapp" size="48px" color="green" class="q-mb-md" />
          <p class="text-h4">Verificación de Cuenta</p>
          <p>
            Te hemos enviado un código de verificación<br />
            por WhatsApp al número registrado
          </p>
        </div>

        <q-form v-if="!isVerified" @submit="onSubmit" class="validation-form">
          <div class="input-group">
            <q-input
              v-model="verificationCode"
              placeholder="Código de verificación (6 dígitos)"
              type="number"
              outlined
              dense
              class="modern-input text-center"
              maxlength="6"
              :rules="[
                (val) => (val && val.length > 0) || 'Ingresa el código de verificación',
                (val) => /^\d{6}$/.test(val) || 'El código debe tener exactamente 6 dígitos',
              ]"
            />
          </div>

          <div class="text-center q-mb-md">
            <q-btn
              type="submit"
              label="Verificar Código"
              color="primary"
              text-color="white"
              no-caps
              :disable="!verificationCode || verificationCode.length !== 6"
            />
          </div>

          <div class="text-center">
            <p class="text-caption">¿No recibiste el código?</p>
            <q-btn
              flat
              label="Reenviar código"
              color="primary"
              no-caps
              @click="resendCode"
              :disable="resendDisabled"
            />
            <p v-if="resendTimer > 0" class="text-caption q-mt-sm">
              Reenviar en {{ resendTimer }} segundos
            </p>
          </div>
        </q-form>

        <div v-if="!isVerified" class="validation-link q-mt-md">
          ¿Problemas con la verificación?
          <router-link to="/signup" class="validation-text">Volver al registro</router-link>
        </div>

        <!-- Success Message -->
        <div v-if="isVerified" class="text-center success-message">
          <q-icon name="check_circle" size="64px" color="green" class="q-mb-md" />
          <p class="text-h4" style="color: #22c55e">¡Verificación Exitosa!</p>
          <p style="color: #666">
            Tu cuenta ha sido verificada correctamente.<br />
            Serás redirigido en {{ redirectTimer }} segundos...
          </p>
          
          <div class="q-mt-lg">
            <q-btn
              label="Ir a Inicio"
              color="primary"
              text-color="white"
              no-caps
              @click="goToHome"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const verificationCode = ref('');
const resendDisabled = ref(false);
const resendTimer = ref(0);
const isVerified = ref(false);
const redirectTimer = ref(3);
let resendInterval: ReturnType<typeof setInterval> | null = null;
let redirectInterval: ReturnType<typeof setInterval> | null = null;

const onSubmit = () => {
  console.log('Verification attempt with code:', verificationCode.value);
  // TODO: Implement verification logic
  // Simulate successful verification
  isVerified.value = true;
  
  // Start redirect countdown
  redirectInterval = setInterval(() => {
    redirectTimer.value--;
    if (redirectTimer.value <= 0) {
      goToHome();
    }
  }, 1000);
};

const goToHome = () => {
  if (redirectInterval) {
    clearInterval(redirectInterval);
    redirectInterval = null;
  }
  void router.push('/');
};

const resendCode = () => {
  console.log('Resending verification code');
  // TODO: Implement resend logic

  // Start countdown timer
  resendDisabled.value = true;
  resendTimer.value = 60;

  resendInterval = setInterval(() => {
    resendTimer.value--;
    if (resendTimer.value <= 0) {
      resendDisabled.value = false;
      if (resendInterval) {
        clearInterval(resendInterval);
        resendInterval = null;
      }
    }
  }, 1000);
};

onUnmounted(() => {
  if (resendInterval) {
    clearInterval(resendInterval);
  }
  if (redirectInterval) {
    clearInterval(redirectInterval);
  }
});
</script>

<style scoped>
.validation-page {
  background: #f5f5f5;
  min-height: 100vh;
  position: relative;
  padding: 0 !important;
}

.validation-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  gap: 80px;
}

.validation-card {
  background: white;
  border-radius: 24px;
  padding: 48px 40px;
  max-width: 400px;
  width: 100%;
}

.validation-form {
  margin-top: 30px;
}

.input-group {
  margin-bottom: 20px;
}

.modern-input {
  font-size: 18px;
}

.modern-input .q-field__control {
  height: 50px;
  border-radius: 12px;
}

.text-center input {
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  letter-spacing: 2px;
}

.validation-link {
  text-align: center;
  color: #666;
  font-size: 14px;
}

.validation-text {
  color: #22c55e;
  text-decoration: none;
  font-weight: 600;
}

.validation-text:hover {
  text-decoration: underline;
}

.success-message {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .validation-container {
    flex-direction: column;
    gap: 40px;
    padding: 20px;
  }

  .validation-card {
    padding: 32px 24px;
  }
}
</style>

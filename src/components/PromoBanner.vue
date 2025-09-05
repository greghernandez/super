<template>
  <div class="promo-banner">
    <div class="banner-content q-pa-xl">
      <div class="text-section">
        <h2 class="banner-title">Programa tu despensa ahora y obten 10% de descuento</h2>
        <q-btn class="cta-button" color="accent" unelevated rounded size="md">
          Comprar ahora
        </q-btn>
      </div>
      <div class="image-section">
        <div class="headphone-illustration">🍇</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for this simple banner
</script>

<style lang="scss" scoped>
.promo-banner {
  background: linear-gradient(135deg, #22c55e 0%, #84cc16 100%);
  border-radius: 24px;
  // padding: 32px 40px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  position: relative;

  .banner-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 2;
  }

  .text-section {
    flex: 1;
    color: white;

    .banner-title {
      font-size: 2rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 24px;
      max-width: 400px;
    }

    .cta-button {
      background: white;
      font-weight: 600;
      padding: 12px 32px;
      border-radius: 12px;
      font-size: 16px;

      &:hover {
        background: #f8fafc;
        transform: translateY(-1px);
      }
    }
  }

  .image-section {
    flex: 0 0 200px;
    display: flex;
    align-items: center;
    justify-content: center;

    .headphone-illustration {
      font-size: 120px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      width: 180px;
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
    }
  }

  // Decorative elements
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    filter: blur(40px);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -5%;
    width: 150px;
    height: 150px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
    filter: blur(30px);
  }
}

// Mobile responsive
@media (max-width: 768px) {
  .promo-banner {
    padding: 24px 20px;
    border-radius: 16px;

    .banner-content {
      flex-direction: column;
      text-align: center;
      gap: 24px;
    }

    .text-section {
      .banner-title {
        font-size: 1.5rem;
        margin-bottom: 16px;
      }
    }

    .image-section {
      flex: none;

      .headphone-illustration {
        font-size: 80px;
        width: 120px;
        height: 120px;
      }
    }
  }
}

@media (max-width: 480px) {
  .promo-banner {
    margin: 16px 0;
    padding: 20px 16px;

    .text-section {
      .banner-title {
        font-size: 1.25rem;
      }

      .cta-button {
        padding: 10px 24px;
        font-size: 14px;
      }
    }
  }
}
</style>

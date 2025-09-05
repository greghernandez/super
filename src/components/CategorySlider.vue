<template>
  <div class="category-slider">
    <div class="slider-header q-mb-md">
      <h6 class="slider-title text-h6">Categorias</h6>
      <q-btn flat no-caps color="primary" class="see-all-btn"> Ver todas </q-btn>
    </div>

    <q-scroll-area horizontal class="category-scroll-area" :thumb-style="{ display: 'none' }">
      <div class="category-items row no-wrap q-gutter-sm">
        <div
          v-for="department in departments"
          :key="department.id"
          class="category-item cursor-pointer text-center"
          @click="selectCategory(department)"
        >
          <div class="category-circle">
            <div class="category-icon">{{ department.icon }}</div>
          </div>
          <div class="category-name">{{ department.name }}</div>
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { departments } from '../../data';

const router = useRouter();

const selectCategory = (department: (typeof departments)[0]) => {
  void router.push(`/departamento/${department.slug}`);
};
</script>

<style lang="scss" scoped>
.category-slider {
  .slider-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .slider-title {
      margin: 0;
      color: #1f2937;
    }
  }

  .category-scroll-area {
    height: 120px;
    width: 100%;
  }

  .category-items {
    padding: 4px 0;
  }

  .category-item {
    min-width: 80px;
    width: 80px;
    padding: 8px 4px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-2px);

      .category-circle {
        background: rgba(34, 197, 94, 0.15);
        box-shadow: 0 8px 25px -5px rgba(34, 197, 94, 0.25);
      }
    }

    .category-circle {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 8px auto;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      .category-icon {
        font-size: 28px;
        line-height: 1;
      }
    }

    .category-name {
      font-size: 12px;
      font-weight: 600;
      color: #374151;
      line-height: 1.2;
      text-align: center;
      word-break: break-word;
      max-height: 32px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}

// Mobile responsive
@media (max-width: 480px) {
  .category-slider {
    .category-item {
      min-width: 70px;
      width: 70px;
      padding: 6px 2px;

      .category-circle {
        width: 56px;
        height: 56px;
        margin-bottom: 6px;

        .category-icon {
          font-size: 24px;
        }
      }

      .category-name {
        font-size: 11px;
        max-height: 28px;
      }
    }
  }
}
</style>

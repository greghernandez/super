<template>
  <div class="empty-state text-center q-pa-xl">
    <q-icon :name="icon" :size="iconSize" :color="iconColor" />
    <h6 class="text-h6 text-grey-6 q-mt-md q-mb-xs">{{ title }}</h6>
    <p class="text-grey-5">{{ description }}</p>
    <slot name="actions" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon?: string;
  iconSize?: string;
  iconColor?: string;
  title: string;
  description?: string;
}

withDefaults(defineProps<Props>(), {
  icon: 'inventory_2',
  iconSize: '80px',
  iconColor: 'grey-4',
  description: ''
});
</script>

<style lang="scss" scoped>
.empty-state {
  background: #f9fafb;
  border-radius: 16px;
  margin-top: 2rem;
}
</style>
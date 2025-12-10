<script setup lang="ts">
import Button from './Button.vue'

interface Props {
  title: string
  buttonText?: string
  showButton?: boolean
}

withDefaults(defineProps<Props>(), {
  showButton: true,
})

const emit = defineEmits<{
  (e: 'button-click'): void
}>()
</script>

<template>
  <div class="section-header">
    <h2>{{ title }}</h2>
    <Button v-if="showButton" variant="primary" @click="emit('button-click')">
      {{ buttonText }}
    </Button>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
  }
}
</style>

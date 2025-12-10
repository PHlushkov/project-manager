<script setup lang="ts">
import { useAttrs } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'edit'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
})

const attrs = useAttrs()
</script>

<template>
  <button
    :type="type"
    :class="['btn', `btn-${variant}`]"
    :disabled="disabled"
    v-bind="attrs"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.btn {
  padding: 10px 20px;
  border-radius: $radius-md;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all $transition-base;
  border: none;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.btn-primary {
    background-color: $primary;
    color: $white;

    &:hover:not(:disabled) {
      background-color: $primary-hover;
    }
  }

  &.btn-secondary {
    background-color: $secondary;
    color: $text-secondary;

    &:hover:not(:disabled) {
      background-color: $secondary-hover;
    }
  }

  &.btn-danger {
    background-color: $danger;
    color: $white;

    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  }

  &.btn-outline {
    background-color: $white;
    color: $primary;
    border: 1px solid $primary;

    &:hover:not(:disabled) {
      background-color: $primary;
      color: $white;
    }
  }

  &.btn-edit {
    padding: 6px 12px;
    font-size: 0.875rem;
    background-color: $white;
    color: $primary;
    border: 1px solid $primary;

    &:hover:not(:disabled) {
      background-color: $primary;
      color: $white;
    }
  }
}
</style>

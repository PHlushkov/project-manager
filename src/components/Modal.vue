<script setup lang="ts">
interface Props {
  isOpen: boolean
  title: string
  showFooter?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'submit'): void
}

const props = withDefaults(defineProps<Props>(), {
  showFooter: true,
})

const emit = defineEmits<Emits>()

const close = () => {
  emit('close')
}

const handleSubmit = () => {
  emit('submit')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="close">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
            <button class="modal-close" @click="close" aria-label="Close">
              ×
            </button>
          </div>
          <div class="modal-content">
            <slot />
          </div>
          <div v-if="showFooter" class="modal-footer">
            <slot name="footer">
              <button class="btn btn-secondary" @click="close">
                Скасувати
              </button>
              <button class="btn btn-primary" @click="handleSubmit">
                Зберегти
              </button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $shadow-overlay;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $spacing-xl;
}

.modal-container {
  background: $white;
  border-radius: $radius-lg;
  box-shadow: $shadow-md;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-xl;
  border-bottom: 1px solid $border-light;
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: $text-tertiary;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-sm;
  transition: background-color $transition-base;

  &:hover {
    background-color: $bg-tertiary;
  }
}

.modal-content {
  padding: $spacing-xl;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: $spacing-md;
  padding: $spacing-xl;
  border-top: 1px solid $border-light;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  &.btn-primary {
    background-color: $primary;
    color: $white;

    &:hover {
      background-color: $primary-hover;
    }
  }

  &.btn-secondary {
    background-color: $secondary;
    color: $text-secondary;

    &:hover {
      background-color: $secondary-hover;
    }
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}
</style>

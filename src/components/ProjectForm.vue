<script setup lang="ts">
import { reactive, watch } from 'vue'
import { projectSchema, type ProjectFormData } from '@/schemes/forms'
import type { Project } from '@/types'
import { useFormValidation } from '@/composables/useFormValidation'

interface Props {
  project?: Project | null
}

interface Emits {
  (e: 'submit', data: ProjectFormData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = reactive<ProjectFormData>({
  name: props.project?.name || '',
  description: props.project?.description || '',
  status: props.project?.status || 'active',
})

// Watch for project changes to update form data
watch(
  () => props.project,
  newProject => {
    if (newProject) {
      formData.name = newProject.name
      formData.description = newProject.description || ''
      formData.status = newProject.status
    } else {
      // Reset form when project is null (adding new project)
      formData.name = ''
      formData.description = ''
      formData.status = 'active'
    }
  },
  { immediate: true }
)

const { errors, validate: baseValidate } = useFormValidation(projectSchema)

const validate = (): boolean => {
  return baseValidate(formData)
}

const handleSubmit = () => {
  if (validate()) {
    emit('submit', { ...formData })
  }
}

// Expose validate method and formData for parent component
defineExpose({
  validate,
  handleSubmit,
  formData,
  getFormData: () => ({ ...formData }),
})
</script>

<template>
  <form @submit.prevent="handleSubmit" class="project-form">
    <div class="form-group">
      <label for="name" class="form-label">
        Назва проекту <span class="required">*</span>
      </label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        class="form-input"
        :class="{ 'form-input-error': errors.name }"
        placeholder="Введіть назву проекту"
      />
      <span v-if="errors.name" class="form-error">{{ errors.name }}</span>
    </div>

    <div class="form-group">
      <label for="description" class="form-label">Опис проекту</label>
      <textarea
        id="description"
        v-model="formData.description"
        class="form-textarea"
        rows="4"
        placeholder="Введіть опис проекту (необовʼязково)"
      />
    </div>

    <div class="form-group">
      <label for="status" class="form-label">
        Статус <span class="required">*</span>
      </label>
      <select
        id="status"
        v-model="formData.status"
        class="form-select"
        :class="{ 'form-input-error': errors.status }"
      >
        <option value="active">Активний</option>
        <option value="archived">Архівований</option>
        <option value="planned">Запланований</option>
      </select>
      <span v-if="errors.status" class="form-error">{{ errors.status }}</span>
    </div>
  </form>
</template>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.project-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>

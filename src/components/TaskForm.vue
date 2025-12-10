<script setup lang="ts">
import { reactive } from 'vue'
import { taskSchema, type TaskFormData } from '@/schemes/forms'
import { ASSIGNEES } from '@/constants/assignees'
import type { Task } from '@/types'
import { useFormValidation } from '@/composables/useFormValidation'

interface Props {
  task?: Task | null
}

interface Emits {
  (e: 'submit', data: TaskFormData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const assignees = ASSIGNEES

const getMinDate = (): string => {
  const today = new Date()
  return today.toISOString().split('T')[0]!
}

const formData = reactive<TaskFormData>({
  title: props.task?.title || '',
  assignee: props.task?.assignee || '',
  status: props.task?.status || 'todo',
  dueDate: props.task
    ? new Date(props.task.dueDate).toISOString().split('T')[0]!
    : getMinDate(),
})

const { errors, validate: baseValidate } = useFormValidation(taskSchema)

const validate = (): boolean => {
  // Convert empty string to undefined for optional assignee
  const dataToValidate = {
    ...formData,
    assignee: formData.assignee || undefined,
  }
  return baseValidate(dataToValidate)
}

const handleSubmit = () => {
  if (validate()) {
    // Convert date to ISO string format
    const submitData: TaskFormData = {
      ...formData,
      assignee: formData.assignee || undefined,
      dueDate: new Date(formData.dueDate).toISOString(),
    }
    emit('submit', submitData)
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
  <form @submit.prevent="handleSubmit" class="task-form">
    <div class="form-group">
      <label for="title" class="form-label">
        Назва завдання <span class="required">*</span>
      </label>
      <input
        id="title"
        v-model="formData.title"
        type="text"
        class="form-input"
        :class="{ 'form-input-error': errors.title }"
        placeholder="Введіть назву завдання (3-120 символів)"
      />
      <span v-if="errors.title" class="form-error">{{ errors.title }}</span>
    </div>

    <div class="form-group">
      <label for="assignee" class="form-label">Виконавець</label>
      <select id="assignee" v-model="formData.assignee" class="form-select">
        <option value="">Не призначено</option>
        <option v-for="assignee in assignees" :key="assignee" :value="assignee">
          {{ assignee }}
        </option>
      </select>
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
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <span v-if="errors.status" class="form-error">{{ errors.status }}</span>
    </div>

    <div class="form-group">
      <label for="dueDate" class="form-label">
        Термін виконання <span class="required">*</span>
      </label>
      <input
        id="dueDate"
        v-model="formData.dueDate"
        type="date"
        class="form-input"
        :class="{ 'form-input-error': errors.dueDate }"
        :min="getMinDate()"
      />
      <span v-if="errors.dueDate" class="form-error">{{ errors.dueDate }}</span>
    </div>
  </form>
</template>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.task-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>

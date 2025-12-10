# Компоненти та Composables

## Vue Components

### UI Components

#### Button (`components/Button.vue`)

Універсальна кнопка з різними варіантами стилів.

**Props:**

- `variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'edit'`
- `type?: 'button' | 'submit' | 'reset'`
- `disabled?: boolean`

**Використання:**

```vue
<Button variant="primary" @click="handleClick">
  Зберегти
</Button>
```

#### Modal (`components/Modal.vue`)

Модальне вікно для форм та діалогів.

**Props:**

- `isOpen: boolean` - чи відкрито модальне вікно
- `title: string` - заголовок модального вікна

**Slots:**

- `default` - контент модального вікна
- `footer` - футер з кнопками

**Events:**

- `@close` - закриття модального вікна
- `@submit` - відправка форми

**Використання:**

```vue
<Modal :is-open="showModal" title="Додати проект" @close="showModal = false">
  <ProjectForm />
  <template #footer>
    <Button @click="showModal = false">Скасувати</Button>
    <Button variant="primary" @click="handleSubmit">Зберегти</Button>
  </template>
</Modal>
```

#### StatusBadge (`components/StatusBadge.vue`)

Бейдж для відображення статусу проекту або завдання.

**Props:**

- `status: ProjectStatus | TaskStatus` - статус
- `type: 'project' | 'task'` - тип статусу

**Використання:**

```vue
<StatusBadge :status="project.status" type="project" />
```

#### SectionHeader (`components/SectionHeader.vue`)

Заголовок секції з кнопкою дії.

**Props:**

- `title: string` - заголовок
- `buttonText?: string` - текст кнопки

**Events:**

- `@button-click` - клік по кнопці

**Використання:**

```vue
<SectionHeader
  title="Проекти"
  button-text="Додати проект"
  @button-click="showAddModal = true"
/>
```

#### ViewModeToggle (`components/ViewModeToggle.vue`)

Перемикач між режимами перегляду (таблиця/канбан).

**Використання:**

```vue
<ViewModeToggle />
```

### Table Components

#### ProjectsTable (`components/ProjectsTable.vue`)

Таблиця проектів з сортуванням, фільтрацією та зміною ширини колонок.

**Features:**

- Сортування за всіма колонками
- Фільтрація за назвою та статусом
- Зміна ширини колонок drag-and-drop
- Редагування та видалення проектів
- Перехід на детальну сторінку по кліку

**Events:**

- `@add-project` - додавання проекту
- `@row-click` - клік по рядку
- `@edit-project` - редагування проекту

**Використання:**

```vue
<ProjectsTable
  @add-project="showAddModal = true"
  @row-click="handleRowClick"
  @edit-project="handleEdit"
/>
```

#### TasksTable (`components/TasksTable.vue`)

Таблиця завдань з сортуванням, фільтрацією та drag-and-drop.

**Props:**

- `projectId: string` - ID проекту

**Features:**

- Сортування за всіма колонками
- Фільтрація за виконавцем та статусом
- Зміна ширини колонок
- Drag-and-drop для зміни порядку
- Синхронізація з URL

**Events:**

- `@add-task` - додавання завдання

**Використання:**

```vue
<TasksTable :project-id="projectId" @add-task="showAddModal = true" />
```

### Kanban Components

#### KanbanBoard (`components/KanbanBoard.vue`)

Канбан дошка з колонками статусів.

**Props:**

- `projectId: string` - ID проекту

**Features:**

- Три колонки: To Do, In Progress, Done
- Drag-and-drop між колонками
- Фільтрація за виконавцем
- Синхронізація з таблицею

**Events:**

- `@add-task` - додавання завдання

**Використання:**

```vue
<KanbanBoard :project-id="projectId" @add-task="showAddModal = true" />
```

#### KanbanColumn (`components/KanbanColumn.vue`)

Колонка канбану для одного статусу.

**Props:**

- `status: { key: TaskStatus, label: string }` - статус колонки
- `tasks: Task[]` - завдання в колонці

**Events:**

- `@task-moved` - переміщення завдання

#### KanbanCard (`components/KanbanCard.vue`)

Картка завдання в канбані.

**Props:**

- `task: Task` - завдання

### Form Components

#### ProjectForm (`components/ProjectForm.vue`)

Форма для створення/редагування проекту.

**Props:**

- `project?: Project` - проект для редагування (опціонально)

**Methods:**

- `validate(): boolean` - валідація форми
- `getFormData(): ProjectFormData` - отримати дані форми

**Використання:**

```vue
<ProjectForm ref="formRef" :project="projectToEdit" />
```

#### TaskForm (`components/TaskForm.vue`)

Форма для створення завдання.

**Methods:**

- `validate(): boolean` - валідація форми
- `getFormData(): TaskFormData` - отримати дані форми

**Використання:**

```vue
<TaskForm ref="formRef" />
```

## Views

### ProjectsView (`views/ProjectsView.vue`)

Сторінка списку проектів.

**Features:**

- Відображення таблиці проектів
- Модальне вікно для додавання проекту
- Модальне вікно для редагування/видалення проекту
- Синхронізація сортування та фільтрації з URL

### ProjectDetailsView (`views/ProjectDetailsView.vue`)

Сторінка деталей проекту.

**Features:**

- Перемикач між режимами перегляду (таблиця/канбан)
- Відображення завдань у вибраному режимі
- Модальне вікно для додавання завдання
- Синхронізація сортування та фільтрації з URL

## Composables

### useUrlSync (`composables/useUrlSync.ts`)

Синхронізація стану store з URL параметрами.

**Parameters:**

- `store` - Pinia store з полями `sortField`, `sortDirection`, `filters`
- `sortFieldArray` - масив дозволених полів сортування
- `defaultSortField` - поле сортування за замовчуванням
- `urlPrefix` - префікс для URL параметрів (напр. 'task')
- `onSyncFromUrl` - callback для синхронізації фільтрів з URL

**Returns:**

- `syncFromURL()` - функція для синхронізації з URL

**Використання:**

```typescript
useUrlSync({
  store: projectsStore,
  sortFieldArray: PROJECT_SORT_FIELDS_ARRAY,
  defaultSortField: null,
  onSyncFromUrl: () => {
    const query = route.query
    projectsStore.setFilters({
      name: query.name as string,
      status: query.status as ProjectStatus,
    })
  },
})
```

### useFormHandler (`composables/useFormHandler.ts`)

Обробка відправки форм з валідацією.

**Returns:**

- `formRef` - ref на форму
- `handleSubmit(onSubmit)` - функція обробки відправки

**Використання:**

```typescript
const { formRef, handleSubmit } =
  useFormHandler<InstanceType<typeof ProjectForm>>()

const handleAddProject = async () => {
  const success = await handleSubmit(async formData => {
    await projectsStore.addProject(formData as any)
    showModal.value = false
  })
}
```

### useFormValidation (`composables/useFormValidation.ts`)

Валідація форм з використанням Zod схем.

**Parameters:**

- `schema: ZodSchema` - схема валідації Zod
- `options.transform` - функція трансформації даних перед валідацією

**Returns:**

- `errors` - реактивний об'єкт з помилками
- `validate(formData)` - функція валідації
- `clearErrors()` - очищення помилок

**Використання:**

```typescript
const { errors, validate, clearErrors } = useFormValidation(projectSchema)

const handleSubmit = () => {
  if (validate(formData)) {
    // Відправити форму
  }
}
```

### useColumnResize (`composables/useColumnResize.ts`)

Управління шириною колонок таблиць.

**Parameters:**

- `defaultWidths: Record<string, number>` - ширини колонок за замовчуванням
- `tableType: 'projects' | 'tasks'` - тип таблиці

**Returns:**

- `columnWidths` - реактивний об'єкт з ширинами колонок
- `startResize(e, columnKey)` - функція початку зміни розміру

**Використання:**

```typescript
const { columnWidths, startResize } = useColumnResize({
  defaultWidths: { id: 80, name: 200 },
  tableType: 'projects',
})
```

## Helpers

### date.ts

Функції для роботи з датами.

**Functions:**

- `formatDate(dateString: string): string` - форматування дати в українському форматі (DD.MM.YYYY)

**Використання:**

```typescript
import { formatDate } from '@/helpers/date'

const formatted = formatDate('2025-12-10') // "10.12.2025"
```

### status.ts

Функції для отримання лейблів статусів.

**Functions:**

- `getProjectStatusLabel(status: ProjectStatus): string` - лейбл статусу проекту
- `getTaskStatusLabel(status: TaskStatus): string` - лейбл статусу завдання

**Використання:**

```typescript
import { getProjectStatusLabel } from '@/helpers/status'

const label = getProjectStatusLabel('active') // "Активний"
```

### toast.ts

Функції для відображення toast сповіщень.

**Functions:**

- `showToast.success(message: string)` - успішне сповіщення
- `showToast.error(message: string)` - сповіщення про помилку
- `showToast.warning(message: string)` - попередження
- `showToast.info(message: string)` - інформаційне сповіщення

**Використання:**

```typescript
import { showToast } from '@/helpers/toast'

showToast.success('Проект успішно створено')
```

## Константи

### assignees.ts

Список доступних виконавців завдань.

**Export:**

- `ASSIGNEES: readonly string[]` - масив виконавців
- `Assignee` - тип виконавця

### tableConfig.ts

Конфігурація таблиць (якщо використовується).

## Схеми валідації

### project.ts

Zod схема валідації проекту.

**Schema:**

```typescript
projectSchema = z.object({
  name: z.string().min(1, 'Назва проекту обовʼязкова'),
  description: z.string().optional(),
  status: z.enum(['active', 'archived', 'planned']),
})
```

### task.ts

Zod схема валідації завдання.

**Schema:**

```typescript
taskSchema = z.object({
  title: z.string().min(3).max(120),
  assignee: z
    .enum([...ASSIGNEES])
    .optional()
    .or(z.literal('')),
  status: z.enum(['todo', 'in_progress', 'done']),
  dueDate: z.string().refine(
    date => {
      const selectedDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate >= today
    },
    { message: 'Дата має бути не раніше сьогодні' }
  ),
})
```

## Приклади використання

### Створення нового компонента

```vue
<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/Button.vue'

const count = ref(0)

const increment = () => {
  count.value++
}
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <Button @click="increment">Increment</Button>
  </div>
</template>
```

### Використання composable

```vue
<script setup lang="ts">
import { useUrlSync } from '@/composables/useUrlSync'
import { useProjectsStore } from '@/store/projects'

const projectsStore = useProjectsStore()

useUrlSync({
  store: projectsStore,
  sortFieldArray: PROJECT_SORT_FIELDS_ARRAY,
  defaultSortField: null,
})
</script>
```

### Використання helper

```vue
<script setup lang="ts">
import { formatDate } from '@/helpers/date'

const formatted = formatDate('2025-12-10')
</script>

<template>
  <p>Date: {{ formatted }}</p>
</template>
```

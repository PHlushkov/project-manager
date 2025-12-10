# Гайд для розробників

## Початок роботи

### Встановлення

1. Клонуйте репозиторій
2. Встановіть залежності: `npm install`
3. Запустіть проект: `npm run start`

### Структура проекту

Детальна структура описана в [README.md](../README.md#структура-проєкту).

## Процес розробки

### Створення нового компонента

1. Створіть файл в `src/components/`
2. Використовуйте Composition API з `<script setup>`
3. Додайте TypeScript типи
4. Додайте стилі в `<style scoped lang="scss">`

**Приклад:**

```vue
<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title: string
}

const props = defineProps<Props>()
const count = ref(0)
</script>

<template>
  <div class="my-component">
    <h2>{{ title }}</h2>
    <p>Count: {{ count }}</p>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.my-component {
  padding: $spacing-md;
}
</style>
```

### Створення нового composable

1. Створіть файл в `src/composables/`
2. Експортуйте функцію з префіксом `use`
3. Повертайте реактивний API

**Приклад:**

```typescript
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  const increment = () => {
    count.value++
  }

  const double = computed(() => count.value * 2)

  return {
    count,
    increment,
    double,
  }
}
```

### Створення нового store

1. Створіть файл в `src/store/`
2. Використовуйте `defineStore` з Pinia
3. Визначте state, getters, actions
4. Додайте `persist: true` для збереження стану

**Приклад:**

```typescript
import { defineStore } from 'pinia'

interface MyState {
  items: string[]
}

export const useMyStore = defineStore('my', {
  state: (): MyState => ({
    items: [],
  }),

  getters: {
    itemCount: state => state.items.length,
  },

  actions: {
    addItem(item: string) {
      this.items.push(item)
    },
  },

  persist: true,
})
```

### Додавання нового маршруту

1. Відкрийте `src/router/index.ts`
2. Додайте новий route в масив `routes`

**Приклад:**

```typescript
import NewView from '@/views/NewView.vue'

const routes: RouteRecordRaw[] = [
  // ... existing routes
  {
    path: '/new',
    name: 'new',
    component: NewView,
  },
]
```

## Стайл-гайд

### TypeScript

- Використовуйте строгу типізацію
- Уникайте `any`, використовуйте `unknown` або конкретні типи
- Використовуйте type guards для перевірки типів

**Добре:**

```typescript
interface User {
  id: string
  name: string
}

function processUser(user: User) {
  // ...
}
```

**Погано:**

```typescript
function processUser(user: any) {
  // ...
}
```

### Vue Components

- Використовуйте `<script setup>` для всіх компонентів
- Групуйте imports: Vue, сторонні бібліотеки, внутрішні модулі
- Використовуйте `defineProps` та `defineEmits` з типами

**Добре:**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '@/store'

interface Props {
  title: string
}

defineProps<Props>()
</script>
```

### SCSS

- Використовуйте `@use` замість `@import`
- Використовуйте змінні з `variables.scss`
- Використовуйте mixins з `mixins.scss`
- Додавайте `scoped` для компонентних стилів

**Добре:**

```scss
@use '@/styles/variables.scss' as *;

.my-component {
  padding: $spacing-md;
  color: $text-primary;
}
```

### Найменування

- **Компоненти**: PascalCase (`MyComponent.vue`)
- **Composables**: camelCase з префіксом `use` (`useMyComposable.ts`)
- **Stores**: camelCase (`useMyStore.ts`)
- **Helpers**: camelCase (`myHelper.ts`)
- **Types**: PascalCase (`MyType`)

## Тестування

### Запуск тестів

```bash
npm test
```

### Написання тестів

Використовуйте Vitest для unit тестів:

```typescript
import { describe, it, expect } from 'vitest'
import { formatDate } from '@/helpers/date'

describe('formatDate', () => {
  it('formats date correctly', () => {
    expect(formatDate('2025-12-10')).toBe('10.12.2025')
  })
})
```

## Форматування коду

### Prettier

Проект використовує Prettier для форматування.

**Форматування:**

```bash
npm run format
```

**Перевірка:**

```bash
npm run format:check
```

### ESLint

Налаштуйте ESLint в вашому редакторі для автоматичної перевірки.

## Git Workflow

### Створення комітів

1. Створіть feature branch: `git checkout -b feature/my-feature`
2. Зробіть зміни та комітьте: `git commit -m "feat: add new feature"`
3. Push: `git push origin feature/my-feature`
4. Створіть Pull Request

### Commit Messages

Використовуйте conventional commits:

- `feat:` - нова функціональність
- `fix:` - виправлення помилки
- `docs:` - зміни в документації
- `style:` - форматування коду
- `refactor:` - рефакторинг
- `test:` - додавання тестів
- `chore:` - зміни в конфігурації

## Деплой

### Локальна збірка

```bash
npm run build
```

Зібраний проект в `dist/`

### Vercel

1. Підключіть репозиторій до Vercel
2. Налаштуйте build command: `npm run build`
3. Налаштуйте output directory: `dist`
4. Додайте змінні оточення (якщо потрібно)

### GitHub Pages

1. Встановіть `gh-pages`: `npm install -D gh-pages`
2. Додайте script в `package.json`:

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. Запустіть: `npm run deploy`

## Налагодження

### Vue DevTools

Встановіть Vue DevTools для налагодження:

- Перегляд компонентів
- Перегляд store стану
- Перегляд Vue Router

### Console Logging

Використовуйте `console.log` для налагодження (видаліть перед комітом).

### Breakpoints

Використовуйте breakpoints в браузері DevTools для налагодження.

## Поширені проблеми

### Помилка типів TypeScript

**Проблема:** TypeScript не знає тип компонента

**Рішення:** Додайте `@ts-expect-error` з коментарем:

```typescript
// @ts-expect-error - component is used in template
const { formRef } = useFormHandler<InstanceType<typeof MyForm>>()
```

### Помилка імпорту

**Проблема:** Cannot find module '@/...'

**Рішення:** Перевірте `vite.config.ts` та `tsconfig.json` - alias `@` має вказувати на `src/`

### Стилі не застосовуються

**Проблема:** Стилі компонента не відображаються

**Рішення:**

- Перевірте `scoped` атрибут
- Перевірте імпорти SCSS змінних
- Перевірте шляхи до файлів стилів

### Store не оновлюється

**Проблема:** Зміни в store не відображаються

**Рішення:**

- Перевірте реактивність (використовуйте `computed` для getters)
- Перевірте, чи правильно викликається action
- Перевірте консоль на помилки

## Корисні ресурси

### Документація

- [Vue.js 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Zod](https://zod.dev/)

### Інструменти

- [Vue DevTools](https://devtools.vuejs.org/)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [JSON Server](https://github.com/typicode/json-server)

## Контрибуція

### Перед додаванням нового функціоналу

1. Перевірте існуючі issues та PR
2. Створіть issue для обговорення
3. Створіть feature branch
4. Додайте тести (якщо потрібно)
5. Оновіть документацію
6. Створіть Pull Request

### Code Review

Всі зміни мають пройти code review перед мерджем.

### Тестування

Перевірте, що:

- Проект запускається без помилок
- Всі функції працюють коректно
- Немає помилок TypeScript
- Немає помилок ESLint
- Стилі відображаються правильно

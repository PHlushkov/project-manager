# Project Manager - SPA для управління проектами та завданнями

SPA-застосунок для управління проектами та завданнями, розроблений з використанням Vue.js 3, TypeScript, Pinia, Axios.

## Функціонал

### Таблиця проектів

- Відображення всіх проектів з колонками: ID, Назва, Кількість завдань, Статус, Дата створення
- Сортування за будь-якою колонкою з синхронізацією з URL
- Фільтрація за назвою та статусом з синхронізацією з URL
- Зміна ширини колонок шляхом перетягування (збереження в localStorage)
- Додавання нового проекту через модальне вікно
- Редагування та видалення проекту через модальне вікно
- Перехід на детальну сторінку проекту по кліку на рядок

### Сторінка проекту

- Два режими відображення завдань:
  - **Таблиця** - з можливістю сортування, фільтрації та drag-and-drop для зміни порядку
  - **Канбан** - з колонками статусів (To Do, In Progress, Done) та drag-and-drop між колонками
- Перемикання між режимами зі збереженням вибору (localStorage)
- Додавання завдань через модальне вікно з валідацією
- Синхронізація даних між режимами
- Сортування та фільтрація з синхронізацією з URL

### Валідація форм

- Проект: назва (обов'язкова), опис (опціональний), статус
- Завдання: назва (3-120 символів), виконавець (опціональний), статус, термін виконання (≥ сьогодні)

### Збереження стану

- Автоматичне збереження стану між перезавантаженнями через LocalStorage (Pinia PersistedState)
- Збереження налаштувань таблиць (сортування, фільтрація, ширина колонок)
- Збереження обраного режиму перегляду
- Синхронізація стану сортування та фільтрації з URL параметрами

## Технології

- **Vue.js 3** (Composition API) - основний фреймворк
- **TypeScript** - типізація коду
- **Pinia** - менеджер стану з персистентністю
- **Vue Router** - роутинг та навігація
- **Axios** - HTTP запити до API
- **SortableJS** - drag-and-drop функціональність
- **vee-validate + zod** - валідація форм
- **SCSS** - стилізація з модульною структурою
- **json-server** - мок-API для розробки
- **vue-toast-notification** - сповіщення користувача

## Встановлення та запуск

### Передумови

- Node.js 18+
- npm або yarn

### Крок 1: Клонування репозиторію

```bash
git clone <repository-url>
cd project-manager
```

### Крок 2: Встановлення залежностей

```bash
npm install
```

### Крок 2.5: Налаштування Environment Variables (опціонально)

Для локальної розробки environment variables не потрібні - використовується json-server.

Якщо потрібно протестувати Supabase локально, створіть `.env.local` файл:

```env
VITE_SUPABASE_URL=https://npjjjzzmwdkfpqpycbtz.supabase.co
VITE_SUPABASE_ANON_KEY=
```

**Примітка:** `.env.local` вже додано до `.gitignore` і не буде закомічений.

### Крок 3: Запуск проекту

Для одночасного запуску фронтенду та мок-сервера використовуйте:

```bash
npm run start
```

Ця команда запустить:

- Vite dev server на `http://localhost:5173`
- json-server на `http://localhost:3001`

### Альтернативний запуск (окремо)

Якщо потрібно запускати окремо:

**Термінал 1 - мок-сервер:**

```bash
npm run mock
```

**Термінал 2 - фронтенд:**

```bash
npm run dev
```

### Крок 4: Збірка для продакшену

```bash
npm run build
```

Зібраний проект буде в директорії `dist/`

### Крок 5: Перегляд зібраного проекту

```bash
npm run preview
```

## Структура проєкту

```
project-manager/
├── db.json                 # Mock база даних для json-server
├── package.json            # Залежності та скрипти
├── vite.config.ts          # Конфігурація Vite
├── tsconfig.json           # Конфігурація TypeScript
├── index.html              # Точка входу HTML
│
└── src/
    ├── main.ts             # Точка входу додатку
    ├── App.vue             # Кореневий компонент
    │
    ├── api/                 # API клієнт та конфігурація
    │   ├── index.ts        # Axios instance з interceptors
    │   └── constants.ts    # Константи для сортування та фільтрації
    │
    ├── components/          # Vue компоненти
    │   ├── Button.vue      # Універсальна кнопка
    │   ├── Modal.vue       # Модальне вікно
    │   ├── ProjectsTable.vue    # Таблиця проектів
    │   ├── TasksTable.vue       # Таблиця завдань
    │   ├── KanbanBoard.vue      # Канбан дошка
    │   ├── KanbanColumn.vue     # Колонка канбану
    │   ├── KanbanCard.vue       # Картка канбану
    │   ├── ProjectForm.vue      # Форма проекту
    │   ├── TaskForm.vue         # Форма завдання
    │   ├── StatusBadge.vue      # Бейдж статусу
    │   ├── SectionHeader.vue    # Заголовок секції
    │   └── ViewModeToggle.vue   # Перемикач режимів перегляду
    │
    ├── composables/         # Vue composables (переиспользуемая логіка)
    │   ├── useUrlSync.ts   # Синхронізація стану з URL
    │   ├── useFormHandler.ts    # Обробка форм
    │   ├── useFormValidation.ts # Валідація форм
    │   └── useColumnResize.ts   # Зміна ширини колонок
    │
    ├── config/              # Конфігурація додатку
    │   └── config.ts        # Константи маршрутів та API
    │
    ├── constants/           # Константи
    │   ├── assignees.ts    # Список виконавців
    │   └── tableConfig.ts  # Конфігурація таблиць
    │
    ├── helpers/             # Допоміжні функції
    │   ├── date.ts         # Форматування дат
    │   ├── status.ts       # Лейбли статусів
    │   └── toast.ts        # Toast сповіщення
    │
    ├── router/              # Роутинг
    │   └── index.ts        # Конфігурація маршрутів
    │
    ├── schemes/             # Схеми валідації (Zod)
    │   └── forms/
    │       ├── project.ts  # Схема валідації проекту
    │       └── task.ts     # Схема валідації завдання
    │
    ├── store/               # Pinia stores
    │   ├── index.ts        # Ініціалізація Pinia з плагіном
    │   ├── projects.ts     # Store проектів
    │   ├── tasks.ts        # Store завдань
    │   └── ui.ts           # Store UI стану
    │
    ├── styles/              # SCSS стилі
    │   ├── main.scss       # Головні стилі
    │   ├── variables.scss  # SCSS змінні
    │   ├── mixins.scss     # SCSS mixins
    │   └── components.scss # Глобальні стилі компонентів
    │
    ├── types/               # TypeScript типи
    │   ├── index.ts        # Експорт типів
    │   ├── types.ts        # Основні типи (Project, Task)
    │   └── enums.ts        # Enum типи
    │
    └── views/               # Vue views (сторінки)
        ├── ProjectsView.vue      # Сторінка списку проектів
        └── ProjectDetailsView.vue # Сторінка деталей проекту
```

## Ключові особливості архітектури

### DRY принцип (Don't Repeat Yourself)

Проект використовує composables та helpers для уникнення дублювання коду:

- **Composables**: `useUrlSync`, `useFormHandler`, `useColumnResize`, `useFormValidation`
- **Helpers**: `formatDate`, `getProjectStatusLabel`, `getTaskStatusLabel`
- **Глобальні стилі**: спільні стилі для таблиць, форм, кнопок в `components.scss`

### URL синхронізація

Стани сортування та фільтрації синхронізуються з URL параметрами:

- Проекти: `?sort=name&order=asc&status=active`
- Завдання: `?taskSort=status&taskOrder=desc&taskStatus=todo`

Це дозволяє:

- Зберігати стан при перезавантаженні сторінки
- Ділитися посиланнями з конкретними налаштуваннями
- Використовувати кнопки "Назад/Вперед" браузера

### Персистентність даних

Використовується `pinia-plugin-persistedstate` для автоматичного збереження:

- Стану проектів та завдань
- Налаштувань UI (режим перегляду, ширина колонок)
- Стану сортування та фільтрації

### Типізація

Повна типізація TypeScript:

- Типи для всіх сутностей (Project, Task)
- Типи для форм (ProjectFormData, TaskFormData)
- Типи для store state та actions
- Типи для composables

### Валідація форм

Використання Zod для типобезпечної валідації:

- Схеми валідації в `schemes/forms/`
- Інтеграція з Vee-Validate
- Автоматична генерація TypeScript типів з схем

## API Endpoints

Проєкт використовує **json-server** для локальної розробки та **Supabase REST API** для продакшену.

### Локальна розробка (json-server)

**Projects:**

- `GET /projects` - отримати всі проекти
- `GET /projects/:id` - отримати проект за ID
- `POST /projects` - створити проект
- `PUT /projects/:id` - оновити проект
- `DELETE /projects/:id` - видалити проект

**Tasks:**

- `GET /tasks` - отримати всі завдання
- `GET /tasks?projectId=:id` - отримати завдання проекту
- `GET /tasks/:id` - отримати завдання за ID
- `POST /tasks` - створити завдання
- `PUT /tasks/:id` - оновити завдання
- `DELETE /tasks/:id` - видалити завдання

### Продакшен (Supabase REST API)

**Projects:**

- `GET /rest/v1/projects?select=*&order=createdAt.desc` - отримати всі проекти
- `GET /rest/v1/projects?id=eq.{id}&select=*` - отримати проект за ID
- `POST /rest/v1/projects` - створити проект
- `PATCH /rest/v1/projects?id=eq.{id}` - оновити проект
- `DELETE /rest/v1/projects?id=eq.{id}` - видалити проект

**Tasks:**

- `GET /rest/v1/tasks?projectId=eq.{id}&select=*&order=order.asc` - отримати завдання проекту
- `POST /rest/v1/tasks` - створити завдання
- `PATCH /rest/v1/tasks?id=eq.{id}` - оновити завдання
- `DELETE /rest/v1/tasks?id=eq.{id}` - видалити завдання

**Примітка:** Перемикання між json-server та Supabase відбувається автоматично на основі environment variables (`VITE_SUPABASE_URL`).

## Розгортання

### Vercel

1. Підключіть репозиторій до Vercel
2. Налаштуйте змінні оточення в Vercel Dashboard → Settings → Environment Variables:
   - `VITE_SUPABASE_URL` = `https://npjjjzzmwdkfpqpycbtz.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` =
3. Встановіть змінні для: **Production** (або Production, Preview, Development)
4. Vercel автоматично розгорне додаток

**Примітка:** На продакшені використовується Supabase REST API через axios. Локально продовжує працювати json-server.

#### Налаштування Supabase для продакшену

1. Переконайтеся, що в Supabase створені таблиці `projects` та `tasks` (див. документацію Supabase)
2. Додайте environment variables в Vercel (див. вище)
3. Переконайтеся, що RLS (Row Level Security) налаштований правильно або вимкнений для демо

### GitHub Pages

1. Виконайте збірку: `npm run build`
2. Налаштуйте GitHub Actions для автоматичного деплою
3. Або використайте `gh-pages` пакет для ручного деплою

**Примітка:**

- На продакшені (Vercel) використовується **Supabase REST API** через axios
- Локально продовжує працювати **json-server** (мок-API)
- Перемикання між ними відбувається автоматично на основі environment variables

## Розробка

### Доступні скрипти

```bash
# Запуск dev сервера та мок-API одночасно
npm run start

# Запуск тільки dev сервера
npm run dev

# Запуск тільки мок-сервера
npm run mock

# Збірка для продакшену
npm run build

# Перегляд зібраного проекту
npm run preview

# Форматування коду
npm run format

# Перевірка форматування
npm run format:check
```

### Додаткова документація

Детальна документація доступна в директорії `docs/`:

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Архітектура проекту
- [COMPONENTS.md](docs/COMPONENTS.md) - Опис компонентів та composables
- [API.md](docs/API.md) - Документація API
- [DEVELOPMENT.md](docs/DEVELOPMENT.md) - Гайд для розробників

## Посилання на розгорнуту версію

[Додати посилання після розгортання]

## Ліцензія

MIT

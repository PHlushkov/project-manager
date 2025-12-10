# API Документація

## Огляд

Проект використовує `json-server` для мок-API під час розробки. Всі HTTP запити виконуються через Axios instance, налаштований в `src/api/index.ts`.

## API Клієнт

### Конфігурація

**Файл:** `src/api/index.ts`

Axios instance налаштований з:

- `baseURL`: `http://localhost:3001` (або з env змінної `VITE_API_BASE_URL`)
- `timeout`: 10000ms (або з env змінної `VITE_API_TIMEOUT`)
- `headers`: `Content-Type: application/json`, `Accept: application/json`

### Interceptors

#### Request Interceptor

Обробляє всі вихідні запити (наразі без додаткової логіки).

#### Response Interceptor

Обробляє помилки відповідей:

- **401** - Unauthorized access
- **403** - Forbidden access
- **404** - Resource not found
- **500** - Server error
- **Network errors** - No response received

## Endpoints

### Projects

#### GET /projects

Отримати всі проекти.

**Response:**

```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "status": "active" | "archived" | "planned",
    "createdAt": "ISO 8601 date string"
  }
]
```

**Використання:**

```typescript
const projects = await axios.get('/projects')
```

#### GET /projects/:id

Отримати проект за ID.

**Response:**

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "status": "active" | "archived" | "planned",
  "createdAt": "ISO 8601 date string"
}
```

**Використання:**

```typescript
const project = await axios.get(`/projects/${id}`)
```

#### POST /projects

Створити новий проект.

**Request Body:**

```json
{
  "name": "string",
  "description": "string",
  "status": "active" | "archived" | "planned"
}
```

**Response:**

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "status": "active" | "archived" | "planned",
  "createdAt": "ISO 8601 date string"
}
```

**Використання:**

```typescript
const newProject = await axios.post('/projects', {
  name: 'Новий проект',
  description: 'Опис проекту',
  status: 'active',
})
```

#### PUT /projects/:id

Оновити проект.

**Request Body:**

```json
{
  "name": "string",
  "description": "string",
  "status": "active" | "archived" | "planned"
}
```

**Response:**

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "status": "active" | "archived" | "planned",
  "createdAt": "ISO 8601 date string"
}
```

**Використання:**

```typescript
const updatedProject = await axios.put(`/projects/${id}`, {
  name: 'Оновлена назва',
  status: 'archived',
})
```

#### DELETE /projects/:id

Видалити проект.

**Response:** 200 OK (без body)

**Використання:**

```typescript
await axios.delete(`/projects/${id}`)
```

### Tasks

#### GET /tasks

Отримати всі завдання.

**Query Parameters:**

- `projectId` (optional) - фільтр за ID проекту

**Response:**

```json
[
  {
    "id": "string",
    "projectId": "string",
    "title": "string",
    "assignee": "string",
    "status": "todo" | "in_progress" | "done",
    "dueDate": "ISO 8601 date string",
    "order": number
  }
]
```

**Використання:**

```typescript
// Всі завдання
const allTasks = await axios.get('/tasks')

// Завдання конкретного проекту
const projectTasks = await axios.get('/tasks?projectId=123')
```

#### GET /tasks/:id

Отримати завдання за ID.

**Response:**

```json
{
  "id": "string",
  "projectId": "string",
  "title": "string",
  "assignee": "string",
  "status": "todo" | "in_progress" | "done",
  "dueDate": "ISO 8601 date string",
  "order": number
}
```

**Використання:**

```typescript
const task = await axios.get(`/tasks/${id}`)
```

#### POST /tasks

Створити нове завдання.

**Request Body:**

```json
{
  "projectId": "string",
  "title": "string",
  "assignee": "string",
  "status": "todo" | "in_progress" | "done",
  "dueDate": "ISO 8601 date string",
  "order": number
}
```

**Response:**

```json
{
  "id": "string",
  "projectId": "string",
  "title": "string",
  "assignee": "string",
  "status": "todo" | "in_progress" | "done",
  "dueDate": "ISO 8601 date string",
  "order": number
}
```

**Використання:**

```typescript
const newTask = await axios.post('/tasks', {
  projectId: '123',
  title: 'Нове завдання',
  assignee: 'John Doe',
  status: 'todo',
  dueDate: '2025-12-20',
  order: 1,
})
```

#### PUT /tasks/:id

Оновити завдання.

**Request Body:**

```json
{
  "projectId": "string",
  "title": "string",
  "assignee": "string",
  "status": "todo" | "in_progress" | "done",
  "dueDate": "ISO 8601 date string",
  "order": number
}
```

**Response:**

```json
{
  "id": "string",
  "projectId": "string",
  "title": "string",
  "assignee": "string",
  "status": "todo" | "in_progress" | "done",
  "dueDate": "ISO 8601 date string",
  "order": number
}
```

**Використання:**

```typescript
const updatedTask = await axios.put(`/tasks/${id}`, {
  status: 'done',
  order: 2,
})
```

#### DELETE /tasks/:id

Видалити завдання.

**Response:** 200 OK (без body)

**Використання:**

```typescript
await axios.delete(`/tasks/${id}`)
```

## Типи даних

### Project

```typescript
interface Project {
  id: string
  name: string
  description?: string
  status: 'active' | 'archived' | 'planned'
  createdAt: string // ISO 8601 format
}
```

### Task

```typescript
interface Task {
  id: string
  projectId: string
  title: string
  assignee?: string
  status: 'todo' | 'in_progress' | 'done'
  dueDate: string // ISO 8601 format (YYYY-MM-DD)
  order: number
}
```

## Обробка помилок

### Структура помилки

```typescript
interface AxiosError {
  response?: {
    status: number
    data: any
  }
  request?: any
  message: string
}
```

### Приклади обробки

```typescript
try {
  const project = await axios.get(`/projects/${id}`)
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with error
      switch (error.response.status) {
        case 404:
          console.error('Проект не знайдено')
          break
        case 500:
          console.error('Помилка сервера')
          break
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Немає відповіді від сервера')
    }
  }
}
```

## JSON Server

### Конфігурація

**Файл:** `db.json`

Структура бази даних:

```json
{
  "projects": [...],
  "tasks": [...]
}
```

### Запуск

```bash
npm run mock
```

Сервер запускається на `http://localhost:3001`

### Особливості

- Автоматичне створення ID для нових записів
- Підтримка query параметрів для фільтрації
- RESTful API endpoints
- Автоматичне збереження змін в `db.json`

### Query параметри

JSON Server підтримує:

- `_sort` - сортування
- `_order` - напрямок сортування (asc/desc)
- `_limit` - обмеження кількості результатів
- `_page` - пагінація
- Фільтрація за полями: `?status=active`

**Приклад:**

```typescript
// Сортування
const sorted = await axios.get('/projects?_sort=name&_order=asc')

// Фільтрація
const filtered = await axios.get('/projects?status=active')

// Комбінація
const result = await axios.get(
  '/projects?status=active&_sort=createdAt&_order=desc'
)
```

## Змінні оточення

### Розробка

В `.env` файлі (якщо потрібно):

```
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=10000
```

### Продакшен

Налаштуйте змінні оточення на хостингу:

- `VITE_API_BASE_URL` - URL продакшен API
- `VITE_API_TIMEOUT` - таймаут запитів (мс)

## Інтеграція з Store

### Projects Store

```typescript
// Fetch all projects
async fetchAll() {
  const response = await axios.get('/projects')
  this.projects = response.data
}

// Add project
async addProject(project: Omit<Project, 'id' | 'createdAt'>) {
  const response = await axios.post('/projects', {
    ...project,
    createdAt: new Date().toISOString()
  })
  this.projects.push(response.data)
}

// Update project
async updateProject(id: string, updates: Partial<Project>) {
  const response = await axios.put(`/projects/${id}`, updates)
  const index = this.projects.findIndex(p => p.id === id)
  if (index !== -1) {
    this.projects[index] = response.data
  }
}

// Delete project
async deleteProject(id: string) {
  await axios.delete(`/projects/${id}`)
  this.projects = this.projects.filter(p => p.id !== id)
}
```

### Tasks Store

```typescript
// Fetch tasks by project
async fetchByProjectId(projectId: string) {
  const response = await axios.get(`/tasks?projectId=${projectId}`)
  this.tasks = response.data
}

// Create task
async createTask(task: Omit<Task, 'id'>) {
  const response = await axios.post('/tasks', task)
  this.tasks.push(response.data)
}

// Update task
async updateTask(id: string, updates: Partial<Task>) {
  const response = await axios.put(`/tasks/${id}`, updates)
  const index = this.tasks.findIndex(t => t.id === id)
  if (index !== -1) {
    this.tasks[index] = response.data
  }
}

// Delete task
async deleteTask(id: string) {
  await axios.delete(`/tasks/${id}`)
  this.tasks = this.tasks.filter(t => t.id !== id)
}
```

## Майбутні покращення

### Реальний API

При переході на реальний API:

1. Оновіть `baseURL` в конфігурації
2. Додайте автентифікацію (JWT токени)
3. Додайте refresh token логіку
4. Додайте retry логіку для failed запитів
5. Додайте request/response трансформації

### Оптимізація

- Кешування запитів
- Debounce для пошуку
- Pagination для великих списків
- Lazy loading для завдань

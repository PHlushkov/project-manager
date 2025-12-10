import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import ProjectsView from '@/views/ProjectsView.vue'
import ProjectDetailsView from '@/views/ProjectDetailsView.vue'
import { CONFIG_INNER } from '@/config/config'

const routes: RouteRecordRaw[] = [
  { path: CONFIG_INNER.LINKS.HOME, name: 'projects', component: ProjectsView },
  {
    path: CONFIG_INNER.LINKS.PROJECT_DETAILS_BASE,
    name: 'project-details',
    component: ProjectDetailsView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

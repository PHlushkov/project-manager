<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectsStore } from '@/store/projects'
import ProjectsTable from '@/components/ProjectsTable.vue'
import Modal from '@/components/Modal.vue'
import ProjectForm from '@/components/ProjectForm.vue'
import Button from '@/components/Button.vue'
import type { Project, ProjectStatus } from '@/types'
import { PROJECT_SORT_FIELDS_ARRAY } from '@/api/constants'
import { useUrlSync } from '@/composables/useUrlSync'
import { useFormHandler } from '@/composables/useFormHandler'

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()

const showAddProjectModal = ref(false)
const showEditProjectModal = ref(false)
const currentProjectToEdit = ref<Project | null>(null)

// @ts-expect-error - projectFormRef is used in template via ref="projectFormRef"
const { formRef: projectFormRef, handleSubmit: handleAddProjectSubmit } =
  useFormHandler<InstanceType<typeof ProjectForm>>()

// @ts-expect-error - editProjectFormRef is used in template via ref="editProjectFormRef"
const { formRef: editProjectFormRef, handleSubmit: handleEditProjectSubmit } =
  useFormHandler<InstanceType<typeof ProjectForm>>()

// Sync URL query params with store
useUrlSync({
  store: projectsStore,
  sortFieldArray: PROJECT_SORT_FIELDS_ARRAY,
  defaultSortField: null,
  onSyncFromUrl: () => {
    const query = route.query
    const filters: { name?: string; status?: ProjectStatus | null } = {}
    if (query.name && typeof query.name === 'string') {
      filters.name = query.name
    } else {
      filters.name = undefined
    }

    if (query.status && typeof query.status === 'string') {
      if (['active', 'archived', 'planned'].includes(query.status)) {
        filters.status = query.status as ProjectStatus
      }
    } else {
      filters.status = null
    }

    projectsStore.setFilters(filters)
  },
})

const handleRowClick = (projectId: string) => {
  router.push(`/project/${projectId}`)
}

const handleAddProject = async () => {
  const success = await handleAddProjectSubmit(async formData => {
    await projectsStore.addProject(formData as any)
    showAddProjectModal.value = false
  })
  if (!success) {
    console.error('Failed to add project')
  }
}

const handleEditProject = (projectId: string) => {
  const project = projectsStore.getProjectById(projectId)
  if (project) {
    currentProjectToEdit.value = { ...project }
    showEditProjectModal.value = true
  }
}

const handleSaveProject = async () => {
  if (!currentProjectToEdit.value) return

  const success = await handleEditProjectSubmit(async formData => {
    await projectsStore.updateProject(
      currentProjectToEdit.value!.id,
      formData as any
    )
    showEditProjectModal.value = false
    currentProjectToEdit.value = null
  })
  if (!success) {
    console.error('Failed to update project')
  }
}

const handleDeleteProject = async () => {
  if (!currentProjectToEdit.value) return

  if (confirm('Ви впевнені, що хочете видалити цей проект?')) {
    try {
      await projectsStore.deleteProject(currentProjectToEdit.value.id)
      showEditProjectModal.value = false
      currentProjectToEdit.value = null
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }
}
</script>

<template>
  <div class="projects-view">
    <ProjectsTable
      @add-project="showAddProjectModal = true"
      @row-click="handleRowClick"
      @edit-project="handleEditProject"
    />

    <Modal
      v-if="showAddProjectModal"
      :is-open="showAddProjectModal"
      title="Додати проект"
      @close="showAddProjectModal = false"
      @submit="handleAddProject"
    >
      <ProjectForm ref="projectFormRef" />
      <template #footer>
        <Button variant="secondary" @click="showAddProjectModal = false">
          Скасувати
        </Button>
        <Button variant="primary" @click="handleAddProject"> Зберегти </Button>
      </template>
    </Modal>

    <Modal
      v-if="showEditProjectModal"
      :is-open="showEditProjectModal"
      title="Редагувати проект"
      @close="showEditProjectModal = false"
      @submit="handleSaveProject"
    >
      <ProjectForm :project="currentProjectToEdit" ref="editProjectFormRef" />
      <template #footer>
        <Button variant="danger" @click="handleDeleteProject">
          Видалити
        </Button>
        <Button variant="secondary" @click="showEditProjectModal = false">
          Скасувати
        </Button>
        <Button variant="primary" @click="handleSaveProject"> Зберегти </Button>
      </template>
    </Modal>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.projects-view {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}
</style>

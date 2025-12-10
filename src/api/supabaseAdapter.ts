import { supabase } from './supabase'
import type { Project, Task } from '@/types'

// Projects API
export const projectsAPI = {
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) throw error

    return data.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description || undefined,
      status: p.status,
      createdAt: p.createdAt || p.created_at,
    }))
  },

  async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      status: data.status,
      createdAt: data.createdAt || data.created_at,
    }
  },

  async create(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: project.name,
        description: project.description || null,
        status: project.status,
        createdAt: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      status: data.status,
      createdAt: data.createdAt || data.created_at,
    }
  },

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update({
        name: updates.name,
        description: updates.description,
        status: updates.status,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      status: data.status,
      createdAt: data.createdAt || data.created_at,
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('projects').delete().eq('id', id)

    if (error) throw error
  },
}

// Tasks API
export const tasksAPI = {
  async getByProjectId(projectId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('projectId', projectId)
      .order('order', { ascending: true })

    if (error) throw error

    return data.map(t => ({
      id: t.id,
      projectId: t.projectId,
      title: t.title,
      assignee: t.assignee || undefined,
      status: t.status,
      dueDate: t.dueDate,
      order: t.order,
    }))
  },

  async create(task: Omit<Task, 'id'>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        projectId: task.projectId,
        title: task.title,
        assignee: task.assignee || null,
        status: task.status,
        dueDate: task.dueDate,
        order: task.order,
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      projectId: data.projectId,
      title: data.title,
      assignee: data.assignee || undefined,
      status: data.status,
      dueDate: data.dueDate,
      order: data.order,
    }
  },

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        projectId: updates.projectId,
        title: updates.title,
        assignee: updates.assignee,
        status: updates.status,
        dueDate: updates.dueDate,
        order: updates.order,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      projectId: data.projectId,
      title: data.title,
      assignee: data.assignee || undefined,
      status: data.status,
      dueDate: data.dueDate,
      order: data.order,
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('tasks').delete().eq('id', id)

    if (error) throw error
  },
}

export type User = {
  id: string
  email: string
  name: string | null
  created_at: string
  updated_at: string
}

export type Task = {
  id: string
  user_id: string
  title: string
  description: string | null
  due_date: string | null
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'completed'
  created_at: string
  updated_at: string
}

export type CreateTaskInput = Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>
export type UpdateTaskInput = Partial<CreateTaskInput> 
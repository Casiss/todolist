import { useEffect, useState } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Task } from '@/types/database'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Home() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    fetchTasks()
  }, [user])

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">タスク一覧</h1>

      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">タスクがありません</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
            >
              <div>
                <h2 className="font-semibold">{task.title}</h2>
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <p>優先度: {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}</p>
                  <p>期限: {task.due_date ? new Date(task.due_date).toLocaleDateString() : '未設定'}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {/* TODO: ステータス更新の実装 */}}
                  className={`px-3 py-1 rounded ${
                    task.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {task.status === 'completed' ? '完了' : '未完了'}
                </button>
                <Link
                  href={`/tasks/${task.id}`}
                  className="text-blue-500 hover:text-blue-600"
                >
                  詳細
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 
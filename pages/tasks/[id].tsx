import { useEffect, useState } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { Task } from '@/types/database'
import Link from 'next/link'

export default function TaskDetail() {
  const router = useRouter()
  const { id } = router.query
  const supabase = useSupabaseClient()
  const user = useUser()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id && user) {
      fetchTask()
    }
  }, [id, user])

  const fetchTask = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setTask(data)
    } catch (error) {
      console.error('Error fetching task:', error)
      alert('タスクの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusToggle = async () => {
    if (!task) return

    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed'
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', task.id)

      if (error) throw error
      setTask({ ...task, status: newStatus })
    } catch (error) {
      console.error('Error updating task status:', error)
      alert('ステータスの更新に失敗しました')
    }
  }

  const handleDelete = async () => {
    if (!confirm('このタスクを削除してもよろしいですか？')) return

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', task?.id)

      if (error) throw error
      router.push('/')
    } catch (error) {
      console.error('Error deleting task:', error)
      alert('タスクの削除に失敗しました')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-gray-500 mb-4">タスクが見つかりません</p>
        <Link href="/" className="text-blue-500 hover:text-blue-600">
          タスク一覧に戻る
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <button
            onClick={handleStatusToggle}
            className={`px-3 py-1 rounded ${
              task.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {task.status === 'completed' ? '完了' : '未完了'}
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <h2 className="text-sm font-medium text-gray-500">説明</h2>
            <p className="mt-1">{task.description || '説明はありません'}</p>
          </div>

          <div className="flex gap-6">
            <div>
              <h2 className="text-sm font-medium text-gray-500">優先度</h2>
              <p className="mt-1">
                {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">期限</h2>
              <p className="mt-1">
                {task.due_date ? new Date(task.due_date).toLocaleDateString() : '未設定'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/"
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            戻る
          </Link>
          <Link
            href={`/tasks/${task.id}/edit`}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            編集
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  )
} 
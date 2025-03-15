import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Header() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // ログアウト後、ログインページにリダイレクト
      router.push('/auth/login')
    } catch (error) {
      console.error('Error signing out:', error)
      alert('ログアウトに失敗しました')
    }
  }

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {user ? (
            <Link href="/" className="text-xl font-bold hover:text-blue-600">
              TODOリスト
            </Link>
          ) : (
            // 未ログインの場合は通常のテキストとして表示
            <span className="text-xl font-bold">
              TODOリスト
            </span>
          )}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-600">{user.email}</span>
                <Link
                  href="/tasks/new"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  新規タスク
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                ログイン
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 
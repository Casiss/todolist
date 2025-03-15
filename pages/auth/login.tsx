import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Login() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user])

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="light"
        providers={['github', 'google']}
        redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}`}
        localization={{
          variables: {
            sign_in: {
              email_label: 'メールアドレス',
              password_label: 'パスワード',
              button_label: 'ログイン',
              email_input_placeholder: 'メールアドレス',
              password_input_placeholder: 'パスワード'
            },
            sign_up: {
              email_label: 'メールアドレス',
              password_label: 'パスワード',
              button_label: '新規登録',
              email_input_placeholder: 'メールアドレス',
              password_input_placeholder: 'パスワード'
            }
          }
        }}
      />
    </div>
  )
} 
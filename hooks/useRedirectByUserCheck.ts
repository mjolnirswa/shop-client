import { checkUserAuthFx } from '@/app/api/auth'
import { setUser } from '@/context/user'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

const useRedirectByUserCheck = (isAuthPage = false) => {
  const [shouldLoadContent, setShouldLoadContent] = useState(false)
  const router = useRouter()
  const shouldCheckAyrh = useRef(true)

  useEffect(() => {
    if (shouldCheckAyrh.current) {
      shouldCheckAyrh.current = false
      checkUser()
    }
  }, [])

  const checkUser = async () => {
    const user = await checkUserAuthFx('/users/login-check')

    if (isAuthPage) {
      if (!user) {
        setShouldLoadContent(true)
        return
      }

      router.push('/dashboard')
      return
    }

    if (user) {
      setUser(user)
      setShouldLoadContent(true)
      return
    }

    router.push('/')
  }

  return { shouldLoadContent }
}

export default useRedirectByUserCheck

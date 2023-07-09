import { useForm } from 'react-hook-form'
import NameInput from '@/components/elements/AuthPage/NameInput'
import { IInputs } from '@/types/auth'
import { toast } from 'react-toastify'
import PasswordInput from '@/components/elements/AuthPage/PasswordInput'
import { signInfx } from '@/app/api/auth'
import { useState } from 'react'
import spinnerStyles from '@/styles/spinner/spinner.module.scss'
import styles from '@/styles/auth/index.module.scss'
import { showAuthError } from '@/utils/errors'
import { $mode } from '@/context/mode'
import { useStore } from 'effector-react'
import { useRouter } from 'next/router'

const SignInForm = () => {
  const [spinner, setSpinner] = useState(false)
  const route = useRouter()

  const mode = useStore($mode)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  const {
    register,
    formState: { errors },
    handleSubmit,
    resetField,
  } = useForm<IInputs>()

  const onSubmit = async (data: IInputs) => {
    setSpinner(true)
    try {
      await signInfx({
        url: '/users/login',
        username: data.name,
        password: data.password,
      })

      setSpinner(false)
      resetField('name')
      resetField('password')
      route.push('/dashboard')
    } catch (e) {
      setSpinner(false)
      showAuthError(e)
      toast.error((e as Error).message)
    } finally {
      setSpinner(false)
    }
  }

  return (
    <form
      className={`${styles.form} ${darkModeClass}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className={`${styles.form__title} ${styles.title} ${darkModeClass}`}>
        Войти
      </h2>
      <NameInput register={register} errors={errors} />
      <PasswordInput register={register} errors={errors} />
      <button
        className={`${styles.form__button} ${styles.button} ${styles.submit} ${darkModeClass}`}
      >
        {spinner ? <div className={spinnerStyles.spinner} /> : 'SIGN IN'}
      </button>
    </form>
  )
}

export default SignInForm

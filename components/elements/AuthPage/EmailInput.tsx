import { IAuthPageInput } from '@/types/auth'
import styles from '@/styles/auth/index.module.scss'

const EmailInput = ({ register, errors }: IAuthPageInput) => {
  return (
    <label className={styles.form__label}>
      <input
        {...register('email', {
          required: 'Введите email!',
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: 'Неправильный email!',
          },
        })}
        className={styles.form__input}
        type="email"
        placeholder="Email"
      />
      {errors.email && (
        <span className={styles.error_alert}>{errors.email?.message}</span>
      )}
    </label>
  )
}

export default EmailInput

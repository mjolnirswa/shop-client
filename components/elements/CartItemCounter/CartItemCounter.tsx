import { $mode } from '@/context/mode'
import { useStore } from 'effector-react'
import styles from '@/styles/cartPopup/index.module.scss'
import MinusSvg from '../MinusSvg/MinusSvg'
import PlusSvg from '../PlusSvg/PlusSvg'
import { useEffect, useState } from 'react'
import { ICartItemCounterProps } from '@/types/shopping-cart'
import spinnerStyles from '@/styles/spinner/spinner.module.scss'
import { toast } from 'react-toastify'
import { updateCartItemFx } from '@/app/api/shoppingCart'
import { updateCartItemCount } from '@/context/shopping-cart'

const CartItemCount = ({
  totalCount,
  partId,
  increasePrice,
  decreasePrice,
  initialCount,
}: ICartItemCounterProps) => {
  const mode = useStore($mode)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const spinnerDarkModeClass =
    mode === 'dark' ? '' : `${spinnerStyles.dark_mode}`
  const [spinner, setSpinner] = useState(false)
  const [count, setCount] = useState(initialCount)
  const [disableIncrease, setDisableIncrease] = useState(false)
  const [disableDecrease, setDisableDecrease] = useState(false)

  useEffect(() => {
    if (count === 1) {
      setDisableDecrease(true)
    }

    if (count === totalCount) {
      setDisableIncrease(true)
    }
  }, [count, totalCount])

  const increase = async () => {
    try {
      setSpinner(true)
      increasePrice()
      setDisableDecrease(false)
      setCount((count) => count + 1)

      const data = await updateCartItemFx({
        url: `/shopping-cart/count/${partId}`,
        payload: { count: count + 1 },
      })

      updateCartItemCount({ partId, count: data.count })
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setSpinner(false)
    }
  }

  const decrease = async () => {
    try {
      setSpinner(true)
      decreasePrice()
      setDisableIncrease(false)
      setCount((count) => count - 1)

      const data = await updateCartItemFx({
        url: `/shopping-cart/count/${partId}`,
        payload: { count: count - 1 },
      })

      updateCartItemCount({ partId, count: data.count })
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setSpinner(false)
    }
  }

  return (
    <div
      className={`${styles.cart__popup__list__item__counter} ${darkModeClass}`}
    >
      <button disabled={disableDecrease} onClick={decrease}>
        <MinusSvg />
      </button>

      <span>
        {spinner ? (
          <span
            className={`${spinnerStyles.spinner} ${spinnerDarkModeClass}`}
            style={{ top: 4, left: 33, width: 20, height: 20 }}
          />
        ) : (
          count
        )}
      </span>

      <button disabled={disableIncrease} onClick={increase}>
        <PlusSvg />
      </button>
    </div>
  )
}

export default CartItemCount

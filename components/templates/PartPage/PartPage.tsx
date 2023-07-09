import { $mode } from '@/context/mode'
import { useStore } from 'effector-react'
import styles from '@/styles/part/index.module.scss'
import { $boilerPart } from '@/context/boilerPart'
import PartImageList from '@/components/modules/PartPage/PartImageList'
import { formatPrice } from '@/utils/common'
import { $shoppingCart } from '@/context/shopping-cart'
import { useEffect, useState } from 'react'
import spinnerStyles from '@/styles/spinner/spinner.module.scss'
import CartHoverCheckedSvg from '@/components/elements/CartHoverCheckedSvg/CartHoverCheckedSvg'
import CartHoverSvg from '@/components/elements/CartHoverSvg/CartHoverSvg'
import { $user } from '@/context/user'
import { toggleCartItem } from '@/utils/shopping-cart'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import PartTabs from '@/components/modules/PartPage/PartTabs'
import DashboardSlider from '@/components/modules/DashboardPage/DashboardSlider'
import { toast } from 'react-toastify'
import { getBoilerPartsFx } from '@/app/api/boilerparts'
import {
  $boilerParts,
  setBoilerParts,
  setBoilerPartsByPopulatity,
} from '@/context/boilerparts'
import PartAccordion from '@/components/modules/PartPage/PartAccordion'
import { removeFromCartFx } from '@/app/api/shoppingCart'

const PartPage = () => {
  const mode = useStore($mode)
  const user = useStore($user)
  const isMobile = useMediaQuery(850)
  const boilerPart = useStore($boilerPart)
  const boilerParts = useStore($boilerParts)
  const cartItems = useStore($shoppingCart)
  const spinnerToggleCart = useStore(removeFromCartFx.pending)
  const [spinnerSlider, setSpinnerSlider] = useState(false)

  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const isInCart = cartItems.some((item) => item.partId === boilerPart.id)

  useEffect(() => {
    loadBoilerParts()
  }, [])

  const loadBoilerParts = async () => {
    try {
      setSpinnerSlider(true)
      const data = await getBoilerPartsFx('/boiler-parts?limit=20&offset=0')

      setBoilerParts(data)
      setBoilerPartsByPopulatity()
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setSpinnerSlider(false)
    }
  }

  const toggleToCart = () => {
    toggleCartItem(user.username, boilerPart.id, isInCart)
  }

  return (
    <section>
      <div className={`container`}>
        <div className={`${styles.part__top} ${darkModeClass}`}>
          <h2 className={`${styles.part__title} ${darkModeClass}`}>
            {boilerPart.name}
          </h2>
          <div className={styles.part__inner}>
            <PartImageList />
            <div>
              <span className={`${styles.part__info__price} ${darkModeClass}`}>
                {formatPrice(boilerPart.price || 0)} P
              </span>
              <span className={styles.part__info__stock}>
                {boilerPart.in_stock > 0 ? (
                  <span className={styles.part__info__stock__success}>
                    Есть на складе
                  </span>
                ) : (
                  <span className={styles.part__info__stock__not}>
                    Нет на складе
                  </span>
                )}
              </span>
              <span className={`${styles.part__info__code} ${darkModeClass}`}>
                Артикул: {boilerPart.vendor_code}
              </span>

              <button
                className={`${styles.part__info__btn} ${
                  isInCart ? styles.in_cart : ''
                }`}
                onClick={toggleToCart}
              >
                {spinnerToggleCart ? (
                  <span
                    className={spinnerStyles.spinner}
                    style={{ top: 10, left: '45%' }}
                  />
                ) : (
                  <>
                    <span className={styles.part__info__btn__icon}>
                      {isInCart ? <CartHoverCheckedSvg /> : <CartHoverSvg />}
                    </span>
                    {isInCart ? (
                      <span>Добавлено в карзину</span>
                    ) : (
                      <span>Положить в корзину</span>
                    )}
                  </>
                )}
              </button>
              {!isMobile && <PartTabs />}
            </div>
          </div>
        </div>

        {isMobile && (
          <div className={styles.part__accordion}>
            <div className={styles.part__accordion__inner}>
              <PartAccordion title="Описание">
                <div
                  className={`${styles.part__accordion__content} ${darkModeClass}`}
                >
                  <h3
                    className={`${styles.part__tabs__content__title} ${darkModeClass}`}
                  >
                    {boilerPart.name}
                  </h3>
                  <p
                    className={`${styles.part__tabs__content__text} ${darkModeClass}`}
                  >
                    {boilerPart.description}
                  </p>
                </div>
              </PartAccordion>
            </div>
            <PartAccordion title="Совместимость">
              <div
                className={`${styles.part__accordion__content} ${darkModeClass}`}
              >
                <p
                  className={`${styles.part__tabs__content__text} ${darkModeClass}`}
                >
                  {boilerPart.compatibility}
                </p>
              </div>
            </PartAccordion>
          </div>
        )}

        <div className={`${styles.part__bottom} ${darkModeClass}`}>
          <h2 className={`${styles.part__title} ${darkModeClass}`}>
            Вам понравится
          </h2>
          <DashboardSlider
            goToPartPage
            spinner={spinnerSlider}
            items={boilerParts.rows || []}
          />
        </div>
      </div>
    </section>
  )
}

export default PartPage

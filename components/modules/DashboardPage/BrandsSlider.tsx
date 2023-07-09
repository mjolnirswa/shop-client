/* eslint-disable @next/next/no-img-element */
import Slider from 'react-slick'
import { useStore } from 'effector-react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { $mode } from '@/context/mode'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useEffect } from 'react'
import styles from '@/styles/dashboard/index.module.scss'
import BrandSliderNextArrow from '@/components/elements/BrandSliderNextArrow/BrandSliderNextArrow'
import BrandSliderPrevArrow from '@/components/elements/BrandSliderArrowPrev/BrandSliderArrowPrev'

const BrandsSlider = () => {
  const isMedia768 = useMediaQuery(768)
  const mode = useStore($mode)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  const brandItems = [
    { id: 1, img: '/img/brand-1.png', alt: 'brand1' },
    { id: 2, img: '/img/brand-2.png', alt: 'brand1' },
    { id: 3, img: '/img/brand-3.png', alt: 'brand1' },
    { id: 4, img: '/img/brand-4.png', alt: 'brand1' },
    { id: 5, img: '/img/brand-1.png', alt: 'brand1' },
    { id: 6, img: '/img/brand-2.png', alt: 'brand1' },
    { id: 7, img: '/img/brand-3.png', alt: 'brand1' },
    { id: 8, img: '/img/brand-4.png', alt: 'brand1' },
    { id: 9, img: '/img/brand-1.png', alt: 'brand1' },
    { id: 10, img: '/img/brand-2.png', alt: 'brand1' },
    { id: 11, img: '/img/brand-3.png', alt: 'brand1' },
    { id: 12, img: '/img/brand-4.png', alt: 'brand1' },
  ]

  useEffect(() => {
    const slider = document.querySelector(
      `.${styles.dashboard__brands__slider}`
    )

    const list = slider?.querySelector('.slick-list') as HTMLElement

    list.style.height = isMedia768 ? '60px' : '80px'
  }, [isMedia768])

  const settings = {
    dots: false,
    infinite: true,
    slidesToScroll: 1,
    variableWidth: true,
    autoplay: true,
    speed: 500,
    nextArrow: <BrandSliderNextArrow modeClass={darkModeClass} />,
    prevArrow: <BrandSliderPrevArrow modeClass={darkModeClass} />,
  }

  return (
    <Slider {...settings} className={styles.dashboard__brands__slider}>
      {brandItems.map((item) => (
        <div
          className={`${styles.dashboard__brands__slide} ${darkModeClass}`}
          key={item.id}
          style={{ width: isMedia768 ? 124 : 180 }}
        >
          <img src={item.img} alt={item.alt} />
        </div>
      ))}
    </Slider>
  )
}

export default BrandsSlider

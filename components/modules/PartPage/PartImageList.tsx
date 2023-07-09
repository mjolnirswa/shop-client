/* eslint-disable @next/next/no-img-element */
import { useStore } from 'effector-react'
import styles from '@/styles/part/index.module.scss'
import { $boilerPart } from '@/context/boilerPart'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useState } from 'react'
import PartImageItem from './PartImageItem'
import PartSlider from './PartSlider'

const PartImageList = () => {
  const boilerPart = useStore($boilerPart)
  const isMobile = useMediaQuery(850)
  const images = boilerPart.images
    ? (JSON.parse(boilerPart.images) as string[])
    : []
  const [currentImageSrc, setCurrentImageSrc] = useState('')

  return (
    <div className={styles.part__images}>
      {isMobile ? (
        <PartSlider images={images} />
      ) : (
        <>
          <div className={styles.part__images__main}>
            <img src={currentImageSrc || images[0]} alt={boilerPart.name} />
          </div>

          <ul className={styles.part__images__list}>
            {images.map((item, i) => (
              <PartImageItem
                key={i}
                alt={`image-${i + 1}`}
                callback={setCurrentImageSrc}
                src={item}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default PartImageList
